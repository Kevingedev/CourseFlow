<script setup lang="ts">
import { shallowRef, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import type { WaitingListEntry } from '@/types/waitingList'

const props = defineProps<{
  entries: WaitingListEntry[]
  courseNameById: Map<string, string>
  updatingEntryId: string | number | null
  deletingEntryId: string | number | null
}>()

const emit = defineEmits<{
  pending: [entry: WaitingListEntry]
  remove: [entry: WaitingListEntry]
}>()

// Pagination configuration
const itemsPerPage = 5
const currentPage = shallowRef(1)

const totalEntries = computed(() => props.entries.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalEntries.value / itemsPerPage)))

const pageStartIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const pageEndIndex = computed(() =>
  Math.min(pageStartIndex.value + itemsPerPage, totalEntries.value),
)

const paginatedEntries = computed(() =>
  props.entries.slice(pageStartIndex.value, pageEndIndex.value),
)

const paginationSummary = computed(() => {
  if (totalEntries.value === 0) return 'Sin registros'
  return `Mostrando ${pageStartIndex.value + 1}-${pageEndIndex.value} de ${totalEntries.value}`
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
}

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
  if (currentPage.value < 1) {
    currentPage.value = 1
  }
})


const formatDate = (iso: string): string => {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const openDropdownId = shallowRef<string | number | null>(null)
const menuPosition = reactive({ top: 0, left: 0 })
const activeEntryRef = shallowRef<WaitingListEntry | null>(null)
const isMenuVisible = shallowRef(false)

const openDropdown = (entry: WaitingListEntry, event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  menuPosition.top = rect.bottom + 4
  menuPosition.left = Math.max(8, rect.right - 150)
  activeEntryRef.value = entry
  openDropdownId.value = entry.id
  isMenuVisible.value = true
}

const closeDropdown = () => {
  openDropdownId.value = null
  isMenuVisible.value = false
  activeEntryRef.value = null
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
  <div class="table-shell">
    <table class="waiting-table">
      <thead>
        <tr>
          <th>Posición</th>
          <th>Solicitud</th>
          <th>Curso</th>
          <th>Registro</th>
          <th class="actions-column">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in paginatedEntries" :key="String(entry.id)">
          <td>
            <span class="pill">{{ entry.position }}</span>
          </td>
          <td>
            <div class="request-cell">
              <p class="request-name">
                {{ entry.user?.name || `Usuario #${entry.user_id}` }}
              </p>
              <p class="request-email">
                {{ entry.user?.email || `ID usuario: ${entry.user_id}` }}
              </p>
            </div>
          </td>
          <td>
            <span class="course-pill">{{
              courseNameById.get(String(entry.course_id)) ||
              entry.course?.name ||
              `Curso #${entry.course_id}`
            }}</span>
          </td>
          <td>
            <span class="cell-muted">{{ formatDate(entry.created_at) }}</span>
          </td>
          <td class="actions-column">
            <div class="dropdown-container">
              <button
                type="button"
                class="dropdown-trigger"
                :disabled="updatingEntryId === entry.id || deletingEntryId === entry.id"
                @click="openDropdown(entry, $event)"
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

    <div v-if="totalPages > 1" class="pagination-bar" aria-label="Paginación de la lista de espera">
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

  <Teleport to="body">
    <Transition name="dropdown">
      <div
        v-if="isMenuVisible && activeEntryRef"
        class="dropdown-menu-global"
        :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
        @click.stop
      >
        <button
          type="button"
          class="dropdown-item status"
          :disabled="updatingEntryId === activeEntryRef.id"
          @click="emit('pending', activeEntryRef); closeDropdown()"
        >
          Pendiente
        </button>

        <div class="dropdown-divider"></div>

        <button
          type="button"
          class="dropdown-item delete"
          :disabled="deletingEntryId === activeEntryRef.id"
          @click="emit('remove', activeEntryRef); closeDropdown()"
        >
          Eliminar
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.table-shell {
  overflow-x: auto;
}

.waiting-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 920px;
}

.waiting-table th {
  text-align: left;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 1rem 0.75rem;
  color: var(--text-muted);
}

.waiting-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid rgba(67, 17, 185, 0.08);
  text-align: left;
  vertical-align: middle;
}

.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-weight: 800;
  color: var(--primary-color);
  background: rgba(67, 17, 185, 0.1);
  border: 1px solid rgba(67, 17, 185, 0.18);
}

.request-cell {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.request-name {
  margin: 0;
  font-weight: 800;
  color: var(--text-dark);
}

.request-email {
  margin: 0;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.9rem;
}

.cell-muted {
  color: var(--text-muted);
  font-weight: 600;
}

.course-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  background: rgba(67, 17, 185, 0.08);
  color: var(--primary-color);
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
  padding: 0;
  outline: none;
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
  min-width: 150px;
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
  padding: 0.55rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-dark);
  font-size: 0.88rem;
  font-weight: 600;
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

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 0.25rem 0;
  border-top: 1px solid rgba(67, 17, 185, 0.08);
  margin-top: 0.5rem;
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
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 50%;
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
  padding: 0;
}

.pagination-ellipsis {
  width: 28px;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
</style>
