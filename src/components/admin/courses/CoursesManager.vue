<script setup lang="ts">
import { ref } from 'vue'
import { useCourses } from '@/composables/useCourses'
import CourseFormModal from './CourseFormModal.vue'
import CoursesTable from './CoursesTable.vue'
import type { CourseRecord } from '@/types/courses'

const {
  courses,
  canSubmit,
  deletingCourseId,
  feedback,
  form,
  isEditing,
  loading,
  searchQuery,
  selectedCourse,
  submitting,
  hydrateFormForEdit,
  loadCourses,
  removeCourse,
  resetForm,
  submitForm,
} = useCourses()

const showModal = ref(false)

const openCreateModal = () => {
  resetForm()
  showModal.value = true
}

const openEditModal = (course: CourseRecord) => {
  hydrateFormForEdit(course)
  showModal.value = true
}

const closeModal = () => {
  resetForm()
  showModal.value = false
}

const handleSubmit = async () => {
  await submitForm()

  if (feedback.value?.type === 'success') {
    showModal.value = false
  }
}

const handleReset = () => {
  resetForm()

  if (isEditing.value) {
    showModal.value = false
  }
}

const handleDelete = async (course: CourseRecord) => {
  const confirmed = window.confirm(
    `Vas a desactivar el curso "${course.name}". Los alumnos ya inscritos no se verán afectados, pero el curso dejará de ser visible para nuevas inscripciones.`,
  )

  if (!confirmed) {
    return
  }

  await removeCourse(course)
}
</script>

<template>
  <div class="courses-manager">
    <div class="manager-header">
      <div>
        <!-- <p class="eyebrow">Panel de cursos</p>
        <h2>Gestión de Cursos</h2> -->
      </div>
      <button type="button" class="btn-primary" @click="openCreateModal">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Nuevo curso
      </button>
    </div>

    <CoursesTable
      :courses="courses"
      :search-query="searchQuery"
      :deleting-course-id="deletingCourseId"
      :loading="loading"
      @edit="openEditModal"
      @refresh="loadCourses"
      @remove="handleDelete"
      @update:search-query="searchQuery = $event"
    />

    <CourseFormModal
      :open="showModal"
      :form="form"
      :can-submit="canSubmit"
      :is-editing="isEditing"
      :submitting="submitting"
      :feedback="feedback"
      :selected-course="selectedCourse"
      @close="closeModal"
      @submit="handleSubmit"
      @reset="handleReset"
    />
  </div>
</template>

<style scoped>
.courses-manager {
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

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-primary:hover {
  background: var(--primary-80);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(67, 17, 185, 0.2);
}

@media (max-width: 640px) {
  .manager-header {
    flex-direction: column;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style>
