<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from '@/i18n'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const formData = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
  general: '',
})

const isLoading = ref(false)

const validate = () => {
  let isValid = true
  errors.email = !formData.email ? t('login.emailRequired') : ''
  errors.password = !formData.password ? t('login.passwordRequired') : ''

  if (errors.email || errors.password) {
    isValid = false
  }
  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  isLoading.value = true
  errors.general = ''

  try {
    await authStore.login(formData.email, formData.password)
    router.push('/')
  } catch (error: unknown) {
    errors.general = error instanceof Error ? error.message : t('login.error')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-card">
    <h1 class="auth-title">{{ t('login.title') }}</h1>
    <p class="auth-subtitle">{{ t('login.subtitle') }}</p>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-label">{{ t('login.email') }}</label>
        <input
          v-model="formData.email"
          type="email"
          class="form-input"
          placeholder="email@ejemplo.com"
          :disabled="isLoading"
        />
        <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <label class="form-label">{{ t('login.password') }}</label>
        <input
          v-model="formData.password"
          type="password"
          class="form-input"
          placeholder="••••••••"
          :disabled="isLoading"
        />
        <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
      </div>

      <div style="text-align: right; margin-bottom: 2rem">
        <a class="auth-link" style="font-size: 0.85rem">{{ t('login.forgotPassword') }}</a>
      </div>

      <p v-if="errors.general" class="form-error" style="margin-bottom: 1rem; text-align: center">
        {{ errors.general }}
      </p>

      <button
        type="submit"
        class="btn-primary"
        style="width: 100%; padding: 1rem"
        :disabled="isLoading"
      >
        {{ isLoading ? t('login.loading') : t('login.submit') }}
      </button>
    </form>

    <div style="margin: 2rem 0; height: 1px; background: var(--border-color)"></div>

    <p class="auth-footer">
      {{ t('login.noAccount') }}
      <router-link to="/register" class="auth-link">{{ t('login.createAccount') }}</router-link>
    </p>

    <div class="auth-footer" style="font-size: 0.75rem; margin-top: 3rem">
      {{ t('login.legal') }}
    </div>
  </div>
</template>
