<script setup lang="ts">
defineProps<{
  fullName?: string
}>()
</script>

<template>
  <div class="dashboard-welcome">
    <span class="badge">Vista General</span>
    <h1>Hola, {{ fullName || 'Usuario' }}</h1>
    <p class="subtitle">Aquí tienes un resumen del estado actual de tu plataforma educativa.</p>
  </div>
</template>

<style scoped>
.dashboard-welcome {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge {
  background-color: var(--primary-color-soft);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
  width: max-content;
}

h1 {
  font-family: var(--font-display);
  font-size: 2.2rem;
  color: var(--text-dark);
  margin: 0;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1rem;
  margin: 0;
}
</style>
