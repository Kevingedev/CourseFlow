import api from './api'
import type {
  CourseCreatePayload,
  CourseRecord,
  CourseUpdatePayload,
} from '@/types/courses'

const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response
  ) {
    const data = error.response.data as { detail?: unknown }

    if (typeof data.detail === 'string') {
      return data.detail
    }

    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item) => {
          if (typeof item === 'string') {
            return item
          }

          if (item && typeof item === 'object' && 'msg' in item && typeof item.msg === 'string') {
            return item.msg
          }

          return null
        })
        .filter(Boolean)
        .join(' ')
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}

export const coursesService = {
  async getCourses(): Promise<CourseRecord[]> {
    try {
      const response = await api.get<CourseRecord[]>('/api/v1/courses/')
      return response.data
    } catch (error: unknown) {
      throw new Error(
        getApiErrorMessage(error, 'No se pudo cargar la lista de cursos.'),
      )
    }
  },

  async getCourse(courseId: number): Promise<CourseRecord> {
    try {
      const response = await api.get<CourseRecord>(`/api/v1/courses/${courseId}`)
      return response.data
    } catch (error: unknown) {
      throw new Error(
        getApiErrorMessage(error, 'No se pudo cargar el curso.'),
      )
    }
  },

  async createCourse(payload: CourseCreatePayload): Promise<CourseRecord> {
    try {
      const response = await api.post<CourseRecord>('/api/v1/courses/', payload)
      return response.data
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'No se pudo crear el curso.'))
    }
  },

  async updateCourse(
    courseId: number,
    payload: CourseUpdatePayload,
  ): Promise<CourseRecord> {
    try {
      const response = await api.put<CourseRecord>(`/api/v1/courses/${courseId}`, payload)
      return response.data
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'No se pudo actualizar el curso.'))
    }
  },

  async deleteCourse(courseId: number): Promise<void> {
    try {
      await api.delete(`/api/v1/courses/${courseId}`)
    } catch (error: unknown) {
      throw new Error(getApiErrorMessage(error, 'No se pudo desactivar el curso.'))
    }
  },
}
