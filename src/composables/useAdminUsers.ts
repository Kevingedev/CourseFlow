import { computed, onMounted, reactive, ref } from 'vue'
import { adminUsersService } from '@/services/adminUsersService'
import type {
  AdminUserFormValues,
  AdminUserRecord,
  AdminUsersFeedback,
} from '@/types/adminUsers'

const createInitialForm = (): AdminUserFormValues => ({
  name: '',
  email: '',
  password: '',
})

export const useAdminUsers = (currentUserId: string | undefined) => {
  const adminUsers = ref<AdminUserRecord[]>([])
  const loading = ref(false)
  const submitting = ref(false)
  const deletingUserId = ref<string | null>(null)
  const togglingUserId = ref<string | null>(null)
  const selectedUserId = ref<string | null>(null)
  const feedback = ref<AdminUsersFeedback | null>(null)
  const form = reactive<AdminUserFormValues>(createInitialForm())

  const isEditing = computed(() => selectedUserId.value !== null)
  const selectedUser = computed(
    () => adminUsers.value.find((user) => user.id === selectedUserId.value) ?? null,
  )
  const sortedAdminUsers = computed(() =>
    [...adminUsers.value].sort((left, right) => left.fullName.localeCompare(right.fullName, 'es')),
  )
  const canSubmit = computed(() => {
    const hasBaseFields = form.name.trim().length > 0 && form.email.trim().length > 0

    if (!hasBaseFields) {
      return false
    }

    return isEditing.value || form.password.trim().length > 0
  })

  const resetFeedback = () => {
    feedback.value = null
  }

  const resetForm = () => {
    Object.assign(form, createInitialForm())
    selectedUserId.value = null
  }

  const hydrateFormForEdit = (user: AdminUserRecord) => {
    form.name = user.fullName
    form.email = user.email
    form.password = ''
    selectedUserId.value = user.id
    resetFeedback()
  }

  const loadAdminUsers = async () => {
    loading.value = true

    try {
      adminUsers.value = await adminUsersService.getAdminUsers()
    } catch (error: unknown) {
      feedback.value = {
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la lista de administradores.',
      }
    } finally {
      loading.value = false
    }
  }

  const submitForm = async () => {
    if (!canSubmit.value) {
      feedback.value = {
        type: 'error',
        message: 'Completa nombre, correo y contraseña para crear un administrador.',
      }
      return
    }

    submitting.value = true
    resetFeedback()

    try {
      if (isEditing.value && selectedUserId.value) {
        const updatedUser = await adminUsersService.updateAdminUser(selectedUserId.value, {
          name: form.name.trim(),
          email: form.email.trim(),
        })

        adminUsers.value = adminUsers.value.map((user) =>
          user.id === updatedUser.id ? updatedUser : user,
        )
        feedback.value = {
          type: 'success',
          message: 'Administrador actualizado correctamente.',
        }
      } else {
        const createdUser = await adminUsersService.createAdminUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
        })

        adminUsers.value = [...adminUsers.value, createdUser]
        feedback.value = {
          type: 'success',
          message: 'Administrador creado correctamente.',
        }
      }

      resetForm()
    } catch (error: unknown) {
      feedback.value = {
        type: 'error',
        message:
          error instanceof Error ? error.message : 'No se pudo guardar el administrador.',
      }
    } finally {
      submitting.value = false
    }
  }

  const removeAdminUser = async (user: AdminUserRecord) => {
    if (user.id === currentUserId) {
      feedback.value = {
        type: 'error',
        message: 'No puedes eliminar tu propia cuenta de superadministrador.',
      }
      return
    }

    deletingUserId.value = user.id
    resetFeedback()

    try {
      await adminUsersService.deleteAdminUser(user.id)
      adminUsers.value = adminUsers.value.filter((item) => item.id !== user.id)

      if (selectedUserId.value === user.id) {
        resetForm()
      }

      feedback.value = {
        type: 'success',
        message: 'Administrador eliminado correctamente.',
      }
    } catch (error: unknown) {
      feedback.value = {
        type: 'error',
        message:
          error instanceof Error ? error.message : 'No se pudo eliminar el administrador.',
      }
    } finally {
      deletingUserId.value = null
    }
  }

  const toggleUserActive = async (user: AdminUserRecord) => {
    const newStatus = !user.isActive
    const actionLabel = newStatus ? 'activar' : 'desactivar'

    togglingUserId.value = user.id
    resetFeedback()

    try {
      const updatedUser = await adminUsersService.updateAdminUserStatus(user.id, newStatus)
      adminUsers.value = adminUsers.value.map((u) =>
        u.id === updatedUser.id ? updatedUser : u,
      )
      feedback.value = {
        type: 'success',
        message: `Administrador ${actionLabel}do correctamente.`,
      }
    } catch (error: unknown) {
      feedback.value = {
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : `No se pudo ${actionLabel} el administrador.`,
      }
    } finally {
      togglingUserId.value = null
    }
  }

  onMounted(loadAdminUsers)

  return {
    adminUsers: sortedAdminUsers,
    canSubmit,
    deletingUserId,
    feedback,
    form,
    isEditing,
    loading,
    selectedUser,
    submitting,
    togglingUserId,
    hydrateFormForEdit,
    loadAdminUsers,
    removeAdminUser,
    toggleUserActive,
    resetFeedback,
    resetForm,
    submitForm,
  }
}
