import type { User } from '@/types/auth'

export interface AdminUserFormValues {
  name: string
  email: string
  password: string
}

export interface AdminUserCreatePayload {
  name: string
  email: string
  password: string
}

export interface AdminUserUpdatePayload {
  name?: string
  email?: string
}

export interface AdminUsersFeedback {
  type: 'success' | 'error'
  message: string
}

export type AdminUserRecord = User
