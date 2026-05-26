<script setup lang="ts">
import { computed, shallowRef, reactive, onMounted, onUnmounted, watch } from 'vue'
import { ChevronLeft, ChevronRight, RefreshCcw, Search } from '@lucide/vue'
import type { ApplicationRecord, ApplicationStatus } from '@/types/applications'

const props = defineProps<{
  applications: ApplicationRecord[]
  searchQuery: string
  statusFilter: ApplicationStatus | 'all'
  deletingApplicationId: number | null
  updatingStatusId: number | null
  loading: boolean
}>()

const emit = defineEmits<{
  remove: [application: ApplicationRecord]
  refresh: []
  statusChange: [application: ApplicationRecord, status: ApplicationStatus]
  'update:searchQuery': [value: string]
  'update:statusFilter': [value: ApplicationStatus | 'all']
}>()

const statuses: Array<{ value: ApplicationStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'accepted', label: 'Aceptadas' },
]

const getStatusLabel = (status: ApplicationStatus): string => {
  const labels: Record<ApplicationStatus, string> = {
    pending: 'Pendiente',
    accepted: 'Aceptada',
    rejected: 'Rechazada',
    cancelled: 'Cancelada',
  }

  return labels[status]
}

const formatDarde = (value: boolean | null): string => {
  if (value === null) return 'Sin informar'
  return value ? 'Sí' : 'No'
}

const availableActions = (
  currentStatus: ApplicationStatus,
): Array<{ value: ApplicationStatus; label: string }> => {
  const all = [
    { value: 'pending' as ApplicationStatus, label: 'Pendiente' },
    { value: 'accepted' as ApplicationStatus, label: 'Aceptar' },
    { value: 'rejected' as ApplicationStatus, label: 'Rechazar' },
  ]
  return all.filter((a) => a.value !== currentStatus)
}

const itemsPerPage = 5
const currentPage = shallowRef(1)
const totalApplications = computed(() => props.applications.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalApplications.value / itemsPerPage)))
const pageStartIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const pageEndIndex = computed(() =>
  Math.min(pageStartIndex.value + itemsPerPage, totalApplications.value),
)
const paginatedApplications = computed(() =>
  props.applications.slice(pageStartIndex.value, pageEndIndex.value),
)
const paginationSummary = computed(() => {
  if (totalApplications.value === 0) {
    return 'Sin registros'
  }

  return `Mostrando ${pageStartIndex.value + 1}-${pageEndIndex.value} de ${totalApplications.value}`
})
type PaginationItem = number | 'start-ellipsis' | 'end-ellipsis'

const paginationItems = computed<PaginationItem[]>(() => {
  if (totalPages.value <= 5) {
    return Array.from({ length: totalPages.value }, (_, index) => index + 1)
  }

  const items: PaginationItem[] = [1]
  const start = Math.max(2, currentPage.value - 1)
  const end = Math.min(totalPages.value - 1, currentPage.value + 1)

  if (start > 2) {
    items.push('start-ellipsis')
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page)
  }

  if (end < totalPages.value - 1) {
    items.push('end-ellipsis')
  }

  items.push(totalPages.value)

  return items
})

const setPage = (page: number) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
  closeDropdown()
}

watch(
  () => [props.searchQuery, props.statusFilter],
  () => {
    currentPage.value = 1
    closeDropdown()
  },
)

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})

const openDropdownId = shallowRef<number | null>(null)
const menuPosition = reactive({ top: 0, left: 0 })
const activeAppRef = shallowRef<ApplicationRecord | null>(null)
const isMenuVisible = shallowRef(false)

const openDropdown = (app: ApplicationRecord, event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  menuPosition.top = rect.bottom + 4
  menuPosition.left = Math.max(8, rect.right - 200)
  activeAppRef.value = app
  openDropdownId.value = app.id
  isMenuVisible.value = true
}

