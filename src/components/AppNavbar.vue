<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import logoUrl from '@/assets/logo.svg'

const isMenuOpen = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'home' })
  isMenuOpen.value = false
}
</script>

<template>
  <nav class="navbar glass-card">
    <div class="container navbar-content">
      <router-link to="/" class="logo">
        <img :src="logoUrl" alt="CourseFlow Logo" class="navbar-logo" />
      </router-link>

      <!-- Desktop Links -->
      <div class="nav-links-desktop">
        <router-link to="/about" class="nav-link">About Us</router-link>
        <router-link to="/courses" class="nav-link">Courses</router-link>
        <router-link to="/contact" class="nav-link">Contact</router-link>
        <router-link v-if="authStore.isAdminOrSuadmin" to="/admin/dashboard" class="nav-link admin-link">
          Admin Panel
        </router-link>

        <template v-if="authStore.isAuthenticated">
          <span class="user-greeting">Hola, {{ authStore.user?.fullName }}</span>
          <button class="btn-logout" @click="handleLogout">Log Out</button>
        </template>
        <template v-else>
          <router-link to="/login" class="btn-primary">Log In</router-link>
        </template>
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
        <router-link to="/about" class="mobile-link" @click="isMenuOpen = false">About Us</router-link>
        <router-link to="/courses" class="mobile-link" @click="isMenuOpen = false">Courses</router-link>
        <router-link to="/contact" class="mobile-link" @click="isMenuOpen = false">Contact</router-link>
        <router-link v-if="authStore.isAdminOrSuadmin" to="/admin/dashboard" class="mobile-link admin-link" @click="isMenuOpen = false">
          Admin Panel
        </router-link>

        <div class="mobile-divider"></div>

        <template v-if="authStore.isAuthenticated">
          <div class="mobile-user-greeting">Hola, {{ authStore.user?.fullName }}</div>
          <button class="btn-logout w-full" @click="handleLogout">Log Out</button>
        </template>
        <template v-else>
          <router-link to="/login" class="btn-primary w-full text-center" @click="isMenuOpen = false">Log In</router-link>
        </template>
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

.navbar-logo {
  height: 40px; /* Adjust height as needed */
  width: auto;
  object-fit: contain;
}

.nav-links-desktop {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.admin-link {
  color: var(--primary-color);
  font-weight: 600;
}

.user-greeting {
  font-weight: 500;
  color: var(--text-dark);
  font-size: 0.95rem;
}

.btn-logout {
  background-color: var(--secondary-color-soft);
  color: var(--secondary-color);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 87, 34, 0.2);
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background-color: var(--secondary-color);
  color: var(--white);
  transform: translateY(-1px);
}

.text-center {
  text-align: center;
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

.mobile-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 0.5rem 0;
}

.mobile-user-greeting {
  font-weight: 600;
  color: var(--text-dark);
  font-size: 1rem;
  margin-bottom: 0.25rem;
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
