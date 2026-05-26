<script setup lang="ts">
import type { CourseFormValues, CoursesFeedback } from '@/types/courses'
import type { CourseRecord } from '@/types/courses'

defineProps<{
  form: CourseFormValues
  canSubmit: boolean
  isEditing: boolean
  submitting: boolean
  feedback: CoursesFeedback | null
  selectedCourse: CourseRecord | null
}>()

const emit = defineEmits<{
  submit: []
  reset: []
}>()
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <section class="glass-card course-form-card">
    <div class="card-header">
      <div>
        <p class="eyebrow">Panel de cursos</p>
        <h3>{{ isEditing ? 'Editar curso' : 'Crear curso' }}</h3>
      </div>
      <button v-if="isEditing" type="button" class="ghost-action" @click="emit('reset')">
        Cancelar edición
      </button>
    </div>

    <p class="card-description">
      {{
        isEditing
          ? `Vas a actualizar los datos de "${selectedCourse?.name}".`
          : 'Registra un nuevo curso de formación desde este panel.'
      }}
    </p>

    <div v-if="feedback" class="feedback-banner" :class="feedback.type">
      {{ feedback.message }}
    </div>

    <form class="course-form" @submit.prevent="emit('submit')">
      <label class="field-group">
        <span class="field-label">Nombre del curso <span class="required">*</span></span>
        <input
          v-model="form.name"
          type="text"
          class="field-input"
          placeholder="Ej: Curso de Docker y Kubernetes"
        />
      </label>

      <label class="field-group">
        <span class="field-label">Descripción</span>
        <textarea
          v-model="form.description"
          class="field-input field-textarea"
          placeholder="Describe el temario y objetivos del curso..."
          rows="3"
        ></textarea>
      </label>

      <div class="field-row">
        <label class="field-group">
          <span class="field-label">Fecha de inicio <span class="required">*</span></span>
          <input v-model="form.start_date" type="date" class="field-input" />
        </label>

        <label class="field-group">
          <span class="field-label">Fecha de fin <span class="required">*</span></span>
          <input v-model="form.end_date" type="date" class="field-input" />
        </label>
      </div>

      <label class="field-group">
        <span class="field-label">Capacidad máxima</span>
        <input
          v-model="form.capacity"
          type="number"
          class="field-input"
          placeholder="0 o vacío = sin límite"
          min="0"
        />
        <p class="field-hint">Deja 0 o vacío para cursos sin límite de alumnos.</p>
      </label>

      <label class="toggle-group">
        <span class="field-label">Curso activo</span>
        <div class="toggle-track">
          <input v-model="form.is_active" type="checkbox" class="toggle-input" role="switch" />
          <span class="toggle-slider"></span>
          <span class="toggle-label">{{ form.is_active ? 'Visible para alumnos' : 'Oculto' }}</span>
        </div>
      </label>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="submitting || !canSubmit">
          {{ submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear curso' }}
        </button>
        <button type="button" class="btn-outline" :disabled="submitting" @click="emit('reset')">
          Limpiar formulario
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.course-form-card {
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card-header {
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

.card-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: var(--text-dark);
}

.card-description {
  margin: 0;
  color: var(--text-muted);
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

.course-form {
  display: grid;
  gap: 1rem;
}

.field-group {
  display: grid;
  gap: 0.45rem;
}

.field-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-dark);
}

.required {
  color: var(--secondary-color);
}

.field-input {
  width: 100%;
  padding: 0.95rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--text-dark);
  font-size: 0.95rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  font-family: inherit;
}

.field-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(67, 17, 185, 0.08);
}

.field-textarea {
  resize: vertical;
  min-height: 80px;
}

.field-hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.toggle-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
}

.toggle-track {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toggle-input {
  appearance: none;
  width: 44px;
  height: 24px;
  background: var(--border-color);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.toggle-input::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: var(--white);
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.toggle-input:checked {
  background: var(--primary-color);
}

.toggle-input:checked::before {
  transform: translateX(20px);
}

.toggle-label {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.btn-primary:disabled,
.btn-outline:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-outline,
.ghost-action {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-dark);
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-outline {
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.7);
}

.ghost-action {
  padding: 0.65rem 0.9rem;
}

.btn-outline:hover,
.ghost-action:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

@media (max-width: 640px) {
  .course-form-card {
    padding: 1.5rem;
  }

  .card-header {
    flex-direction: column;
  }

  .field-row {
    grid-template-columns: 1fr;
  }

  .form-actions > * {
    width: 100%;
  }
}
</style>
