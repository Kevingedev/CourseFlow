<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  general: ''
});

const isLoading = ref(false);

const validate = () => {
  let isValid = true;
  errors.fullName = !formData.fullName ? 'Full name is required' : '';
  errors.email = !formData.email ? 'Email is required' : !/^\S+@\S+\.\S+$/.test(formData.email) ? 'Invalid email' : '';
  errors.password = !formData.password ? 'Password is required' : formData.password.length < 6 ? 'Min 6 characters' : '';
  errors.confirmPassword = formData.password !== formData.confirmPassword ? 'Passwords do not match' : '';

  if (errors.fullName || errors.email || errors.password || errors.confirmPassword) {
    isValid = false;
  }
  return isValid;
};

const handleSubmit = async () => {
  if (!validate()) return;

  isLoading.value = true;
  errors.general = '';

  try {
    await authStore.register({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password
    });
    router.push('/');
  } catch (error: unknown) {
    errors.general = error instanceof Error ? error.message : 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="auth-card">

    <h1 class="auth-title">Crea tu cuenta</h1>
    <p class="auth-subtitle">Únete a la plataforma de formación más inclusiva</p>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-label">Nombre Completo</label>
        <input 
          v-model="formData.fullName"
          type="text" 
          class="form-input" 
          placeholder="Tu nombre"
          :disabled="isLoading"
        />
        <p v-if="errors.fullName" class="form-error">{{ errors.fullName }}</p>
      </div>

      <div class="form-group">
        <label class="form-label">Correo Electrónico</label>
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
        <label class="form-label">Contraseña</label>
        <input 
          v-model="formData.password"
          type="password" 
          class="form-input" 
          placeholder="••••••••"
          :disabled="isLoading"
        />
        <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
      </div>

      <div class="form-group">
        <label class="form-label">Confirmar Contraseña</label>
        <input 
          v-model="formData.confirmPassword"
          type="password" 
          class="form-input" 
          placeholder="••••••••"
          :disabled="isLoading"
        />
        <p v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</p>
      </div>

      <p v-if="errors.general" class="form-error" style="margin-bottom: 1rem; text-align: center;">
        {{ errors.general }}
      </p>

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
/* Scoped styles if needed, but mostly using global main.css classes */
</style>
