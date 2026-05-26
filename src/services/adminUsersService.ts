import api from './api'
import type {
  AdminUserCreatePayload,
  AdminUserRecord,
  AdminUserUpdatePayload,
} from '@/types/adminUsers'

interface RawAdminUser {
  id: number
  name: string
  email: string
  role: string
  dni_nie?: string | null
  birth_date?: string | null
  is_active?: boolean
}

const mapAdminRole = (role: string): AdminUserRecord['role'] => {
  return role === 'superadmin' ? 'suadmin' : 'admin'
}

const mapAdminUser = (user: RawAdminUser): AdminUserRecord => ({
  id: String(user.id),
  name: user.name,
  fullName: user.name,
  email: user.email,
  role: mapAdminRole(user.role),
  dniNie: user.dni_nie ?? null,
  birthDate: user.birth_date ?? null,
  isActive: user.is_active ?? true,
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

export const adminUsersService = {
  async getAdminUsers(): Promise<AdminUserRecord[]> {
    try {
      const response = await api.get<RawAdminUser[]>('/api/admin/users')
      return response.data.map(mapAdminUser)
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'No se pudo cargar la lista de administradores.'))
    }
  },

  async createAdminUser(payload: AdminUserCreatePayload): Promise<AdminUserRecord> {
    try {
      const response = await api.post<RawAdminUser>('/api/admin/users', payload)
      return mapAdminUser(response.data)
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'No se pudo crear el administrador.'))
    }
  },

  async updateAdminUser(userId: string, payload: AdminUserUpdatePayload): Promise<AdminUserRecord> {
    try {
      const response = await api.patch<RawAdminUser>(`/api/admin/users/${userId}`, payload)
      return mapAdminUser(response.data)
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'No se pudo actualizar el administrador.'))
    }
  },

  async updateAdminUserStatus(userId: string, isActive: boolean): Promise<AdminUserRecord> {
    try {
      const response = await api.patch<RawAdminUser>(`/api/admin/users/${userId}`, {
        is_active: isActive,
      })
      return mapAdminUser(response.data)
    } catch (error: unknown) {
      throw new Error(
        getApiErrorMessage(error, 'No se pudo actualizar el estado del administrador.'),
      )
    }
  },

  async deleteAdminUser(userId: string): Promise<void> {
    try {
      await api.delete(`/api/admin/users/${userId}`)
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'No se pudo eliminar el administrador.'))
    }
  },
}
