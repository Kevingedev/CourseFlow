import { computed, onMounted, ref } from 'vue'
import { applicationsService } from '@/services/applicationsService'
import { waitingListService } from '@/services/waitingListService'
import type {
  ApplicationRecord,
  ApplicationsFeedback,
  ApplicationStatus,
} from '@/types/applications'

export const useApplications = () => {
  const applicationsRaw = ref<ApplicationRecord[]>([])
  const loading = ref(false)
  const deletingApplicationId = ref<number | null>(null)
  const updatingStatusId = ref<number | null>(null)
  const exportingApplications = ref(false)
  const feedback = ref<ApplicationsFeedback | null>(null)
  const searchQuery = ref('')
  const statusFilter = ref<ApplicationStatus | 'all'>('all')

  const sortedApplications = computed(() =>
    [...applicationsRaw.value].sort((left, right) => right.id - left.id),
  )

  const visibleApplications = computed(() =>
    sortedApplications.value.filter(
      (app) => app.status !== 'rejected' && app.status !== 'cancelled',
    ),
  )

  const filteredApplications = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()

    return visibleApplications.value.filter((application) => {
      const matchesStatus =
        statusFilter.value === 'all' || application.status === statusFilter.value
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
    total: visibleApplications.value.length,
    pending: visibleApplications.value.filter((application) => application.status === 'pending').length,
    accepted: visibleApplications.value.filter((application) => application.status === 'accepted').length,
  }))

  const resetFeedback = () => {
    feedback.value = null
  }

  const loadApplications = async () => {
    loading.value = true

    try {
      applicationsRaw.value = await applicationsService.getApplications()
    } catch (error: unknown) {
      feedback.value = {
        type: 'error',
        message:
          error instanceof Error ? error.message : 'No se pudo cargar la lista de solicitudes.',
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

      if (updatedApplication.status === 'rejected') {
        try {
          await waitingListService.addToWaitingList({
            user_id: updatedApplication.user_id,
            course_id: updatedApplication.course_id,
          })
        } catch (waitingListError) {
          console.warn('[applications] Failed to enqueue waiting list entry:', waitingListError)
        }
      }

      if (updatedApplication.status === 'rejected') {
        applicationsRaw.value = applicationsRaw.value.map((item) =>
          item.id === updatedApplication.id ? updatedApplication : item,
        )
      } else {
        applicationsRaw.value = applicationsRaw.value.map((item) =>
          item.id === updatedApplication.id ? updatedApplication : item,
        )
      }
      feedback.value = {
        type: 'success',
        message: 'Estado de solicitud actualizado correctamente.',
      }
    } catch (error: unknown) {
      feedback.value = {
        type: 'error',
        message: error instanceof Error ? error.message : 'No se pudo actualizar el estado.',
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
      applicationsRaw.value = applicationsRaw.value.filter((item) => item.id !== application.id)

      feedback.value = {
        type: 'success',
        message: 'Solicitud eliminada correctamente.',
      }
    } catch (error: unknown) {
      feedback.value = {
        type: 'error',
        message: error instanceof Error ? error.message : 'No se pudo eliminar la solicitud.',
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
    applicationsRaw,
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
