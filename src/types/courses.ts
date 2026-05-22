export interface CourseFormValues {
  name: string
  description: string
  start_date: string
  end_date: string
  capacity: number | null
  is_active: boolean
}

export interface CourseCreatePayload {
  name: string
  description?: string | null
  start_date: string
  end_date: string
  capacity?: number | null
  is_active?: boolean
}

export interface CourseUpdatePayload {
  name?: string
  description?: string | null
  start_date?: string
  end_date?: string
  capacity?: number | null
  is_active?: boolean
}

export interface CourseRecord {
  id: number
  name: string
  description: string | null
  start_date: string
  end_date: string
  capacity: number | null
  is_active: boolean
}

export interface CoursesFeedback {
  type: 'success' | 'error'
  message: string
}
