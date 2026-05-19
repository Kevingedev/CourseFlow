<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="navbar glass-card">
    <div class="container navbar-content">
      <router-link to="/" class="logo">
        <div class="logo-icon">F5</div>
        <span class="logo-text">CourseFlow</span>
      </router-link>

      <!-- Desktop Links -->
      <div class="nav-links-desktop">
        <router-link to="/about" class="nav-link">Conócenos</router-link>
        <router-link to="/courses" class="nav-link">Formaciones</router-link>
        <router-link to="/contact" class="nav-link">Contacto</router-link>
        <button class="btn-primary">Iniciar sesión</button>
      </div>

      <!-- Mobile Toggle -->
      <button class="mobile-toggle" @click="toggleMenu">
        <svg
          v-if="!isMenuOpen"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg
          v-else
          width="24"
          height="24"
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
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="slide">
      <div v-if="isMenuOpen" class="mobile-menu">
        <router-link to="/about" class="mobile-link" @click="isMenuOpen = false"
          >Conócenos</router-link
        >
        <router-link to="/courses" class="mobile-link" @click="isMenuOpen = false"
          >Formaciones</router-link
        >
        <router-link to="/contact" class="mobile-link" @click="isMenuOpen = false"
          >Contacto</router-link
        >
        <button class="btn-primary w-full">Iniciar sesión</button>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background-color: var(--primary-color);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1.25rem;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  letter-spacing: -0.02em;
}

.nav-links-desktop {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

@media (max-width: 768px) {
  .nav-links-desktop {
    display: none;
  }
}

.mobile-toggle {
  display: none;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .mobile-toggle {
    display: block;
  }
}

.mobile-menu {
  position: absolute;
  top: var(--navbar-height);
  left: 0;
  width: 100%;
  background-color: var(--white);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid var(--border-color);
}

.mobile-link {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-dark);
}

.w-full {
  width: 100%;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
