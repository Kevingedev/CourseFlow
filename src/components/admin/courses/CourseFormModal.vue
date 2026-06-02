<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import CourseFormCard from './CourseFormCard.vue'
import type { CourseFormValues, CoursesFeedback } from '@/types/courses'
import type { CourseRecord } from '@/types/courses'

const props = defineProps<{
  open: boolean
  form: CourseFormValues
  canSubmit: boolean
  isEditing: boolean
  submitting: boolean
  feedback: CoursesFeedback | null
  selectedCourse: CourseRecord | null
}>()

const emit = defineEmits<{
  close: []
  submit: []
  reset: []
}>()

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.open) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-overlay" @click.self="emit('close')">
        <div class="modal-panel">
          <button type="button" class="modal-close" aria-label="Cerrar" @click="emit('close')">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <CourseFormCard
            :form="form"
            :can-submit="canSubmit"
            :is-editing="isEditing"
            :submitting="submitting"
            :feedback="feedback"
            :selected-course="selectedCourse"
            @submit="emit('submit')"
            @reset="emit('reset')"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  padding: 1.5rem;
}

.modal-panel {
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border-radius: 24px;
  background: var(--white);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--white);
  color: var(--text-muted);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  border-color: var(--secondary-color);
  color: var(--secondary-color);
}

/* Transition */
.modal-enter-active {
  animation: fadeIn 0.2s ease;
}

.modal-leave-active {
  animation: fadeIn 0.15s ease reverse;
}

.modal-enter-active .modal-panel {
  animation: slideUp 0.25s ease;
}

.modal-leave-active .modal-panel {
  animation: slideUp 0.15s ease reverse;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .modal-panel {
    max-height: 92vh;
    border-radius: 24px 24px 0 0;
  }
}
</style>
