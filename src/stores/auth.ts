import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/auth'
import axios from 'axios'

interface UserWithPassword extends User {
  password?: string
}

export const useAuthStore = defineStore('auth', () => {
  // Restore initial state from localStorage
  const user = ref<User | null>(
    localStorage.getItem('cf_user') ? JSON.parse(localStorage.getItem('cf_user')!) : null
  )
  const token = ref<string | null>(localStorage.getItem('cf_token'))

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

      // Persist in localStorage
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
   * Logs out user and destroys session
   */
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('cf_user')
    localStorage.removeItem('cf_token')
  }

  return {
    user,
    token,
    isAuthenticated,
    userRole,
    isAdminOrSuadmin,
    login,
    logout
  }
})
