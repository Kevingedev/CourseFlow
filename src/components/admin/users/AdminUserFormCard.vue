<script setup lang="ts">
import type { AdminUserFormValues, AdminUsersFeedback } from '@/types/adminUsers'
import type { User } from '@/types/auth'

defineProps<{
  form: AdminUserFormValues
  canSubmit: boolean
  isEditing: boolean
  submitting: boolean
  feedback: AdminUsersFeedback | null
  selectedUser: User | null
}>()

const emit = defineEmits<{
  submit: []
  reset: []
}>()
</script>

<template>
  <section class="glass-card admin-user-form-card">
    <div class="card-header">
      <div>
        <p class="eyebrow">Gestión de acceso</p>
        <h3>{{ isEditing ? 'Editar administrador' : 'Crear administrador' }}</h3>
      </div>
      <button
        v-if="isEditing"
        type="button"
        class="ghost-action"
        @click="emit('reset')"
      >
        Cancelar edición
      </button>
    </div>

    <p class="card-description">
      {{
        isEditing
          ? `Vas a actualizar los datos de ${selectedUser?.fullName}.`
          : 'Crea nuevos usuarios con rol admin desde este panel.'
      }}
    </p>

    <div v-if="feedback" class="feedback-banner" :class="feedback.type">
      {{ feedback.message }}
    </div>

    <form class="admin-user-form" @submit.prevent="emit('submit')">
      <label class="field-group">
        <span class="field-label">Nombre completo</span>
        <input
          v-model="form.name"
          type="text"
          class="field-input"
          placeholder="Nombre del administrador"
          autocomplete="name"
        />
      </label>

      <label class="field-group">
        <span class="field-label">Correo electrónico</span>
        <input
          v-model="form.email"
          type="email"
          class="field-input"
          placeholder="admin@courseflow.dev"
          autocomplete="email"
        />
      </label>

      <label v-if="!isEditing" class="field-group">
        <span class="field-label">Contraseña inicial</span>
        <input
          v-model="form.password"
          type="password"
          class="field-input"
          placeholder="Contraseña segura"
          autocomplete="new-password"
        />
      </label>

      <p v-else class="field-hint">
        La actualización usa el endpoint de edición y no modifica la contraseña.
      </p>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="submitting || !canSubmit">
          {{ submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear administrador' }}
        </button>
        <button type="button" class="btn-outline" :disabled="submitting" @click="emit('reset')">
          Limpiar formulario
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.admin-user-form-card {
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
  color: var(--secondary-color);
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

.admin-user-form {
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

.field-input {
  width: 100%;
  padding: 0.95rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--text-dark);
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(67, 17, 185, 0.08);
}

.field-hint {
  margin: 0;
  font-size: 0.85rem;
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
  .admin-user-form-card {
    padding: 1.5rem;
  }

  .card-header {
    flex-direction: column;
  }

  .form-actions > * {
    width: 100%;
  }
}
</style>
