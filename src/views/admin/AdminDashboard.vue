<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="admin-dashboard container section-padding">
    <div class="header">
      <div>
        <span class="badge">Panel Administrativo</span>
        <h1>Bienvenido, {{ authStore.user?.fullName }}</h1>
      </div>
    </div>

    <div class="grid-2">
      <!-- Session Card -->
      <div class="glass-card info-card">
        <h3>Información de la Sesión Activa</h3>
        <p class="desc">Datos del administrador autenticado mediante token de acceso.</p>

        <div class="info-list">
          <div class="info-item">
            <span class="label">Nombre completo:</span>
            <span class="value">{{ authStore.user?.fullName }}</span>
          </div>
          <div class="info-item">
            <span class="label">Correo electrónico:</span>
            <span class="value">{{ authStore.user?.email }}</span>
          </div>
          <div class="info-item">
            <span class="label">Rol asignado:</span>
            <span class="value role-badge" :class="authStore.user?.role">
              {{ authStore.user?.role === 'suadmin' ? 'Super Admin' : 'Admin' }}
            </span>
          </div>
          <div class="info-item">
            <span class="label">Token de acceso:</span>
            <span class="value token-text" :title="authStore.token || ''">
              {{ authStore.token }}
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Actions Card -->
      <div class="glass-card info-card">
        <h3>Accesos Directos del Panel</h3>
        <p class="desc">Accesos rápidos para la gestión del sitio.</p>

        <div class="actions-grid">
          <router-link to="/admin/requests" class="action-btn">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </span>
            <span class="btn-text">Gestión de Solicitudes</span>
          </router-link>

          <router-link to="/admin/courses" class="action-btn">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            </span>
            <span class="btn-text">Gestión de Cursos</span>
          </router-link>

          <router-link to="/admin/waiting-list" class="action-btn">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </span>
            <span class="btn-text">Lista de Espera</span>
          </router-link>

          <router-link to="/admin/users" class="action-btn">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </span>
            <span class="btn-text">Gestión de Usuarios</span>
          </router-link>

          <router-link to="/" class="action-btn span-2">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-icon"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </span>
            <span class="btn-text">Ir a ver el sitio (Público)</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.badge {
  background-color: var(--primary-color-soft);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

h1 {
  font-size: 2.5rem;
  color: var(--text-dark);
}


.info-card {
  padding: 2.5rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.info-card h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.desc {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.label {
  font-weight: 600;
  color: var(--text-dark);
}

.value {
  color: var(--text-muted);
}

.role-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.suadmin {
  background-color: #ffe6e6;
  color: #d32f2f;
}

.role-badge.admin {
  background-color: #e6f7ff;
  color: #1890ff;
}

.token-text {
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.04);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  flex: 1;
}

@media (max-width: 576px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

.action-btn {
  background-color: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: var(--primary-color);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(84, 24, 193, 0.08);
}

.action-btn.span-2 {
  grid-column: span 2;
  flex-direction: row;
  gap: 1rem;
  padding: 1.2rem;
}

@media (max-width: 576px) {
  .action-btn.span-2 {
    grid-column: span 1;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.5rem;
  }
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  background-color: var(--primary-color-soft);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover .icon {
  background-color: var(--primary-color);
  color: var(--white);
  transform: scale(1.05);
}

.feather-icon {
  width: 20px;
  height: 20px;
}

.btn-text {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-dark);
}
</style>
