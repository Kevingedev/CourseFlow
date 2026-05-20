<script setup lang="ts">
import type { User } from '@/types/auth'

defineProps<{
  user: User | null
  token: string | null
}>()
</script>

<template>
  <div class="glass-card details-card">
    <h3>Información de Sesión</h3>
    <p class="card-desc">Parámetros técnicos de tu token y perfil administrativo.</p>
    <div class="details-list">
      <div class="details-item">
        <span class="details-label">Nombre Completo:</span>
        <span class="details-value">{{ user?.fullName }}</span>
      </div>
      <div class="details-item">
        <span class="details-label">Correo Electrónico:</span>
        <span class="details-value">{{ user?.email }}</span>
      </div>
      <div class="details-item">
        <span class="details-label">Rol:</span>
        <span class="details-value role-badge" :class="user?.role">
          {{ user?.role === 'suadmin' ? 'Super Admin' : 'Admin' }}
        </span>
      </div>
      <div class="details-item">
        <span class="details-label">Token de Acceso:</span>
        <span class="details-value token-text" :title="token || ''">
          {{ token }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-card {
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

h3 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--text-dark);
  margin: 0 0 0.25rem 0;
}

.card-desc {
  margin: 0 0 1.5rem 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.details-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.details-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.details-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-dark);
}

.details-value {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.role-badge {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.role-badge.suadmin {
  background-color: var(--primary-20);
  color: var(--primary-80);
}

.role-badge.admin {
  background-color: #e6f7ff;
  color: #1890ff;
}

.token-text {
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.04);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
