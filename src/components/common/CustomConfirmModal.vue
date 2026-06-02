<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
    loading?: boolean
  }>(),
  {
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'danger',
    loading: false,
  },
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const titleId = 'confirm-dialog-title'

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.open && !props.loading) {
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
    <Transition name="confirm-modal">
      <div v-if="open" class="confirm-overlay" @click.self="!loading && emit('close')">
        <div class="confirm-panel" role="dialog" aria-modal="true" :aria-labelledby="titleId">
          <div class="confirm-icon-wrapper" :class="type">
            <!-- Danger / Delete (Trash) -->
            <svg
              v-if="type === 'danger'"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <!-- Warning / Deactivate (Alert Triangle) -->
            <svg
              v-else-if="type === 'warning'"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
              ></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <!-- Info / Default (Info circle) -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>

          <div class="confirm-content">
            <h3 :id="titleId" class="confirm-title">{{ title }}</h3>
            <p class="confirm-message">{{ message }}</p>
          </div>

          <div class="confirm-actions">
            <button type="button" class="btn-cancel" :disabled="loading" @click="emit('close')">
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="btn-confirm"
              :class="type"
              :disabled="loading"
              @click="emit('confirm')"
            >
              <span v-if="loading" class="spinner"></span>
              <span v-else>{{ confirmText }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgba(15, 6, 30, 0.45);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  padding: 1.5rem;
}

.confirm-panel {
  width: 100%;
  max-width: 440px;
  background: var(--white);
  border-radius: 24px;
  border: 1px solid rgba(67, 17, 185, 0.12);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 20px 40px -4px rgba(67, 17, 185, 0.12);
  padding: 2.25rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.confirm-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-color));
}

.confirm-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin-bottom: 1.25rem;
  transition: all 0.3s ease;
}

.confirm-icon-wrapper.danger {
  background: rgba(236, 86, 32, 0.1);
  color: var(--primary-color);
}

.confirm-icon-wrapper.warning {
  background: rgba(236, 86, 32, 0.08);
  color: var(--primary-80);
}

.confirm-icon-wrapper.info {
  background: var(--primary-color-soft);
  color: var(--primary-color);
}

.confirm-content {
  margin-bottom: 2rem;
}

.confirm-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.confirm-message {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.5;
  padding: 0 0.5rem;
}

.confirm-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
}

button {
  padding: 0.85rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-main);
}

.btn-cancel {
  border: 1px solid var(--border-color);
  background: var(--white);
  color: var(--text-muted);
}

.btn-cancel:hover:not(:disabled) {
  background: var(--neutral-gray);
  border-color: rgba(67, 17, 185, 0.2);
  color: var(--text-dark);
  transform: translateY(-1px);
}

.btn-cancel:active:not(:disabled) {
  transform: translateY(0);
}

.btn-confirm {
  color: var(--white);
  border: none;
}

.btn-confirm.danger {
  background: var(--primary-color);
  box-shadow: 0 4px 12px rgba(236, 86, 32, 0.2);
}

.btn-confirm.danger:hover:not(:disabled) {
  background: var(--primary-80);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(236, 86, 32, 0.3);
}

.btn-confirm.warning {
  background: var(--primary-color);
  box-shadow: 0 4px 12px rgba(236, 86, 32, 0.2);
}

.btn-confirm.warning:hover:not(:disabled) {
  background: var(--primary-80);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(236, 86, 32, 0.3);
}

.btn-confirm.info {
  background: var(--primary-color);
  box-shadow: 0 4px 12px rgba(67, 17, 185, 0.2);
}

.btn-confirm.info:hover:not(:disabled) {
  background: var(--primary-80);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(67, 17, 185, 0.3);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--white);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Transitions */
.confirm-modal-enter-active {
  animation: fadeIn 0.25s ease;
}

.confirm-modal-leave-active {
  animation: fadeIn 0.2s ease reverse;
}

.confirm-modal-enter-active .confirm-panel {
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.confirm-modal-leave-active .confirm-panel {
  animation: scaleUp 0.2s ease reverse;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (max-width: 480px) {
  .confirm-panel {
    padding: 1.75rem 1.5rem 1.5rem 1.5rem;
    border-radius: 20px;
  }

  .confirm-actions {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .btn-confirm {
    order: -1;
  }
}
</style>
