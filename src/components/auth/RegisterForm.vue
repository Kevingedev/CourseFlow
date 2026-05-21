<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CalendarDays, CircleAlert, IdCard, Mail, ShieldCheck, UserRound } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  dniNie: '',
  birthDate: '',
})

const errors = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  dniNie: '',
  birthDate: '',
  general: '',
})

const isLoading = ref(false)

const emailPattern = /^\S+@\S+\.\S+$/
const dniNiePattern = /^([XYZ]\d{7}|\d{8})[A-Za-z]$/

const getMinimumBirthDate = () => {
  const today = new Date()
  return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0]
}

const isAdult = (birthDate: string) => {
  const parsedDate = new Date(`${birthDate}T00:00:00`)
  return parsedDate <= new Date(`${getMinimumBirthDate()}T23:59:59`)
}

const resetErrors = () => {
  errors.fullName = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.dniNie = ''
  errors.birthDate = ''
  errors.general = ''
}

const validate = () => {
  resetErrors()
  let isValid = true

  if (!formData.fullName.trim()) {
    errors.fullName = 'El nombre completo es obligatorio.'
    isValid = false
  }

  if (!formData.email.trim()) {
    errors.email = 'El correo electrónico es obligatorio.'
    isValid = false
  } else if (!emailPattern.test(formData.email)) {
    errors.email = 'Introduce un correo válido.'
    isValid = false
  }

  if (!formData.password) {
    errors.password = 'La contraseña es obligatoria.'
    isValid = false
  } else if (formData.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres.'
    isValid = false
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña.'
    isValid = false
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden.'
    isValid = false
  }

  if (formData.dniNie && !dniNiePattern.test(formData.dniNie.trim().toUpperCase())) {
    errors.dniNie = 'Introduce un DNI o NIE válido.'
    isValid = false
  }

  if (formData.birthDate && !isAdult(formData.birthDate)) {
    errors.birthDate = 'Debes ser mayor de 18 años para registrarte.'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  isLoading.value = true

  try {
    await authStore.register({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      dniNie: formData.dniNie.trim().toUpperCase(),
      birthDate: formData.birthDate || undefined,
    })

    const role = authStore.user?.role
    router.push(role === 'admin' || role === 'suadmin' ? '/admin/dashboard' : '/courses')
  } catch (error: unknown) {
    errors.general =
      error instanceof Error ? error.message : 'No se pudo completar el registro. Inténtalo de nuevo.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-card">
    <h1 class="auth-title">Crea tu cuenta</h1>
    <p class="auth-subtitle">Regístrate con tus datos y activa tu sesión en CourseFlow.</p>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-label">Nombre Completo</label>
        <div class="input-shell">
          <UserRound :size="18" class="input-icon" />
          <input
          v-model="formData.fullName"
          type="text"
          class="form-input"
          placeholder="Tu nombre y apellidos"
          :disabled="isLoading"
          autocomplete="name"
        />
        </div>
        <p v-if="errors.fullName" class="form-error">{{ errors.fullName }}</p>
      </div>

      <div class="form-group">
        <label class="form-label">Correo Electrónico</label>
        <div class="input-shell">
          <Mail :size="18" class="input-icon" />
          <input
          v-model="formData.email"
          type="email"
          class="form-input"
          placeholder="email@ejemplo.com"
          :disabled="isLoading"
          autocomplete="email"
        />
        </div>
        <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <label class="form-label">Contraseña</label>
        <div class="input-shell">
          <ShieldCheck :size="18" class="input-icon" />
          <input
          v-model="formData.password"
          type="password"
          class="form-input"
          placeholder="••••••••"
          :disabled="isLoading"
          autocomplete="new-password"
        />
        </div>
        <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
      </div>

      <div class="form-group">
        <label class="form-label">Confirmar Contraseña</label>
        <div class="input-shell">
          <ShieldCheck :size="18" class="input-icon" />
          <input
          v-model="formData.confirmPassword"
          type="password"
          class="form-input"
          placeholder="••••••••"
          :disabled="isLoading"
          autocomplete="new-password"
        />
        </div>
        <p v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</p>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">DNI o NIE</label>
          <div class="input-shell">
            <IdCard :size="18" class="input-icon" />
            <input
              v-model="formData.dniNie"
              type="text"
              class="form-input"
              placeholder="12345678Z"
              :disabled="isLoading"
              autocomplete="off"
            />
          </div>
          <p v-if="errors.dniNie" class="form-error">{{ errors.dniNie }}</p>
        </div>

        <div class="form-group">
          <label class="form-label">Fecha de nacimiento</label>
          <div class="input-shell">
            <CalendarDays :size="18" class="input-icon" />
            <input
              v-model="formData.birthDate"
              type="date"
              class="form-input"
              :disabled="isLoading"
              :max="getMinimumBirthDate()"
              autocomplete="bday"
            />
          </div>
          <p v-if="errors.birthDate" class="form-error">{{ errors.birthDate }}</p>
        </div>
      </div>

      <div v-if="errors.general" class="general-error">
        <CircleAlert :size="16" />
        {{ errors.general }}
      </div>

      <button type="submit" class="btn-primary" style="width: 100%; padding: 1rem;" :disabled="isLoading">
        {{ isLoading ? 'Registrando...' : 'Registrarse' }}
      </button>
    </form>

    <p class="auth-footer">
      ¿Ya eres miembro? <router-link to="/login" class="auth-link">Inicia sesión</router-link>
    </p>
  </div>
</template>

<style scoped>
.auth-card {
  width: min(100%, 720px);
  padding: 3rem;
  border-radius: 28px;
  background:
    radial-gradient(circle at top right, rgba(34, 121, 160, 0.14), transparent 30%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(246, 250, 253, 0.96));
  border: 1px solid rgba(34, 121, 160, 0.12);
  box-shadow: 0 24px 70px rgba(14, 36, 49, 0.12);
}

.auth-subtitle {
  margin-bottom: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.input-shell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
  border: 1px solid rgba(34, 121, 160, 0.18);
  border-radius: 14px;
  background-color: rgba(255, 255, 255, 0.9);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-shell:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(34, 121, 160, 0.12);
}

.input-icon {
  color: var(--primary-color);
  flex-shrink: 0;
}

.form-input {
  border: 0;
  background: transparent;
  padding-left: 0;
  box-shadow: none;
}

.form-input:focus {
  box-shadow: none;
}

.general-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background-color: rgba(215, 59, 59, 0.08);
  color: #b42318;
}

@media (max-width: 720px) {
  .auth-card {
    padding: 2rem 1.25rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
