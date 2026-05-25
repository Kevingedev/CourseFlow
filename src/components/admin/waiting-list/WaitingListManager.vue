<script setup lang="ts">
import { RefreshCcw, Search } from '@lucide/vue'
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
            <option v-if="loadingCourses" value="">Cargando cursos...</option>
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
            <RefreshCcw :size="16" aria-hidden="true" />
            {{ loadingEntries ? 'Actualizando...' : 'Recargar' }}
          </button>
        </div>
      </div>

      <div v-if="loadingEntries" class="state-panel">
        <div class="spinner"></div>
        <p>Cargando lista de espera...</p>
      </div>

      <div v-else-if="!selectedCourseId" class="state-panel empty">
        <h4>Selecciona un curso</h4>
        <p>Elige un curso para consultar su lista de espera.</p>
      </div>

      <div v-else-if="entries.length === 0" class="state-panel empty">
        <template v-if="searchQuery.trim()">
          <h4>Sin resultados</h4>
          <p>No se encontraron registros con el filtro actual.</p>
        </template>
        <template v-else>
          <h4>Sin usuarios en espera</h4>
          <p>
            {{ selectedCourse?.name ? `El curso "${selectedCourse.name}" no tiene registros en lista de espera.` : 'Este curso no tiene registros en lista de espera.' }}
          </p>
        </template>
      </div>

      <WaitingListTable v-else :entries="entries" :course-name-by-id="courseNameById" />
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
  padding: 1.25rem 1.35rem;
}

.table-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.table-header h3 {
  margin: 0.25rem 0 0;
  color: var(--text-dark);
  font-size: 1.25rem;
}

.eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary-50);
  margin: 0;
}

.table-header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-input {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 0.7rem 0.9rem 0.7rem 2.25rem;
  min-width: 260px;
  background: rgba(255, 255, 255, 0.85);
  outline: none;
  font-weight: 600;
  color: var(--text-dark);
}

.search-input:focus {
  border-color: rgba(67, 17, 185, 0.35);
}

.course-filter {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 0.7rem 0.9rem;
  min-width: 240px;
  background: rgba(255, 255, 255, 0.85);
  font-weight: 700;
  color: var(--text-dark);
}

.state-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.75rem;
  padding: 2.25rem 1rem;
  color: var(--text-muted);
}

.state-panel.empty h4 {
  margin: 0;
  color: var(--text-dark);
}

.state-panel.empty p {
  margin: 0;
  max-width: 540px;
  text-align: center;
}

.spinner {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 3px solid rgba(100, 116, 139, 0.2);
  border-top-color: rgba(67, 17, 185, 0.75);
  animation: spin 0.8s linear infinite;
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
  }

  .search-input,
  .course-filter {
    width: 100%;
    min-width: 0;
  }
}
</style>
