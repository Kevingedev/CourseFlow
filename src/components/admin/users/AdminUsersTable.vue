<script setup lang="ts">
import { computed, shallowRef, reactive, onMounted, onUnmounted, watch } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import type { AdminUserRecord } from '@/types/adminUsers'

const props = defineProps<{
  adminUsers: AdminUserRecord[]
  currentUserId?: string
  deletingUserId: string | null
  togglingUserId: string | null
  loading: boolean
}>()

const emit = defineEmits<{
  edit: [user: AdminUserRecord]
  remove: [user: AdminUserRecord]
  toggle: [user: AdminUserRecord]
  refresh: []
}>()

const itemsPerPage = 5
const currentPage = shallowRef(1)
const totalUsers = computed(() => props.adminUsers.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalUsers.value / itemsPerPage)))
const pageStartIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const pageEndIndex = computed(() => Math.min(pageStartIndex.value + itemsPerPage, totalUsers.value))
const paginatedUsers = computed(() =>
  props.adminUsers.slice(pageStartIndex.value, pageEndIndex.value),
)
const paginationSummary = computed(() => {
  if (totalUsers.value === 0) {
    return 'Sin registros'
  }

  return `Mostrando ${pageStartIndex.value + 1}-${pageEndIndex.value} de ${totalUsers.value}`
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

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})

const openDropdownId = shallowRef<string | null>(null)
const menuPosition = reactive({ top: 0, left: 0 })
const activeUserRef = shallowRef<AdminUserRecord | null>(null)

const isMenuVisible = shallowRef(false)

const openDropdown = (userId: string, user: AdminUserRecord, event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  menuPosition.top = rect.bottom + 4
  menuPosition.left = Math.max(8, rect.right - 180)
  activeUserRef.value = user
  openDropdownId.value = userId
  isMenuVisible.value = true
}

const closeDropdown = () => {
  openDropdownId.value = null
  isMenuVisible.value = false
  activeUserRef.value = null
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
  <section class="glass-card admin-users-table-card">
    <div class="table-header">
      <div>
        <p class="eyebrow">Directorio</p>
        <h3>Administradores registrados</h3>
      </div>
      <button type="button" class="btn-outline" :disabled="loading" @click="emit('refresh')">
        {{ loading ? 'Actualizando...' : 'Recargar lista' }}
      </button>
    </div>

    <Teleport to="body">
      <Transition name="dropdown">
        <div
          v-if="isMenuVisible && activeUserRef"
          class="dropdown-menu-global"
          :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
          @click.stop
        >
          <button
            type="button"
            class="dropdown-item edit"
            @click="emit('edit', activeUserRef); closeDropdown()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Editar
          </button>

          <button
            v-if="activeUserRef.id !== currentUserId"
            type="button"
            class="dropdown-item toggle"
            :disabled="togglingUserId === activeUserRef.id"
            @click="emit('toggle', activeUserRef); closeDropdown()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
              <circle
                cx="8"
                cy="12"
                r="3.5"
                :fill="activeUserRef.isActive ? 'currentColor' : 'none'"
                :stroke="activeUserRef.isActive ? 'currentColor' : 'currentColor'"
              ></circle>
            </svg>
            {{ activeUserRef.isActive === false ? 'Activar' : 'Desactivar' }}
          </button>

          <button
            type="button"
            class="dropdown-item delete"
            :disabled="deletingUserId === activeUserRef.id || activeUserRef.id === currentUserId"
            @click="emit('remove', activeUserRef); closeDropdown()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              ></path>
            </svg>
            {{ deletingUserId === activeUserRef.id ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </Transition>
    </Teleport>

    <div v-if="loading" class="state-panel">
      <div class="spinner"></div>
      <p>Cargando administradores...</p>
    </div>

    <div v-else-if="adminUsers.length === 0" class="state-panel empty">
      <h4>No hay administradores creados</h4>
      <p>Cuando registres el primero aparecerá aquí con sus acciones de edición y borrado.</p>
    </div>

    <div v-else class="table-shell">
      <table class="users-table">
        <thead>
          <tr>
            <th>Administrador</th>
            <th>Rol</th>
            <th>Estado</th>
            <th class="actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>
              <div class="identity-cell">
                <div class="avatar">{{ user.fullName.charAt(0) }}</div>
                <div>
                  <p class="user-name">{{ user.fullName }}</p>
                  <p class="user-email">{{ user.email }}</p>
                </div>
              </div>
            </td>
            <td>
              <span class="role-pill">Admin</span>
            </td>
            <td>
              <span v-if="user.id === currentUserId" class="status-pill current">Tu sesión</span>
              <span v-else-if="user.isActive === false" class="status-pill inactive">Inactivo</span>
              <span v-else class="status-pill active">Activo</span>
            </td>
            <td class="actions-column">
              <div class="dropdown-container">
                <button
                  type="button"
                  class="dropdown-trigger"
                  :disabled="deletingUserId === user.id || togglingUserId === user.id"
                  @click="openDropdown(user.id, user, $event)"
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

      <div class="pagination-bar" aria-label="Paginación de administradores">
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
</template>

<style scoped>
.admin-users-table-card {
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

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid rgba(67, 17, 185, 0.08);
  text-align: left;
  vertical-align: middle;
}

.users-table th {
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

.identity-cell {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-80));
  color: var(--white);
  font-weight: 700;
}

.user-name,
.user-email {
  margin: 0;
}

.user-name {
  font-weight: 700;
  color: var(--text-dark);
}

.user-email {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.role-pill,
.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.role-pill {
  background: rgba(67, 17, 185, 0.1);
  color: var(--primary-color);
}

.status-pill.active {
  background: rgba(10, 71, 73, 0.08);
  color: var(--accent-teal);
}

.status-pill.current {
  background: rgba(236, 86, 41, 0.12);
  color: var(--secondary-90);
}

.status-pill.inactive {
  background: rgba(100, 100, 100, 0.1);
  color: var(--text-muted);
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
  min-width: 180px;
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

.dropdown-item.edit:hover {
  color: var(--primary-color);
}

.dropdown-item.toggle:hover {
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

.btn-outline {
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
  max-width: 420px;
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

@media (max-width: 768px) {
  .admin-users-table-card {
    padding: 1.5rem;
  }

  .table-header {
    flex-direction: column;
  }

  .actions-column {
    width: auto;
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
</style>
