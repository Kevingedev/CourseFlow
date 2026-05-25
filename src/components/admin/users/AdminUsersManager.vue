<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAdminUsers } from '@/composables/useAdminUsers'
import AdminUserFormCard from './AdminUserFormCard.vue'
import AdminUsersTable from './AdminUsersTable.vue'
import CustomConfirmModal from '@/components/common/CustomConfirmModal.vue'
import type { AdminUserRecord } from '@/types/adminUsers'

const authStore = useAuthStore()
const {
  adminUsers,
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
  resetForm,
  submitForm,
} = useAdminUsers(authStore.user?.id)

const confirmOpen = ref(false)
const userToDelete = ref<AdminUserRecord | null>(null)

const handleDelete = (user: AdminUserRecord) => {
  userToDelete.value = user
  confirmOpen.value = true
}

const handleConfirmDelete = async () => {
  if (userToDelete.value) {
    await removeAdminUser(userToDelete.value)
  }
  confirmOpen.value = false
  userToDelete.value = null
}
</script>

<template>
  <div class="admin-users-manager">
    

    <section class="content-grid">
      <AdminUserFormCard
        :form="form"
        :can-submit="canSubmit"
        :is-editing="isEditing"
        :submitting="submitting"
        :feedback="feedback"
        :selected-user="selectedUser"
        @submit="submitForm"
        @reset="resetForm"
      />

      <AdminUsersTable
        :admin-users="adminUsers"
        :current-user-id="authStore.user?.id"
        :deleting-user-id="deletingUserId"
        :toggling-user-id="togglingUserId"
        :loading="loading"
        @edit="hydrateFormForEdit"
        @refresh="loadAdminUsers"
        @remove="handleDelete"
        @toggle="toggleUserActive"
      />
    </section>

    <CustomConfirmModal
      :open="confirmOpen"
      title="Eliminar administrador"
      :message="userToDelete ? `Vas a eliminar al administrador ${userToDelete.fullName}. Esta acción no se puede deshacer.` : ''"
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      type="danger"
      :loading="deletingUserId !== null"
      @close="confirmOpen = false"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<style scoped>
.admin-users-manager {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero-card {
  padding: 2rem;
  border-radius: 24px;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  background:
    radial-gradient(circle at top right, rgba(236, 86, 41, 0.12), transparent 30%),
    linear-gradient(135deg, rgba(67, 17, 185, 0.08), rgba(255, 255, 255, 0.85));
}

.hero-eyebrow {
  margin: 0 0 0.6rem 0;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--secondary-color);
}

.hero-card h2 {
  margin: 0 0 0.75rem 0;
  font-size: 2rem;
}

.hero-copy {
  margin: 0;
  max-width: 720px;
  color: var(--text-muted);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(140px, 1fr));
  gap: 0.9rem;
  min-width: 320px;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.1rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(67, 17, 185, 0.08);
}

.hero-stat strong {
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--text-dark);
}

.hero-stat span {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.current-user strong {
  font-size: 1rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 1080px) {
  .hero-card {
    flex-direction: column;
  }

  .hero-stats {
    width: 100%;
    min-width: 0;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero-card {
    padding: 1.5rem;
  }

  .hero-card h2 {
    font-size: 1.65rem;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }
}
</style>
