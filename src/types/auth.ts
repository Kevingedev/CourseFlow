export type UserRole = 'admin' | 'suadmin' | 'user'

export interface User {
  id: string
  fullName: string
  name: string
  email: string
  role: UserRole
  createdAt?: string
}

export interface AuthResponse {
  user: User
  token: string
}
