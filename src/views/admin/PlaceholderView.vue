<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const title = (route.meta.title as string) || 'Módulo Administrativo'
</script>

<template>
  <div class="placeholder-container container section-padding">
    <div class="card glass-card">
      <h2>{{ title }}</h2>
      <p class="description">
        Esta sección se encuentra en preparación para desarrollo y se implementará en la siguiente historia de usuario.
      </p>
      <router-link to="/admin/dashboard" class="btn-primary back-btn">
        Volver al Dashboard
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.placeholder-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.card {
  padding: 3rem;
  border-radius: 16px;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.description {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.back-btn {
  display: inline-block;
}
</style>
