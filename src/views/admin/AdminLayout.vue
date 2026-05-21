<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logoUrl from '@/assets/logo.svg'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'home' })
  closeSidebar()
}

// Navigation links structure
const navLinks = [
  {
    name: 'Dashboard',
    route: 'admin-dashboard',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`
  },
  {
    name: 'Gestión de Solicitudes',
    route: 'admin-requests',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
  },
  {
    name: 'Gestión de Cursos',
    route: 'admin-courses',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`
  },
  {
    name: 'Gestión de Usuarios',
    route: 'admin-users',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
  },
  {
    name: 'Lista de Espera',
    route: 'admin-waiting-list',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
  }
]

const currentRouteTitle = computed(() => {
  const matchedLink = navLinks.find(link => link.route === route.name)
  return matchedLink ? matchedLink.name : 'Panel Administrativo'
})
</script>

<template>
  <div class="admin-layout">
    <!-- Mobile Header -->
    <header class="mobile-header glass-card">
      <button class="mobile-toggle" @click="toggleSidebar" aria-label="Toggle Menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <div class="logo-container">
        <img :src="logoUrl" alt="CourseFlow" class="admin-logo-mobile" />
      </div>
      <div class="user-avatar-mobile" :title="authStore.user?.fullName">
        {{ authStore.user?.fullName.charAt(0) }}
      </div>
    </header>

    <!-- Sidebar Overlay for mobile -->
    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <!-- Sidebar Navigation -->
    <aside class="admin-sidebar glass-card" :class="{ 'is-open': isSidebarOpen }">
      <div class="sidebar-header">
        <!-- <router-link to="/" class="logo" @click="closeSidebar">
          <img :src="logoUrl" alt="CourseFlow Logo" class="admin-logo" />
        </router-link> -->
      </div>

      <div class="user-profile-section">
        <div class="profile-avatar">
          {{ authStore.user?.fullName.charAt(0) }}
        </div>
        <div class="profile-info">
          <h4 class="profile-name">{{ authStore.user?.fullName }}</h4>
          <span class="profile-role" :class="authStore.user?.role">
            {{ authStore.user?.role === 'suadmin' ? 'Super Admin' : 'Admin' }}
          </span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="link in navLinks"
          :key="link.route"
          :to="{ name: link.route }"
          class="sidebar-link"
          active-class="active"
          @click="closeSidebar"
        >
          <span class="link-icon" v-html="link.icon"></span>
          <span class="link-text">{{ link.name }}</span>
        </router-link>

        <div class="nav-divider"></div>

        <!-- Scenario 2: Ir a ver el sitio (target _blank) -->
        <a href="/" target="_blank" class="sidebar-link external-link">
          <span class="link-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </span>
          <span class="link-text">Ir a ver el sitio</span>
          <span class="external-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-button" @click="handleLogout">
          <span class="link-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
          <span class="link-text">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Workspace -->
    <div class="admin-workspace">
      <header class="workspace-header glass-card">
        <div class="workspace-title-section">
          <h2>{{ currentRouteTitle }}</h2>
        </div>
        <div class="workspace-user-section">
          <span class="user-welcome">Sesión de: <strong>{{ authStore.user?.fullName }}</strong></span>
          <span class="workspace-role-badge" :class="authStore.user?.role">
            {{ authStore.user?.role === 'suadmin' ? 'Super Admin' : 'Admin' }}
          </span>
        </div>
      </header>

      <main class="workspace-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
  position: relative;
}

/* Mobile Header */
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 90;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  border-radius: 0;
  border-bottom: 1px solid var(--border-color);
}

.mobile-toggle {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 0.5rem;
}

.admin-logo-mobile {
  height: 52px;
  width: auto;
}

.user-avatar-mobile {
  width: 32px;
  height: 32px;
  background-color: var(--primary-color);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* Sidebar Styling */
.admin-sidebar {
  width: 280px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  border-radius: 0;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  transition: transform 0.3s ease;
}

.sidebar-header {
  margin-bottom: 2rem;
}

.admin-logo {
  height: 52px;
  width: auto;
  object-fit: contain;
}

.user-profile-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(84, 24, 193, 0.03);
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid rgba(84, 24, 193, 0.05);
}

.profile-avatar {
  width: 44px;
  height: 44px;
  background-color: var(--primary-color);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(84, 24, 193, 0.25);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  overflow: hidden;
}

.profile-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-role {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  width: max-content;
}

.profile-role.suadmin {
  background-color: var(--primary-20);
  color: var(--primary-80);
}

.profile-role.admin {
  background-color: #e6f7ff;
  color: #1890ff;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  overflow-y: auto;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.sidebar-link:hover {
  background-color: rgba(84, 24, 193, 0.05);
  color: var(--primary-color);
}

.sidebar-link.active {
  background-color: var(--primary-color);
  color: var(--white);
  box-shadow: 0 4px 12px rgba(84, 24, 193, 0.2);
}

.link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.sidebar-link:hover .link-icon {
  transform: translateX(2px);
}

.nav-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 1rem 0;
}

.external-link {
  color: var(--primary-color-50);
  background-color: var(--secondary-color-soft);
  border: 1px solid rgba(255, 87, 34, 0.1);
}

.external-link:hover {
  background-color: var(--primary-color);
  color: var(--white);
}

.external-badge {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.sidebar-footer {
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.logout-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  background-color: transparent;
  border: 1px solid transparent;
  color: #d32f2f;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.logout-button:hover {
  background-color: #ffe6e6;
  border-color: rgba(211, 47, 47, 0.1);
}

/* Workspace Main Layout */
.admin-workspace {
  flex: 1;
  margin-left: 280px;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: 100vh;
  box-sizing: border-box;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.workspace-title-section h2 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--text-dark);
  margin: 0;
}

.workspace-user-section {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.user-welcome {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.workspace-role-badge {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
}

.workspace-role-badge.suadmin {
  background-color: var(--primary-20);
  color: var(--primary-80);
}

.workspace-role-badge.admin {
  background-color: #e6f7ff;
  color: #1890ff;
}

.workspace-content {
  flex: 1;
}

/* Overlay for Mobile sidebar */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 95;
  backdrop-filter: blur(2px);
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }

  .admin-sidebar.is-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
  }

  .mobile-header {
    display: flex;
  }

  .admin-workspace {
    margin-left: 0;
    padding: 80px 1.5rem 2rem;
  }

  .workspace-header {
    display: none; /* Mobile header is at top */
  }
}
</style>
