import api from './api'
import type { User } from '@/types/auth'

const mapRole = (role: string): User['role'] => {
  return role === 'superadmin' ? 'suadmin' : (role as User['role'])
}

const mapUser = (data: Record<string, unknown>): User => ({
  id: String(data.id),
  name: String(data.name),
  fullName: String(data.name),
  email: String(data.email),
  role: mapRole(String(data.role)),
  dniNie: typeof data.dni_nie === 'string' ? data.dni_nie : null,
  birthDate: typeof data.birth_date === 'string' ? data.birth_date : null,
  createdAt: typeof data.createdAt === 'string' ? data.createdAt : undefined,
})

const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response
  ) {
    const data = error.response.data as { detail?: unknown }

    if (typeof data.detail === 'string') {
      return data.detail
    }

    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item) => {
          if (typeof item === 'string') {
            return item
          }

          if (item && typeof item === 'object' && 'msg' in item && typeof item.msg === 'string') {
            return item.msg
          }

          return null
        })
        .filter(Boolean)
        .join(' ')
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}

export const authService = {
  /**
   * Registers a new user.
   */
  async register(payload: {
    name: string
    email: string
    password: string
    dni_nie?: string | null
    birth_date?: string | null
  }): Promise<User> {
    try {
      const response = await api.post<any>('/api/v1/auth/register', {
        ...payload,
        dni_nie: payload.dni_nie || null,
        birth_date: payload.birth_date || null,
        role: 'user'
      })

      return mapUser(response.data)
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'No se pudo completar el registro.'))
    }
  },

  /**
   * Logs in a user.
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      await api.post('/api/v1/auth/login', { email, password })
      const user = await this.getCurrentUser()

      return { user, token: 'cookie_session_active' }
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'Correo o contraseña incorrectos.'))
    }
  },

  /**
   * Fetches the current authenticated user's profile.
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<any>('/api/v1/users/me')
    return mapUser(response.data)
  },

  /**
   * Logs out the user.
   */
  async logout(): Promise<void> {
    try {
      await api.post('/api/v1/auth/logout')
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, 'No se pudo cerrar la sesión.')

      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'status' in error.response &&
        error.response.status === 401
      ) {
        return
      }

      throw new Error(message)
    }
  }
}
