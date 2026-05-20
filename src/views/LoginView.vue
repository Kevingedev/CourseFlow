<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { Info, TriangleAlert, Star, Shield, GraduationCap } from '@lucide/vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// Form states
const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: '',
  general: ''
})

const isLoading = ref(false)
const sessionExpiredMsg = ref('')

// Check if redirected due to expired session
let unsubscribe: (() => void) | null = null

onMounted(() => {
  const handleSessionExpired = (e: Event) => {
    const customEvent = e as CustomEvent
    sessionExpiredMsg.value = customEvent.detail || 'Tu sesión ha expirado.'
    errors.general = ''
  }

  window.addEventListener('auth:expired', handleSessionExpired)
  unsubscribe = () => {
    window.removeEventListener('auth:expired', handleSessionExpired)
  }

  // Also check if there's a redirected query or parameter
  if (route.query.redirect) {
    sessionExpiredMsg.value = 'Inicia sesión para acceder a esta sección protegida.'
  }
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

// Quick-fill credentials for testing
const fillCredentials = (role: 'suadmin' | 'admin' | 'user') => {
  sessionExpiredMsg.value = ''
  errors.general = ''
  errors.email = ''
  errors.password = ''

  if (role === 'suadmin') {
    form.email = 'super@admin.com'
    form.password = 'super123'
  } else if (role === 'admin') {
    form.email = 'admin@admin.com'
    form.password = 'admin123'
  } else {
    form.email = 'test@gmail.com'
    form.password = 'unodostres'
  }
}

// Simple email regex validation
const validateForm = (): boolean => {
  let isValid = true
  errors.email = ''
  errors.password = ''
  errors.general = ''

  if (!form.email) {
    errors.email = 'El correo electrónico es requerido.'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Ingresa un formato de correo válido.'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'La contraseña es requerida.'
    isValid = false
  } else if (form.password.length < 4) {
    errors.password = 'La contraseña debe tener al menos 4 caracteres.'
    isValid = false
  }

  return isValid
}

// Handle Form Submit
const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errors.general = ''
  sessionExpiredMsg.value = ''

  try {
    const user = await authStore.login(form.email, form.password)

    // Redirect based on role and query redirects
    const redirectTo = route.query.redirect as string

    if (redirectTo) {
      router.push({ path: redirectTo })
    } else if (user.role === 'admin' || user.role === 'suadmin') {
      router.push({ name: 'admin-dashboard' })
    } else {
      router.push({ name: 'courses' })
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error al iniciar sesión. Inténtalo de nuevo.'
    errors.general = errorMsg
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-view container section-padding">
    <div class="login-card glass-card">
      <div class="card-header">
        <h2>Bienvenido de Nuevo</h2>
        <p>Inicia sesión para continuar en CourseFlow</p>
      </div>

      <!-- Feedback Alerts -->
      <Transition name="fade">
        <div v-if="sessionExpiredMsg" class="alert alert-info">
          <span class="alert-icon"><Info :size="18" /></span>
          <span class="alert-text">{{ sessionExpiredMsg }}</span>
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="errors.general" class="alert alert-error">
          <span class="alert-icon"><TriangleAlert :size="18" /></span>
          <span class="alert-text">{{ errors.general }}</span>
        </div>
      </Transition>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" novalidate>
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            placeholder="ejemplo@correo.com"
            :class="{ 'has-error': errors.email }"
            :disabled="isLoading"
            autocomplete="email"
          />
          <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            placeholder="••••••••"
            :class="{ 'has-error': errors.password }"
            :disabled="isLoading"
            autocomplete="current-password"
          />
          <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
        </div>

        <button type="submit" class="btn-primary w-full submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Iniciar Sesión</span>
        </button>
      </form>

      <!-- Helper / Quick Fill for testing -->
      <div class="demo-accounts">
        <span class="demo-title">Autocompletar cuentas de prueba:</span>
        <div class="demo-buttons">
          <button
            type="button"
            class="demo-btn role-suadmin"
            @click="fillCredentials('suadmin')"
            :disabled="isLoading"
          >
            <Star :size="14" /> Super Admin
          </button>
          <button
            type="button"
            class="demo-btn role-admin"
            @click="fillCredentials('admin')"
            :disabled="isLoading"
          >
            <Shield :size="14" /> Admin
          </button>
          <button
            type="button"
            class="demo-btn role-user"
            @click="fillCredentials('user')"
            :disabled="isLoading"
          >
            <GraduationCap :size="14" /> Estudiante
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-card {
  width: 100%;
  max-width: 480px;
  padding: 3rem;
  border-radius: 16px;
}

@media (max-width: 576px) {
  .login-card {
    padding: 2rem 1.5rem;
  }
}

.card-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.card-header h2 {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.card-header p {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-dark);
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: rgba(255, 255, 255, 0.5);
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.2s ease;
  color: var(--text-dark);
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--white);
  box-shadow: 0 0 0 4px var(--primary-color-soft);
}

input.has-error {
  border-color: var(--secondary-color);
}

input.has-error:focus {
  box-shadow: 0 0 0 4px var(--secondary-color-soft);
}

.error-msg {
  color: var(--secondary-color);
  font-size: 0.825rem;
  font-weight: 500;
}

.w-full {
  width: 100%;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem;
  font-size: 1.05rem;
  margin-top: 1.5rem;
}

.alert {
  padding: 0.85rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  font-size: 0.875rem;
  line-height: 1.4;
}

.alert-info {
  background-color: rgba(84, 24, 193, 0.08);
  border: 1px solid rgba(84, 24, 193, 0.15);
  color: var(--primary-color);
}

.alert-error {
  background-color: rgba(255, 87, 34, 0.08);
  border: 1px solid rgba(255, 87, 34, 0.15);
  color: var(--secondary-color);
}

.alert-icon {
  font-size: 1.1rem;
}

.alert-text {
  font-weight: 500;
}

/* Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--white);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Demo accounts fill utility */
.demo-accounts {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed var(--border-color);
}

.demo-title {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  text-align: center;
}

.demo-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.demo-btn {
  padding: 0.5rem 0.25rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  border: 1px solid var(--border-color);
  background-color: var(--white);
  transition: all 0.2s ease;
  color: var(--text-dark);
}

.demo-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(84, 24, 193, 0.05);
}

.demo-btn.role-suadmin:hover {
  border-color: #d32f2f;
  background-color: #ffe6e6;
  color: #d32f2f;
}

.demo-btn.role-admin:hover {
  border-color: #1890ff;
  background-color: #e6f7ff;
  color: #1890ff;
}

.demo-btn.role-user:hover {
  border-color: #2f54eb;
  background-color: #f0f5ff;
  color: #2f54eb;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
