import api from './api'
import type { User } from '@/types/auth'

const isMock = !import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL.includes('3000')
const MOCK_TOKEN = import.meta.env.VITE_MOCK_TOKEN || 'mock-jwt-token-xyz123'

export const authService = {
  /**
   * Registers a new user.
   */
  async register(name: string, email: string, password: string): Promise<User> {
    if (isMock) {
      // 1. Check if user already exists
      const checkResponse = await api.get<any[]>('/users', {
        params: { email }
      })

      if (checkResponse.data.length > 0) {
        throw new Error('El correo electrónico ya está registrado.')
      }

      // 2. Create the new user
      const response = await api.post<any>('/users', {
        fullName: name,
        name,
        email,
        password,
        role: 'user',
        createdAt: new Date().toISOString()
      })

      return {
        id: String(response.data.id),
        name: response.data.name || response.data.fullName,
        fullName: response.data.fullName || response.data.name,
        email: response.data.email,
        role: response.data.role,
        createdAt: response.data.createdAt
      }
    } else {
      const response = await api.post<any>('/api/v1/auth/register', {
        name,
        email,
        password,
        dni_nie: null,
        birth_date: null,
        role: 'user'
      })

      const data = response.data
      return {
        id: String(data.id),
        name: data.name,
        fullName: data.name,
        email: data.email,
        role: data.role === 'superadmin' ? 'suadmin' : data.role,
        createdAt: data.createdAt
      }
    }
  },

  /**
   * Logs in a user.
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    if (isMock) {
      const response = await api.get<any[]>('/users', {
        params: { email }
      })
      const foundUser = response.data.find(u => u.password === password)

      if (!foundUser) {
        throw new Error('Correo o contraseña incorrectos.')
      }

      const user: User = {
        id: String(foundUser.id),
        name: foundUser.name || foundUser.fullName || 'Usuario',
        fullName: foundUser.fullName || foundUser.name || 'Usuario',
        email: foundUser.email,
        role: foundUser.role,
        createdAt: foundUser.createdAt
      }

      return { user, token: MOCK_TOKEN }
    } else {
      // 1. Post credentials to establish the HttpOnly cookie session
      await api.post('/api/v1/auth/login', { email, password })

      // 2. Fetch the authenticated user profile using GET /api/v1/users/me
      const user = await this.getCurrentUser()

      // Return user details and a placeholder token for frontend compatibility
      return { user, token: 'cookie_session_active' }
    }
  },

  /**
   * Fetches the current authenticated user's profile.
   */
  async getCurrentUser(): Promise<User> {
    if (isMock) {
      throw new Error('getCurrentUser is not supported in mock mode')
    }
    const response = await api.get<any>('/api/v1/users/me')
    const data = response.data
    return {
      id: String(data.id),
      name: data.name,
      fullName: data.name,
      email: data.email,
      role: data.role === 'superadmin' ? 'suadmin' : data.role,
      createdAt: data.createdAt
    }
  },

  /**
   * Logs out the user.
   */
  async logout(): Promise<void> {
    if (!isMock) {
      try {
        await api.post('/api/v1/auth/logout')
      } catch (err) {
        console.error('API logout failed, cleaning up frontend anyway:', err)
      }
    }
  }
}
