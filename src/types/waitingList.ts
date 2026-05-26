export interface WaitingListUserShort {
  id: string | number
  name: string
  email: string
}

export interface WaitingListCourseShort {
  id: string | number
  name: string
}

export interface WaitingListEntry {
  id: string | number
  user_id: string | number
  course_id: string | number
  position: number
  created_at: string
  user?: WaitingListUserShort
  course?: WaitingListCourseShort
}
