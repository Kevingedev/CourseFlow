<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import type { CourseRecord } from '@/types/courses'

const props = defineProps<{
  courses: CourseRecord[]
  searchQuery: string
  deletingCourseId: number | null
  loading: boolean
}>()

const emit = defineEmits<{
  edit: [course: CourseRecord]
  remove: [course: CourseRecord]
  refresh: []
  'update:searchQuery': [value: string]
}>()

const formatDateRange = (start: string, end: string): string => {
  if (!start || !end) return '—'

  const fmt = (dateStr: string) => {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return `${fmt(start)} – ${fmt(end)}`
}

const formatCapacity = (capacity: number | null): string => {
  if (capacity === null || capacity === 0) return 'Sin límite'
  return String(capacity)
}

const itemsPerPage = 5
const currentPage = shallowRef(1)
const totalCourses = computed(() => props.courses.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCourses.value / itemsPerPage)))
const pageStartIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const pageEndIndex = computed(() =>
  Math.min(pageStartIndex.value + itemsPerPage, totalCourses.value),
)
const paginatedCourses = computed(() =>
  props.courses.slice(pageStartIndex.value, pageEndIndex.value),
)
const paginationSummary = computed(() => {
  if (totalCourses.value === 0) {
    return 'Sin registros'
  }

  return `Mostrando ${pageStartIndex.value + 1}-${pageEndIndex.value} de ${totalCourses.value}`
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

watch(
  () => props.searchQuery,
  () => {
    currentPage.value = 1
  },
)

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})
</script>

<template>
  <section class="glass-card courses-table-card">
    <div class="table-header">
      <div>
        <p class="eyebrow">Catálogo</p>
        <h3>Cursos registrados</h3>
      </div>
      <div class="table-header-actions">
        <div class="search-wrapper">
          <svg
            class="search-icon"
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
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            :value="searchQuery"
            type="text"
            class="search-input"
            placeholder="Buscar curso..."
            @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <button type="button" class="btn-outline" :disabled="loading" @click="emit('refresh')">
          {{ loading ? 'Actualizando...' : 'Recargar' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="state-panel">
      <div class="spinner"></div>
      <p>Cargando cursos...</p>
    </div>

    <div v-else-if="courses.length === 0" class="state-panel empty">
      <template v-if="searchQuery.trim()">
        <h4>Sin resultados</h4>
        <p>No se encontraron cursos que coincidan con "{{ searchQuery }}".</p>
      </template>
      <template v-else>
        <h4>No hay cursos registrados</h4>
        <p>
          Crea tu primer curso presionando el botón "Nuevo curso" y aparecerá aquí con sus acciones
          de edición y desactivación.
        </p>
      </template>
    </div>

    <div v-else class="table-shell">
      <table class="courses-table">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Duración</th>
            <th>Capacidad</th>
            <th>Estado</th>
            <th class="actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in paginatedCourses" :key="course.id">
            <td>
              <div class="course-cell">
                <p class="course-name">{{ course.name }}</p>
                <p v-if="course.description" class="course-desc">{{ course.description }}</p>
              </div>
            </td>
            <td>
              <span class="date-range">{{
                formatDateRange(course.start_date, course.end_date)
              }}</span>
            </td>
            <td>
              <span class="capacity-pill">{{ formatCapacity(course.capacity) }}</span>
            </td>
            <td>
              <span class="status-pill" :class="course.is_active ? 'active' : 'inactive'">
                {{ course.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="actions-column">
              <div class="actions-group">
                <button type="button" class="table-action edit" @click="emit('edit', course)">
                  Editar
                </button>
                <button
                  type="button"
                  class="table-action delete"
                  :disabled="deletingCourseId === course.id"
                  @click="emit('remove', course)"
                >
                  {{ deletingCourseId === course.id ? 'Desactivando...' : 'Desactivar' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination-bar" aria-label="Paginación de cursos">
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
.courses-table-card {
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

.search-input {
  padding: 0.6rem 0.85rem 0.6rem 2.35rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-dark);
  font-size: 0.9rem;
  width: 200px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  font-family: inherit;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 17, 185, 0.08);
}

.search-input::placeholder {
  color: var(--text-muted);
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

.courses-table {
  width: 100%;
  border-collapse: collapse;
}

.courses-table th,
.courses-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid rgba(67, 17, 185, 0.08);
  text-align: left;
  vertical-align: middle;
}

.courses-table th {
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

.course-cell {
  max-width: 280px;
}

.course-name {
  margin: 0 0 0.25rem 0;
  font-weight: 700;
  color: var(--text-dark);
}

.course-desc {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date-range {
  font-size: 0.9rem;
  color: var(--text-dark);
}

.capacity-pill,
.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.capacity-pill {
  background: rgba(67, 17, 185, 0.08);
  color: var(--primary-color);
}

.status-pill.active {
  background: rgba(10, 71, 73, 0.08);
  color: var(--accent-teal);
}

.status-pill.inactive {
  background: rgba(236, 86, 41, 0.1);
  color: var(--secondary-90);
}

.actions-column {
  width: 200px;
}

.actions-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.table-action,
.btn-outline {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.table-action {
  padding: 0.65rem 0.9rem;
}

.btn-outline {
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.7);
  color: var(--text-dark);
}

.table-action.edit:hover,
.btn-outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.table-action.delete {
  color: var(--secondary-90);
}

.table-action.delete:hover {
  border-color: var(--secondary-color);
  color: var(--secondary-color);
}

.table-action:disabled,
.btn-outline:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  .courses-table-card {
    padding: 1.5rem;
  }

  .table-header {
    flex-direction: column;
  }

  .table-header-actions {
    width: 100%;
    flex-direction: column;
  }

  .search-wrapper {
    width: 100%;
  }

  .search-input {
    width: 100%;
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
