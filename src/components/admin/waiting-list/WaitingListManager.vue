<script setup lang="ts">
import { Search } from '@lucide/vue'
import WaitingListTable from './WaitingListTable.vue'
import { useWaitingList } from '@/composables/useWaitingList'

const {
  courses,
  courseNameById,
  selectedCourse,
  selectedCourseId,
  entries,
  loadingCourses,
  loadingEntries,
  error,
  searchQuery,
  loadCourses,
  loadEntries,
} = useWaitingList()

const handleRefresh = async () => {
  await loadCourses()
  await loadEntries()
}
</script>

<template>
  <div class="waiting-list-manager">
    <div v-if="error" class="feedback-banner error">
      {{ error }}
    </div>

    <section class="glass-card waiting-list-card">
      <div class="table-header">
        <div>
          <p class="eyebrow">Administración</p>
          <h3>Lista de espera por curso</h3>
        </div>

        <div class="table-header-actions">
          <div class="search-wrapper">
            <Search class="search-icon" :size="16" aria-hidden="true" />
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Buscar por usuario, email o curso..."
            />
          </div>

          <select v-model="selectedCourseId" class="course-filter" :disabled="loadingCourses">
            <option value="all">Todos los cursos</option>
            <option v-if="loadingCourses" value="all" disabled>Cargando cursos...</option>
            <option
              v-for="course in courses"
              :key="String(course.id)"
              :value="String(course.id)"
            >
              {{ course.name }}
            </option>
          </select>

          <button
            type="button"
            class="btn-outline"
            :disabled="loadingCourses || loadingEntries"
            @click="handleRefresh"
          >
            {{ loadingEntries ? 'Actualizando...' : 'Recargar' }}
          </button>
        </div>
      </div>

      <div v-if="loadingEntries" class="state-panel">
        <div class="spinner"></div>
        <p>Cargando lista de espera...</p>
      </div>

      <div v-else-if="entries.length === 0" class="state-panel empty">
        <template v-if="searchQuery.trim()">
          <h4>Sin resultados</h4>
          <p>No se encontraron registros con el filtro actual.</p>
        </template>
        <template v-else>
          <h4>Sin usuarios en espera</h4>
          <p>
            {{
              selectedCourseId === 'all'
                ? 'No hay registros en lista de espera actualmente.'
                : selectedCourse?.name
                  ? `El curso "${selectedCourse.name}" no tiene registros en lista de espera.`
                  : 'Este curso no tiene registros en lista de espera.'
            }}
          </p>
        </template>
      </div>

      <WaitingListTable
        v-else
        :entries="entries"
        :course-name-by-id="courseNameById"
      />
    </section>
  </div>
</template>

<style scoped>
.waiting-list-manager {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.waiting-list-card {
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

.table-header h3 {
  margin: 0;
  color: var(--text-dark);
  font-size: 1.4rem;
}

.eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary-50);
  margin: 0 0 0.4rem;
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
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0.6rem 0.85rem 0.6rem 2.35rem;
  width: 240px;
  background: rgba(255, 255, 255, 0.9);
  outline: none;
  font-weight: 600;
  color: var(--text-dark);
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 17, 185, 0.08);
}

.course-filter {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0.6rem 0.85rem;
  background: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  color: var(--text-dark);
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
}

.btn-outline {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  padding: 0.75rem 1.25rem;
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

.course-filter:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 17, 185, 0.08);
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

.state-panel.empty h4 {
  margin: 0;
  color: var(--text-dark);
}

.state-panel.empty p {
  margin: 0;
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

.feedback-banner {
  border-radius: 12px;
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.feedback-banner.error {
  background: rgba(236, 86, 41, 0.1);
  color: var(--secondary-90);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .table-header {
    flex-direction: column;
    align-items: stretch;
  }

  .table-header-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .search-input,
  .course-filter {
    width: 100%;
  }
}
</style>
