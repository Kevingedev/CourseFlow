import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { RegisterInput, User } from '@/types/auth'
import Cookies from 'js-cookie'
import { authService } from '@/services/authService'

const USER_STORAGE_KEY = 'cf_user'
const SESSION_STORAGE_KEY = 'cf_session'
const ACTIVE_SESSION_VALUE = 'active'

const getStoredUser = (): User | null => {
  const cookieValue = Cookies.get(USER_STORAGE_KEY)
  const localValue = localStorage.getItem(USER_STORAGE_KEY)
  const rawValue = cookieValue || localValue

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as User
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(getStoredUser())
  const token = ref<string | null>(null)
  const hasSession = ref(
    Cookies.get(SESSION_STORAGE_KEY) === ACTIVE_SESSION_VALUE ||
      localStorage.getItem(SESSION_STORAGE_KEY) === ACTIVE_SESSION_VALUE,
  )
  const isInitialized = ref(false)
  let initializePromise: Promise<void> | null = null

  // Getters
  const isAuthenticated = computed(() => hasSession.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const isAdminOrSuadmin = computed(() => {
    return userRole.value === 'admin' || userRole.value === 'suadmin'
  })

  const persistSession = (nextUser: User, nextToken: string) => {
    user.value = nextUser
    token.value = nextToken
    hasSession.value = true

    Cookies.set(USER_STORAGE_KEY, JSON.stringify(nextUser), { expires: 7, sameSite: 'lax' })
    Cookies.set(SESSION_STORAGE_KEY, ACTIVE_SESSION_VALUE, { expires: 7, sameSite: 'lax' })
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))
    localStorage.setItem(SESSION_STORAGE_KEY, ACTIVE_SESSION_VALUE)
  }

  function clearSession() {
    user.value = null
    token.value = null
    hasSession.value = false

    Cookies.remove(USER_STORAGE_KEY)
    Cookies.remove(SESSION_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(SESSION_STORAGE_KEY)
  }

  // Actions
  /**
   * Log in user using email and password
   */
  async function login(email: string, password: string): Promise<User> {
    try {
      const result = await authService.login(email, password)

      persistSession(result.user, result.token)
      return result.user
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Error de inicio de sesión.'
      throw new Error(errMsg)
    }
  }

  /**
   * Registers a new user and logs them in
   */
  async function register(userData: RegisterInput): Promise<User> {
    try {
      await authService.register({
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
        dni_nie: userData.dniNie || null,
        birth_date: userData.birthDate || null,
      })

      return await login(userData.email, userData.password)
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Error en el registro.'
      throw new Error(errMsg)
    }
  }

  /**
   * Logs out user and destroys session
   */
  async function logout() {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout service call failed:', error)
    } finally {
      clearSession()
    }
  }

  /**
   * Initializes auth state from the backend if a session marker exists locally.
   */
  async function initialize() {
    if (isInitialized.value) {
      return
    }

    if (initializePromise) {
      return initializePromise
    }

    initializePromise = (async () => {
      if (!hasSession.value) {
        clearSession()
        isInitialized.value = true
        return
      }

      try {
        const currentUser = await authService.getCurrentUser()
        persistSession(currentUser, 'cookie_session_active')
      } catch {
        clearSession()
      } finally {
        isInitialized.value = true
      }
    })()

    await initializePromise
    initializePromise = null
  }

  return {
    user,
    token,
    hasSession,
    isInitialized,
    isAuthenticated,
    userRole,
    isAdminOrSuadmin,
    login,
    register,
    logout,
    initialize,
    clearSession,
  }
})
