<script setup lang="ts">
import type { AdminUserRecord } from '@/types/adminUsers'

defineProps<{
  adminUsers: AdminUserRecord[]
  currentUserId?: string
  deletingUserId: string | null
  loading: boolean
}>()

const emit = defineEmits<{
  edit: [user: AdminUserRecord]
  remove: [user: AdminUserRecord]
  refresh: []
}>()
</script>

<template>
  <section class="glass-card admin-users-table-card">
    <div class="table-header">
      <div>
        <p class="eyebrow">Directorio</p>
        <h3>Administradores registrados</h3>
      </div>
      <button type="button" class="btn-outline" :disabled="loading" @click="emit('refresh')">
        {{ loading ? 'Actualizando...' : 'Recargar lista' }}
      </button>
    </div>

    <div v-if="loading" class="state-panel">
      <div class="spinner"></div>
      <p>Cargando administradores...</p>
    </div>

    <div v-else-if="adminUsers.length === 0" class="state-panel empty">
      <h4>No hay administradores creados</h4>
      <p>Cuando registres el primero aparecerá aquí con sus acciones de edición y borrado.</p>
    </div>

    <div v-else class="table-shell">
      <table class="users-table">
        <thead>
          <tr>
            <th>Administrador</th>
            <th>Rol</th>
            <th>Estado</th>
            <th class="actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in adminUsers" :key="user.id">
            <td>
              <div class="identity-cell">
                <div class="avatar">{{ user.fullName.charAt(0) }}</div>
                <div>
                  <p class="user-name">{{ user.fullName }}</p>
                  <p class="user-email">{{ user.email }}</p>
                </div>
              </div>
            </td>
            <td>
              <span class="role-pill">Admin</span>
            </td>
            <td>
              <span v-if="user.id === currentUserId" class="status-pill current">Tu sesión</span>
              <span v-else class="status-pill active">Activo</span>
            </td>
            <td class="actions-column">
              <div class="actions-group">
                <button type="button" class="table-action edit" @click="emit('edit', user)">
                  Editar
                </button>
                <button
                  type="button"
                  class="table-action delete"
                  :disabled="deletingUserId === user.id || user.id === currentUserId"
                  @click="emit('remove', user)"
                >
                  {{
                    deletingUserId === user.id
                      ? 'Eliminando...'
                      : user.id === currentUserId
                        ? 'Protegido'
                        : 'Eliminar'
                  }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.admin-users-table-card {
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 100%;
}

.table-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--secondary-color);
  margin-bottom: 0.4rem;
}

.table-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: var(--text-dark);
}

.table-shell {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid rgba(67, 17, 185, 0.08);
  text-align: left;
  vertical-align: middle;
}

.users-table th {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.identity-cell {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-80));
  color: var(--white);
  font-weight: 700;
}

.user-name,
.user-email {
  margin: 0;
}

.user-name {
  font-weight: 700;
  color: var(--text-dark);
}

.user-email {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.role-pill,
.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.role-pill {
  background: rgba(67, 17, 185, 0.1);
  color: var(--primary-color);
}

.status-pill.active {
  background: rgba(10, 71, 73, 0.08);
  color: var(--accent-teal);
}

.status-pill.current {
  background: rgba(236, 86, 41, 0.12);
  color: var(--secondary-90);
}

.actions-column {
  width: 220px;
}

.actions-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.table-action,
.btn-outline {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.table-action {
  padding: 0.65rem 0.9rem;
}

.btn-outline {
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.7);
  color: var(--text-dark);
}

.table-action.edit:hover,
.btn-outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.table-action.delete {
  color: var(--secondary-90);
}

.table-action.delete:hover {
  border-color: var(--secondary-color);
  color: var(--secondary-color);
}

.table-action:disabled,
.btn-outline:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.state-panel {
  min-height: 280px;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 1rem;
  border: 1px dashed rgba(67, 17, 185, 0.18);
  border-radius: 18px;
  padding: 2rem;
}

.state-panel h4,
.state-panel p {
  margin: 0;
}

.state-panel p {
  color: var(--text-muted);
  max-width: 420px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid var(--primary-color-soft);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .admin-users-table-card {
    padding: 1.5rem;
  }

  .table-header {
    flex-direction: column;
  }

  .actions-column {
    width: auto;
  }
}
</style>
