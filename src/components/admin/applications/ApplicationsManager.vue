<script setup lang="ts">
import { ref } from 'vue'
import { useApplications } from '@/composables/useApplications'
import ApplicationsTable from './ApplicationsTable.vue'
import CustomConfirmModal from '@/components/common/CustomConfirmModal.vue'
import type { ApplicationRecord } from '@/types/applications'

const {
  applications,
  deletingApplicationId,
  feedback,
  loading,
  searchQuery,
  stats,
  statusFilter,
  updatingStatusId,
  loadApplications,
  removeApplication,
  updateStatus,
} = useApplications()

const confirmOpen = ref(false)
const applicationToDelete = ref<ApplicationRecord | null>(null)

const handleDelete = (application: ApplicationRecord) => {
  applicationToDelete.value = application
  confirmOpen.value = true
}

const handleConfirmDelete = async () => {
  if (applicationToDelete.value) {
    await removeApplication(applicationToDelete.value)
  }
  confirmOpen.value = false
  applicationToDelete.value = null
}
</script>

<template>
  <div class="applications-manager">
    <!-- <div class="manager-header">
      <div>
        <p class="eyebrow">Panel de solicitudes</p>
        <h2>Gestión de Solicitudes</h2>
      </div>
    </div> -->

    <div v-if="feedback" class="feedback-banner" :class="feedback.type">
      {{ feedback.message }}
    </div>

    <section class="stats-grid" aria-label="Resumen de solicitudes">
      <article class="stat-card">
        <span>Total</span>
        <strong>{{ stats.total }}</strong>
      </article>
      <article class="stat-card pending">
        <span>Pendientes</span>
        <strong>{{ stats.pending }}</strong>
      </article>
      <article class="stat-card accepted">
        <span>Aceptadas</span>
        <strong>{{ stats.accepted }}</strong>
      </article>
    </section>

    <ApplicationsTable
      :applications="applications"
      :search-query="searchQuery"
      :status-filter="statusFilter"
      :deleting-application-id="deletingApplicationId"
      :updating-status-id="updatingStatusId"
      :loading="loading"
      @refresh="loadApplications"
      @remove="handleDelete"
      @status-change="updateStatus"
      @update:search-query="searchQuery = $event"
      @update:status-filter="statusFilter = $event"
    />

    <CustomConfirmModal
      :open="confirmOpen"
      title="Eliminar solicitud"
      :message="
        applicationToDelete
          ? `Vas a eliminar la solicitud #${applicationToDelete.id}. Esta acción no se puede deshacer.`
          : ''
      "
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      type="danger"
      :loading="deletingApplicationId !== null"
      @close="confirmOpen = false"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<style scoped>
.applications-manager {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.manager-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.manager-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-dark);
}

.eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary-50);
  margin-bottom: 0.25rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.stat-card {
  padding: 1rem 1.1rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.82);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.stat-card span {
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.9rem;
}

.stat-card strong {
  color: var(--text-dark);
  font-size: 1.45rem;
  font-family: var(--font-display);
}

.stat-card.pending {
  border-color: rgba(255, 193, 7, 0.35);
}

.stat-card.accepted {
  border-color: rgba(10, 71, 73, 0.22);
}

.feedback-banner {
  border-radius: 12px;
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.feedback-banner.success {
  background: rgba(10, 71, 73, 0.08);
  color: var(--accent-teal);
}

.feedback-banner.error {
  background: rgba(236, 86, 41, 0.1);
  color: var(--secondary-90);
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .manager-header {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
