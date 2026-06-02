import api from './api'
import type { Course, Application, WaitingListEntry } from '@/types/dashboard'
import type { User } from '@/types/auth'

interface RawApplication {
  id: number
  user_id: number
  course_id: number
  has_darde: boolean
  previous_education?: string | null
  status: string
}

interface RawUser {
  id: number
  name: string
  email: string
  role: string
  dni_nie?: string | null
  birth_date?: string | null
}

const normalizeStatus = (status: string): Application['status'] => {
  const normalized = status.toLowerCase()

  if (normalized === 'accepted') return 'accepted'
  if (normalized === 'rejected') return 'rejected'
  if (normalized === 'cancelled') return 'cancelled'
  return 'pending'
}

const mapApplication = (application: RawApplication): Application => ({
  id: application.id,
  user_id: application.user_id,
  course_id: application.course_id,
  has_darde: application.has_darde,
  previous_education: application.previous_education ?? undefined,
  status: normalizeStatus(application.status),
})

const mapAdminUser = (user: RawUser): User => ({
  id: String(user.id),
  name: user.name,
  fullName: user.name,
  email: user.email,
  role: user.role === 'superadmin' ? 'suadmin' : 'admin',
  dniNie: user.dni_nie ?? null,
  birthDate: user.birth_date ?? null,
})

export const dashboardService = {
  /**
   * Fetches all courses
   */
  async getCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>('/api/v1/courses/')
    return response.data
  },

  /**
   * Fetches applications for a specific course (admin/superadmin)
   */
  async getCourseApplications(courseId: string | number): Promise<Application[]> {
    const response = await api.get<RawApplication[]>(`/api/v1/courses/${courseId}/applications`)
    return response.data.map(mapApplication)
  },

  /**
   * Fetches waiting list for a specific course
   */
  async getWaitingListByCourse(courseId: string | number): Promise<WaitingListEntry[]> {
    const response = await api.get<unknown>(`/api/v1/waiting-list/${courseId}`)
    const payload = response.data

    if (Array.isArray(payload)) {
      return payload as WaitingListEntry[]
    }

    if (payload && typeof payload === 'object') {
      const record = payload as Record<string, unknown>
      const candidates = [
        record.entries,
        record.items,
        record.results,
        record.data,
        record.waiting_list,
        record.waitingList,
      ]

      for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
          return candidate as WaitingListEntry[]
        }
      }
    }

    return []
  },

  /**
   * Fetches admin users (superadmin only)
   */
  async getAdminUsers(): Promise<User[]> {
    const response = await api.get<RawUser[]>('/api/admin/users')
    return response.data.map(mapAdminUser)
  },
}
