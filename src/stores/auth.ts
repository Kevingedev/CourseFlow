import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/auth'
import axios from 'axios'
import Cookies from 'js-cookie'

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
   * Log in user using email and password against JSON Server
   */
  async function login(email: string, password: string): Promise<User> {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    try {
      // Query users endpoint for matching email
      const response = await axios.get<UserWithPassword[]>(`${baseURL}/users`, {
        params: { email }
      })

      const foundUser = response.data.find(u => u.password === password)

      if (!foundUser) {
        throw new Error('Correo o contraseña incorrectos.')
      }

      // Generate a mock JWT-like bearer token for the session
      const generatedToken = import.meta.env.VITE_MOCK_TOKEN || `mock-bearer-token-${foundUser.id}-${Date.now()}`

      // Update Pinia state
      user.value = {
        id: foundUser.id,
        fullName: foundUser.fullName || foundUser.name || 'Usuario',
        name: foundUser.name || foundUser.fullName || 'Usuario',
        email: foundUser.email,
        role: foundUser.role,
        createdAt: foundUser.createdAt
      }
      token.value = generatedToken

      // Persist in cookies and localStorage for double safety and HU-001 compliance
      Cookies.set('cf_user', JSON.stringify(user.value), { expires: 7 })
      Cookies.set('cf_token', generatedToken, { expires: 7 })
      localStorage.setItem('cf_user', JSON.stringify(user.value))
      localStorage.setItem('cf_token', generatedToken)

      return user.value
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          throw new Error('Servidor API no disponible.')
        }
        throw new Error(error.message || 'Error de inicio de sesión.')
      }
      const err = error as Error
      throw new Error(err.message || 'Error de inicio de sesión.')
    }
  }

  /**
   * Registers a new user and logs them in
   */
  async function register(userData: Omit<UserWithPassword, 'id' | 'role' | 'createdAt' | 'name'>): Promise<User> {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    try {
      // 1. Check if user already exists
      const checkResponse = await axios.get<UserWithPassword[]>(`${baseURL}/users`, {
        params: { email: userData.email }
      })

      if (checkResponse.data.length > 0) {
        throw new Error('El correo electrónico ya está registrado.')
      }

      // 2. Create the new user
      const newUserPayload: Omit<UserWithPassword, 'id'> = {
        fullName: userData.fullName,
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
        role: 'user',
        createdAt: new Date().toISOString()
      }

      const createResponse = await axios.post<UserWithPassword>(`${baseURL}/users`, newUserPayload)
      const createdUser = createResponse.data

      // 3. Auto-login after registration
      const generatedToken = import.meta.env.VITE_MOCK_TOKEN || `mock-bearer-token-${createdUser.id}-${Date.now()}`

      user.value = {
        id: createdUser.id,
        fullName: createdUser.fullName || createdUser.name || 'Usuario',
        name: createdUser.name || createdUser.fullName || 'Usuario',
        email: createdUser.email,
        role: createdUser.role,
        createdAt: createdUser.createdAt
      }
      token.value = generatedToken

      // Persist in cookies and localStorage for double safety and HU-001 compliance
      Cookies.set('cf_user', JSON.stringify(user.value), { expires: 7 })
      Cookies.set('cf_token', generatedToken, { expires: 7 })
      localStorage.setItem('cf_user', JSON.stringify(user.value))
      localStorage.setItem('cf_token', generatedToken)

      return user.value
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          throw new Error('Servidor API no disponible.')
        }
        throw new Error(error.message || 'Error en el registro.')
      }
      const err = error as Error
      throw new Error(err.message || 'Error en el registro.')
    }
  }

  /**
   * Logs out user and destroys session
   */
  function logout() {
    user.value = null
    token.value = null
    Cookies.remove('cf_user')
    Cookies.remove('cf_token')
    localStorage.removeItem('cf_user')
    localStorage.removeItem('cf_token')
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
