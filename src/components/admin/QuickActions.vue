<script setup lang="ts">
// No logic required, just standard Vue router link layout
</script>

<template>
  <div class="glass-card details-card">
    <h3>Accesos Rápidos</h3>
    <p class="card-desc">Atajos de navegación rápida a la gestión administrativa.</p>
    <div class="shortcuts-grid">
      <router-link to="/admin/requests" class="shortcut-btn">
        <span class="shortcut-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        </span>
        <span>Solicitudes</span>
      </router-link>

      <router-link to="/admin/courses" class="shortcut-btn">
        <span class="shortcut-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </span>
        <span>Cursos</span>
      </router-link>

      <router-link to="/admin/users" class="shortcut-btn">
        <span class="shortcut-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg>
        </span>
        <span>Usuarios</span>
      </router-link>

      <router-link to="/admin/waiting-list" class="shortcut-btn">
        <span class="shortcut-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </span>
        <span>Espera</span>
      </router-link>
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

.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.shortcut-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-dark);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.shortcut-btn:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 17, 185, 0.05);
  color: var(--primary-color);
}

.shortcut-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--primary-color-soft);
  color: var(--primary-color);
  border-radius: 6px;
}
</style>
