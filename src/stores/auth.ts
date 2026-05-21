import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/auth'
import Cookies from 'js-cookie'
import { authService } from '@/services/authService'

interface UserWithPassword extends User {
  password?: string
}

export const useAuthStore = defineStore('auth', () => {
  // Restore initial state from cookies (fallback to localStorage)
  const user = ref<User | null>(
    Cookies.get('cf_user')
      ? JSON.parse(Cookies.get('cf_user')!)
      : (localStorage.getItem('cf_user') ? JSON.parse(localStorage.getItem('cf_user')!) : null)
  )
  const token = ref<string | null>(
    Cookies.get('cf_token') || localStorage.getItem('cf_token')
  )

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || null)
  const isAdminOrSuadmin = computed(() => {
    return userRole.value === 'admin' || userRole.value === 'suadmin'
  })

  // Actions
  /**
   * Log in user using email and password
   */
  async function login(email: string, password: string): Promise<User> {
    try {
      const result = await authService.login(email, password)

      // Update Pinia state
      user.value = result.user
      token.value = result.token

      // Persist in cookies and localStorage for double safety and HU-001 compliance
      Cookies.set('cf_user', JSON.stringify(user.value), { expires: 7 })
      Cookies.set('cf_token', result.token, { expires: 7 })
      localStorage.setItem('cf_user', JSON.stringify(user.value))
      localStorage.setItem('cf_token', result.token)

      return user.value
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Error de inicio de sesión.'
      throw new Error(errMsg)
    }
  }

  /**
   * Registers a new user and logs them in
   */
  async function register(userData: Omit<UserWithPassword, 'id' | 'role' | 'createdAt' | 'name'>): Promise<User> {
    try {
      if (!userData.password) {
        throw new Error('La contraseña es requerida.')
      }
      // 1. Create the new user
      await authService.register(userData.fullName, userData.email, userData.password)

      // 2. Auto-login after registration
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
      user.value = null
      token.value = null
      Cookies.remove('cf_user')
      Cookies.remove('cf_token')
      localStorage.removeItem('cf_user')
      localStorage.removeItem('cf_token')
    }
  }

  /**
   * Initializes auth state (noop since it runs reactive initialization automatically)
   */
  function initialize() {
    // Already reactively initialized
  }

  return {
    user,
    token,
    isAuthenticated,
    userRole,
    isAdminOrSuadmin,
    login,
    register,
    logout,
    initialize
  }
})
