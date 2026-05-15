<script setup lang="ts">
/**
 * NotFoundView.vue
 * Displayed when the user navigates to a non-existent route.
 */
</script>

<template>
  <div class="not-found-view">
    <h1>404 - Page Not Found</h1>
    <p>Sorry, the page you are looking for does not exist.</p>
    <router-link to="/" class="back-home">Back to Home</router-link>
  </div>
</template>

<style scoped>
.not-found-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.back-home {
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color, #42b883);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: opacity 0.2s;
}

.back-home:hover {
  opacity: 0.9;
}
</style>
