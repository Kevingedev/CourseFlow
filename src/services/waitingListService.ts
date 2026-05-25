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
  position?: number
  created_at: string
  user?: RawWaitingListUserShort
  course?: RawWaitingListCourseShort
}

const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response
  ) {
    const data = error.response.data as { detail?: unknown; message?: unknown }

    if (typeof data.detail === 'string') return data.detail
    if (typeof data.message === 'string') return data.message

    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item) => {
          if (typeof item === 'string') return item
          if (item && typeof item === 'object' && 'msg' in item && typeof item.msg === 'string') {
            return item.msg
          }
          return null
        })
        .filter(Boolean)
        .join(' ')
    }
  }

  if (error instanceof Error && error.message) return error.message
  return fallbackMessage
}

const coerceEntries = (payload: unknown): RawWaitingListEntry[] => {
  if (Array.isArray(payload)) return payload as RawWaitingListEntry[]

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
        return candidate as RawWaitingListEntry[]
      }
    }
  }

  return []
}

const mapEntry = (entry: RawWaitingListEntry, index: number): WaitingListEntry => ({
  id: entry.id,
  user_id: entry.user_id,
  course_id: entry.course_id,
  position: typeof entry.position === 'number' ? entry.position : index + 1,
  created_at: entry.created_at,
  user: entry.user,
  course: entry.course,
})

export const waitingListService = {
  async getWaitingListByCourse(courseId: string | number): Promise<WaitingListEntry[]> {
    try {
      const response = await api.get<unknown>(`/api/v1/waiting-list/${courseId}`)
      const entries = coerceEntries(response.data)
      return entries.map(mapEntry)
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'No se pudo cargar la lista de espera.'))
    }
  },

  async addToWaitingList(payload: {
    user_id: number
    course_id: number
  }): Promise<WaitingListEntry> {
    try {
      const response = await api.post<unknown>('/api/v1/waiting-list/', null, {
        params: payload,
      })
      const entries = coerceEntries(response.data)
      const first = entries[0]
      if (first) {
        return mapEntry(first, 0)
      }
      if (response.data && typeof response.data === 'object') {
        return mapEntry(response.data as RawWaitingListEntry, 0)
      }
      throw new Error('Respuesta inválida del servidor.')
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'No se pudo añadir a la lista de espera.'))
    }
  },
}
