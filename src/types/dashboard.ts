export interface Application {
  id: string | number
  user_id: string | number
  course_id: string | number
  status: 'Pending' | 'Approved' | 'Rejected' | 'Admitted'
  has_darde: boolean
  previous_education?: string
  formacion_previa_detalle?: string
  created_at: string
}

export interface Course {
  id: string | number
  name: string
  description: string
  start_date: string
  end_date: string
  category: string
  capacity: number
  is_active: boolean
}

export interface WaitingListEntry {
  id: string | number
  user_id: string | number
  course_id: string | number
  created_at: string
}
