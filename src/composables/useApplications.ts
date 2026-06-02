import { computed, onMounted, ref } from 'vue'
import { applicationsService } from '@/services/applicationsService'
import type {
  ApplicationRecord,
  ApplicationsFeedback,
  ApplicationStatus,
} from '@/types/applications'

export const useApplications = () => {
  const applications = ref<ApplicationRecord[]>([])
  const loading = ref(false)
  const deletingApplicationId = ref<number | null>(null)
  const updatingStatusId = ref<number | null>(null)
  const exportingApplications = ref(false)
  const feedback = ref<ApplicationsFeedback | null>(null)
  const searchQuery = ref('')
  const statusFilter = ref<ApplicationStatus | 'all'>('all')

  const sortedApplications = computed(() =>
    [...applications.value].sort((left, right) => right.id - left.id),
  )

  const filteredApplications = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()

    return sortedApplications.value.filter((application) => {
      const matchesStatus = statusFilter.value === 'all' || application.status === statusFilter.value
      const searchableText = [
        application.id,
        application.user_id,
        application.course_id,
        application.user?.name,
        application.user?.email,
        application.previous_education,
      ]
        .filter((item) => item !== null && item !== undefined)
        .join(' ')
        .toLowerCase()

      return matchesStatus && (!query || searchableText.includes(query))
    })
  })

  const stats = computed(() => ({
    total: applications.value.length,
    pending: applications.value.filter((application) => application.status === 'pending').length,
    accepted: applications.value.filter((application) => application.status === 'accepted').length,
    rejected: applications.value.filter((application) => application.status === 'rejected').length,
  }))

  const resetFeedback = () => {
    feedback.value = null
  }

  const loadApplications = async () => {
    loading.value = true

    try {
      applications.value = await applicationsService.getApplications()
    } catch (error: unknown) {
      feedback.value = {
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la lista de solicitudes.',
      }
    } finally {
      loading.value = false
    }
  }

  const updateStatus = async (application: ApplicationRecord, status: ApplicationStatus) => {
    if (application.status === status) {
      return
    }

    updatingStatusId.value = application.id
    resetFeedback()

    try {
      const updatedApplication = await applicationsService.updateApplicationStatus(
        application.id,
        status,
      )
      applications.value = applications.value.map((item) =>
        item.id === updatedApplication.id ? updatedApplication : item,
      )
      feedback.value = {
        type: 'success',
        message: 'Estado de solicitud actualizado correctamente.',
      }
    } catch (error: unknown) {
      feedback.value = {
        type: 'error',
        message:
          error instanceof Error ? error.message : 'No se pudo actualizar el estado.',
      }
    } finally {
      updatingStatusId.value = null
    }
  }

  const removeApplication = async (application: ApplicationRecord) => {
    deletingApplicationId.value = application.id
    resetFeedback()

    try {
      await applicationsService.deleteApplication(application.id)
      applications.value = applications.value.filter((item) => item.id !== application.id)

      feedback.value = {
        type: 'success',
        message: 'Solicitud eliminada correctamente.',
      }
    } catch (error: unknown) {
      feedback.value = {
        type: 'error',
        message:
          error instanceof Error ? error.message : 'No se pudo eliminar la solicitud.',
      }
    } finally {
      deletingApplicationId.value = null
    }
  }

  const exportApplications = async () => {
    exportingApplications.value = true
    resetFeedback()

    try {
      await applicationsService.exportApplicationsExcel()
      feedback.value = {
        type: 'success',
        message: 'Exportación generada correctamente.',
      }
    } catch (error: unknown) {
      feedback.value = {
        type: 'error',
        message:
          error instanceof Error ? error.message : 'No se pudo exportar el Excel.',
      }
    } finally {
      exportingApplications.value = false
    }
  }

  onMounted(loadApplications)

  return {
    applications: filteredApplications,
    deletingApplicationId,
    feedback,
    exportingApplications,
    loading,
    searchQuery,
    stats,
    statusFilter,
    updatingStatusId,
    loadApplications,
    removeApplication,
    resetFeedback,
    exportApplications,
    updateStatus,
  }
}
