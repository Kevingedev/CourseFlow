<script setup lang="ts">
import type { WaitingListEntry } from '@/types/waitingList'

defineProps<{
  entries: WaitingListEntry[]
  courseNameById: Map<string, string>
}>()

const formatDate = (iso: string): string => {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
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
          <th>Solicitud</th>
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
            <div class="request-cell">
              <p class="request-name">
                {{ entry.user?.name || `Usuario #${entry.user_id}` }}
              </p>
              <p class="request-email">
                {{ entry.user?.email || `ID usuario: ${entry.user_id}` }}
              </p>
            </div>
          </td>
          <td>
            <span class="course-pill">{{
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
}

.waiting-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

.waiting-table th {
  text-align: left;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 1rem 0.75rem;
  color: var(--text-muted);
}

.waiting-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid rgba(67, 17, 185, 0.08);
  text-align: left;
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

.request-cell {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.request-name {
  margin: 0;
  font-weight: 800;
  color: var(--text-dark);
}

.request-email {
  margin: 0;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.9rem;
}

.cell-muted {
  color: var(--text-muted);
  font-weight: 600;
}

.course-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  background: rgba(67, 17, 185, 0.08);
  color: var(--primary-color);
}

</style>
