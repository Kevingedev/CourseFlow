<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue';
</script>

<template>
  <main class="auth-page">
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>
    <div class="container auth-container">
      <LoginForm />
    </div>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  position: relative;
  overflow: hidden;
}

.auth-container {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
}

.background-blobs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.blob {
  position: absolute;
  width: 500px;
  height: 500px;
  background: var(--primary-color);
  filter: blur(120px);
  opacity: 0.1;
  border-radius: 50%;
}

.blob-1 {
  top: -100px;
  right: -100px;
}

.blob-2 {
  bottom: -100px;
  left: -100px;
}
</style>
