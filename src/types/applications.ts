export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled'

export interface ApplicationUser {
  name: string
  email: string
}

export interface ApplicationRecord {
  id: number
  user_id: number
  course_id: number
  status: ApplicationStatus
  has_darde: boolean | null
  previous_education: string | null
  user?: ApplicationUser | null
}

export interface ApplicationsFeedback {
  type: 'success' | 'error'
  message: string
}
