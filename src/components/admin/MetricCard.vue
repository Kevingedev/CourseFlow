<script setup lang="ts">
defineProps<{
  label: string
  value: number | string
  iconClass: string
}>()
</script>

<template>
  <div class="metric-card glass-card">
    <div class="card-icon" :class="iconClass">
      <slot></slot>
    </div>
    <div class="card-data">
      <span class="card-label">{{ label }}</span>
      <span class="card-value">{{ value }}</span>
    </div>
  </div>
</template>

<style scoped>
.metric-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(67, 17, 185, 0.08);
  border-color: var(--primary-color);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 10px;
}

.courses-icon {
  background-color: var(--primary-color-soft);
  color: var(--primary-color);
}

.pending-icon {
  background-color: rgba(255, 193, 7, 0.08);
  color: #FFC107;
}

.admitted-icon {
  background-color: rgba(76, 175, 80, 0.08);
  color: #4CAF50;
}

.waiting-icon {
  background-color: rgba(33, 150, 243, 0.08);
  color: #2196F3;
}

.card-data {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.card-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
}

.card-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-dark);
  line-height: 1;
}
</style>
