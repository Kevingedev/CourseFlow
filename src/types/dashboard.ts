export interface Application {
  id: string | number
  user_id: string | number
  course_id: string | number
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  has_darde: boolean
  previous_education?: string
  formacion_previa_detalle?: string
  created_at?: string
}

export interface Course {
  id: string | number
  name: string
  description: string | null
  start_date: string
  end_date: string
  category?: string
  capacity: number | null
  is_active: boolean
}

export interface WaitingListEntry {
  id: string | number
  user_id: string | number
  course_id: string | number
  position?: number
  created_at: string
}
