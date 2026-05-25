import api from './api'
import type { WaitingListEntry } from '@/types/waitingList'

interface RawWaitingListUserShort {
  id: number
  name: string
  email: string
}

interface RawWaitingListCourseShort {
  id: number
  name: string
}

interface RawWaitingListEntry {
  id: number
  user_id: number
  course_id: number
  position: number
  created_at: string
  user?: RawWaitingListUserShort
  course?: RawWaitingListCourseShort
}

const mapEntry = (entry: RawWaitingListEntry): WaitingListEntry => ({
  id: entry.id,
  user_id: entry.user_id,
  course_id: entry.course_id,
  position: entry.position,
  created_at: entry.created_at,
  user: entry.user,
  course: entry.course,
})

export const waitingListService = {
  async getWaitingListByCourse(courseId: string | number): Promise<WaitingListEntry[]> {
    const response = await api.get<RawWaitingListEntry[]>(`/api/v1/waiting-list/${courseId}`)
    return response.data.map(mapEntry)
  },
}

