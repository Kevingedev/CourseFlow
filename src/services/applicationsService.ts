import api from './api'
import type { ApplicationRecord, ApplicationStatus } from '@/types/applications'

interface RawApplication {
  id: number
  user_id: number
  course_id: number
  status: string
  has_darde?: boolean | null
  previous_education?: string | null
  user?: {
    name: string
    email: string
  } | null
  course?: {
    name: string
  } | null
}

const normalizeStatus = (status: string): ApplicationStatus => {
  const normalized = status.toLowerCase()

  if (normalized === 'accepted' || normalized === 'aceptado') return 'accepted'
  if (normalized === 'rejected' || normalized === 'rechazado') return 'rejected'
  if (normalized === 'cancelled' || normalized === 'cancelado') return 'cancelled'

  return 'pending'
}

const mapApplication = (application: RawApplication): ApplicationRecord => ({
  id: application.id,
  user_id: application.user_id,
  course_id: application.course_id,
  status: normalizeStatus(application.status),
  has_darde: application.has_darde ?? null,
  previous_education: application.previous_education ?? null,
  user: application.user ?? null,
  course: application.course ?? null,
})

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

const getFilenameFromContentDisposition = (headerValue: string | undefined): string => {
  if (!headerValue) {
    return 'solicitudes.xlsx'
  }

  const utf8Match = headerValue.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1])
    } catch {
      return utf8Match[1]
    }
  }

  const plainMatch = headerValue.match(/filename="?([^";]+)"?/i)
  if (plainMatch?.[1]) {
    return plainMatch[1]
  }

  return 'solicitudes.xlsx'
}

export const applicationsService = {
  async getApplications(): Promise<ApplicationRecord[]> {
    console.info('[applications] GET /api/v1/applications/')

    try {
      const response = await api.get<RawApplication[]>('/api/v1/applications/')
      console.info('[applications] Loaded applications:', response.data.length)
      return response.data.map(mapApplication)
    } catch (error: unknown) {
      console.error('[applications] Failed to load applications:', error)
      throw new Error(getApiErrorMessage(error, 'No se pudo cargar la lista de solicitudes.'))
    }
  },

  async updateApplicationStatus(
    applicationId: number,
    status: ApplicationStatus,
  ): Promise<ApplicationRecord> {
    console.info(`[applications] PATCH /api/v1/applications/${applicationId}/status`, { status })

    try {
      const response = await api.patch<RawApplication>(
        `/api/v1/applications/${applicationId}/status`,
        { status },
      )
      console.info('[applications] Updated application status:', response.data.id)
      return mapApplication(response.data)
    } catch (error: unknown) {
      console.error('[applications] Failed to update application status:', error)
      throw new Error(getApiErrorMessage(error, 'No se pudo actualizar el estado de la solicitud.'))
    }
  },

  async deleteApplication(applicationId: number): Promise<void> {
    console.info(`[applications] DELETE /api/v1/applications/${applicationId}`)

    try {
      await api.delete(`/api/v1/applications/${applicationId}`)
      console.info('[applications] Deleted application:', applicationId)
    } catch (error: unknown) {
      console.error('[applications] Failed to delete application:', error)
      throw new Error(getApiErrorMessage(error, 'No se pudo eliminar la solicitud.'))
    }
  },

  async exportApplicationsExcel(): Promise<void> {
    console.info('[applications] GET /api/v1/applications/export/excel')

    try {
      const response = await api.get<Blob>('/api/v1/applications/export/excel', {
        responseType: 'blob',
      })

      const contentTypeHeader = response.headers['content-type']
      const contentDispositionHeader = response.headers['content-disposition']
      const contentType = typeof contentTypeHeader === 'string' ? contentTypeHeader : undefined
      const contentDisposition =
        typeof contentDispositionHeader === 'string' ? contentDispositionHeader : undefined

      const blob = new Blob([response.data], {
        type: contentType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = getFilenameFromContentDisposition(contentDisposition)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error: unknown) {
      console.error('[applications] Failed to export applications:', error)
      throw new Error(getApiErrorMessage(error, 'No se pudo exportar el Excel.'))
    }
  },
}