const closeDropdown = () => {
  openDropdownId.value = null
  isMenuVisible.value = false
  activeAppRef.value = null
}

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.dropdown-container') && !target.closest('.dropdown-menu-global')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <section class="glass-card applications-table-card">
    <div class="table-header">
      <div>
        <p class="eyebrow">Administración</p>
        <h3>Solicitudes registradas</h3>
      </div>
      <div class="table-header-actions">
        <div class="search-wrapper">
          <Search class="search-icon" :size="16" aria-hidden="true" />
          <input
            :value="searchQuery"
            type="text"
            class="search-input"
            placeholder="Buscar solicitud..."
            @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <select
          :value="statusFilter"
          class="status-filter"
          @change="emit('update:statusFilter', ($event.target as HTMLSelectElement).value as ApplicationStatus | 'all')"
        >
          <option v-for="status in statuses" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
        <button type="button" class="btn-outline" :disabled="loading" @click="emit('refresh')">
          <RefreshCcw :size="16" aria-hidden="true" />
          {{ loading ? 'Actualizando...' : 'Recargar' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="state-panel">
      <div class="spinner"></div>
      <p>Cargando solicitudes...</p>
    </div>

    <div v-else-if="applications.length === 0" class="state-panel empty">
      <template v-if="searchQuery.trim() || statusFilter !== 'all'">
        <h4>Sin resultados</h4>
        <p>No se encontraron solicitudes con los filtros actuales.</p>
      </template>
      <template v-else>
        <h4>No hay solicitudes registradas</h4>
        <p>Cuando el endpoint devuelva solicitudes, aparecerán aquí con acciones de edición, estado y eliminación.</p>
      </template>
    </div>

    <div v-else class="table-shell">
      <table class="applications-table">
        <thead>
          <tr>
            <th>Solicitud</th>
            <th>Curso</th>
            <th>DARDE</th>
            <th>Estado</th>
            <th class="actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="application in paginatedApplications" :key="application.id">
            <td>
              <div class="request-cell">
                <p class="request-name">
                  {{ application.user?.name || `Usuario #${application.user_id}` }}
                </p>
                <p class="request-email">
                  {{ application.user?.email || `ID usuario: ${application.user_id}` }}
                </p>
                <p v-if="application.previous_education" class="request-education">
                  {{ application.previous_education }}
                </p>
              </div>
            </td>
            <td>
              <span class="course-pill">{{ application.course?.name || 'Sin curso' }}</span>
            </td>
            <td>
              <span class="darde-value">{{ formatDarde(application.has_darde) }}</span>
            </td>
            <td>
              <span class="status-pill" :class="application.status">
                {{ getStatusLabel(application.status) }}
              </span>
            </td>
            <td class="actions-column">
              <div class="dropdown-container">
                <button
                  type="button"
                  class="dropdown-trigger"
                  :disabled="deletingApplicationId === application.id || updatingStatusId === application.id"
                  @click="openDropdown(application, $event)"
                  aria-label="Acciones"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination-bar" aria-label="Paginación de solicitudes">
        <p class="pagination-summary">{{ paginationSummary }}</p>

        <nav class="pagination-controls" aria-label="Páginas">
          <button
            type="button"
            class="pagination-button icon-button"
            :disabled="currentPage === 1"
            aria-label="Página anterior"
            @click="setPage(currentPage - 1)"
          >
            <ChevronLeft :size="16" aria-hidden="true" />
          </button>

          <template v-for="item in paginationItems" :key="item">
            <span v-if="typeof item === 'string'" class="pagination-ellipsis">...</span>
            <button
              v-else
              type="button"
              class="pagination-button page-button"
              :class="{ active: item === currentPage }"
              :aria-current="item === currentPage ? 'page' : undefined"
              @click="setPage(item)"
            >
              {{ item }}
            </button>
          </template>

          <button
            type="button"
            class="pagination-button icon-button"
            :disabled="currentPage === totalPages"
            aria-label="Página siguiente"
            @click="setPage(currentPage + 1)"
          >
            <ChevronRight :size="16" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </section>

  <Teleport to="body">
    <Transition name="dropdown">
      <div
        v-if="isMenuVisible && activeAppRef"
        class="dropdown-menu-global"
        :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
        @click.stop
      >
        <button
          v-for="action in availableActions(activeAppRef.status)"
          :key="action.value"
          type="button"
          class="dropdown-item status"
          :disabled="updatingStatusId === activeAppRef.id"
          @click="emit('statusChange', activeAppRef, action.value); closeDropdown()"
        >
          <template v-if="action.value === 'accepted'">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </template>
          <template v-else-if="action.value === 'rejected'">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </template>
          <template v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </template>
          {{ action.label }}
        </button>

        <div class="dropdown-divider"></div>

        <button
          type="button"
          class="dropdown-item delete"
          :disabled="deletingApplicationId === activeAppRef.id"
          @click="emit('remove', activeAppRef); closeDropdown()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          {{ deletingApplicationId === activeAppRef.id ? 'Eliminando...' : 'Eliminar' }}
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.applications-table-card {
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 100%;
}

.table-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.table-header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input,
.status-filter {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-dark);
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
}

.search-input {
  padding: 0.6rem 0.85rem 0.6rem 2.35rem;
  width: 210px;
}

.status-filter {
  padding: 0.6rem 0.85rem;
}

.search-input:focus,
.status-filter:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 17, 185, 0.08);
}

.eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary-50);
  margin-bottom: 0.4rem;
}

.table-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: var(--text-dark);
}

.table-shell {
  overflow-x: auto;
}

.applications-table {
  width: 100%;
  border-collapse: collapse;
}

.applications-table th,
.applications-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid rgba(67, 17, 185, 0.08);
  text-align: left;
  vertical-align: middle;
}

.applications-table th {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0.25rem 0;
}

.pagination-summary {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.88rem;
  font-weight: 600;
}

.pagination-controls {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.pagination-button {
  min-width: 36px;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.78);
  color: var(--text-dark);
  display: inline-grid;
  place-items: center;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(67, 17, 185, 0.04);
}

.pagination-button.active {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: var(--white);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button:disabled:hover {
  border-color: var(--border-color);
  color: var(--text-dark);
  background: rgba(255, 255, 255, 0.78);
}

.icon-button {
  padding: 0;
}

.page-button {
  padding: 0 0.7rem;
}

.pagination-ellipsis {
  width: 28px;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.request-cell {
  max-width: 340px;
}

.request-name {
  margin: 0 0 0.25rem 0;
  font-weight: 700;
  color: var(--text-dark);
}

.request-email,
.request-education,
.darde-value {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.request-education {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-pill,
.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.course-pill {
  background: rgba(67, 17, 185, 0.08);
  color: var(--primary-color);
}

.status-pill.pending {
  background: rgba(255, 193, 7, 0.14);
  color: #8a5b00;
}

.status-pill.accepted {
  background: rgba(10, 71, 73, 0.08);
  color: var(--accent-teal);
}

.status-pill.rejected,
.status-pill.cancelled {
  background: rgba(236, 86, 41, 0.1);
  color: var(--secondary-90);
}

.actions-column {
  width: 60px;
  text-align: center;
}

.dropdown-container {
  position: relative;
  display: inline-flex;
}

.dropdown-trigger {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  color: var(--text-muted);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-trigger:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(67, 17, 185, 0.04);
}

.dropdown-trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dropdown-menu-global {
  position: fixed;
  z-index: 9999;
  min-width: 190px;
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 0.35rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-dark);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  font-family: inherit;
}

.dropdown-item:hover {
  background: rgba(67, 17, 185, 0.06);
}

.dropdown-item.status:hover {
  color: var(--primary-color);
}

.dropdown-item.delete {
  color: var(--secondary-90);
}

.dropdown-item.delete:hover {
  background: rgba(236, 86, 41, 0.08);
  color: var(--secondary-color);
}

.dropdown-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0.25rem 0.5rem;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.7);
  color: var(--text-dark);
}

.btn-outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn-outline:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Dropdown transition */
.dropdown-enter-active {
  animation: dropIn 0.15s ease;
}

.dropdown-leave-active {
  animation: dropIn 0.1s ease reverse;
}

@keyframes dropIn {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.state-panel {
  min-height: 280px;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 1rem;
  border: 1px dashed rgba(67, 17, 185, 0.18);
  border-radius: 18px;
  padding: 2rem;
}

.state-panel h4,
.state-panel p {
  margin: 0;
}

.state-panel p {
  color: var(--text-muted);
  max-width: 440px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid var(--primary-color-soft);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .table-header,
  .table-header-actions {
    flex-direction: column;
  }

  .table-header-actions,
  .search-wrapper,
  .search-input,
  .status-filter,
  .btn-outline {
    width: 100%;
  }

  .btn-outline {
    justify-content: center;
  }

  .pagination-bar {
    align-items: stretch;
    flex-direction: column;
  }

  .pagination-controls {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 640px) {
  .applications-table-card {
    padding: 1.5rem;
  }

  .actions-column {
    width: auto;
  }
}
</style>
