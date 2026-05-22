export type UserRole = 'admin' | 'suadmin' | 'user'

export interface User {
  id: string
  fullName: string
  name: string
  email: string
  role: UserRole
  dniNie?: string | null
  birthDate?: string | null
  createdAt?: string
  isActive?: boolean
}

export interface AuthResponse {
  user: User
  token: string
}

export interface RegisterInput {
  fullName: string
  email: string
  password: string
  dniNie?: string
  birthDate?: string
}
