<script setup lang="ts">
import type { WaitingListEntry } from '@/types/waitingList'

defineProps<{
  entries: WaitingListEntry[]
  courseNameById: Map<string, string>
}>()

const formatDate = (iso: string): string => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="table-shell">
    <table class="waiting-table">
      <thead>
        <tr>
          <th>Posición</th>
          <th>Usuario</th>
          <th>Curso</th>
          <th>Registro</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="String(entry.id)">
          <td>
            <span class="pill">{{ entry.position }}</span>
          </td>
          <td>
            <div class="cell-main">
              <strong>{{ entry.user?.name || `Usuario #${entry.user_id}` }}</strong>
            </div>
          </td>
          <td>
            <span class="cell-muted">{{
              courseNameById.get(String(entry.course_id)) ||
              entry.course?.name ||
              `Curso #${entry.course_id}`
            }}</span>
          </td>
          <td>
            <span class="cell-muted">{{ formatDate(entry.created_at) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-shell {
  overflow-x: auto;
  padding-top: 1rem;
}

.waiting-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

.waiting-table th {
  text-align: left;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.9rem 0.75rem;
  color: var(--text-muted);
}

.waiting-table td {
  padding: 0.95rem 0.75rem;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  vertical-align: middle;
}

.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-weight: 800;
  color: var(--primary-color);
  background: rgba(67, 17, 185, 0.1);
  border: 1px solid rgba(67, 17, 185, 0.18);
}

.cell-main {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.cell-main strong {
  color: var(--text-dark);
}

.cell-muted {
  color: var(--text-muted);
  font-weight: 600;
}
</style>
