<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'
import BarChart from '@/components/admin/charts/BarChart.vue'
import DoughnutChart from '@/components/admin/charts/DoughnutChart.vue'

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

onMounted(async () => {
  await dashboardStore.fetchDashboardData()
})
</script>

<template>
  <div class="admin-dashboard-container">
    <!-- Header Summary -->
    <div class="dashboard-welcome">
      <span class="badge">Vista General</span>
      <h1>Hola, {{ authStore.user?.fullName }}</h1>
      <p class="subtitle">Aquí tienes un resumen del estado actual de tu plataforma educativa.</p>
    </div>

    <!-- Loading & Error States -->
    <div v-if="dashboardStore.loading" class="loading-container glass-card">
      <div class="spinner"></div>
      <p>Cargando información estadística...</p>
    </div>

    <div v-else-if="dashboardStore.error" class="error-container glass-card">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      <h3>Error al Cargar Datos</h3>
      <p>{{ dashboardStore.error }}</p>
      <button class="btn-primary" @click="dashboardStore.fetchDashboardData">Reintentar Conexión</button>
    </div>

    <div v-else class="dashboard-content-grid">
      <!-- Metric Cards Panels -->
      <section class="metrics-cards-grid">
        <!-- Metric Card 1: Courses -->
        <div class="metric-card glass-card">
          <div class="card-icon courses-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          </div>
          <div class="card-data">
            <span class="card-label">Cursos Activos</span>
            <span class="card-value">{{ dashboardStore.totalCourses }}</span>
          </div>
        </div>

        <!-- Metric Card 2: Pending Applications -->
        <div class="metric-card glass-card">
          <div class="card-icon pending-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div class="card-data">
            <span class="card-label">Solicitudes Pendientes</span>
            <span class="card-value">{{ dashboardStore.pendingApplications }}</span>
          </div>
        </div>

        <!-- Metric Card 3: Admitted Students -->
        <div class="metric-card glass-card">
          <div class="card-icon admitted-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
          </div>
          <div class="card-data">
            <span class="card-label">Alumnos Admitidos</span>
            <span class="card-value">{{ dashboardStore.admittedStudents }}</span>
          </div>
        </div>

        <!-- Metric Card 4: Waiting List -->
        <div class="metric-card glass-card">
          <div class="card-icon waiting-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="card-data">
            <span class="card-label">Lista de Espera</span>
            <span class="card-value">{{ dashboardStore.waitingListCount }}</span>
          </div>
        </div>
      </section>

      <!-- Charts Section -->
      <section class="charts-grid-section">
        <!-- Chart 1: Course Enrollment -->
        <div class="chart-card glass-card">
          <div class="chart-card-header">
            <h3>Distribución de Cupo por Curso</h3>
            <p class="chart-subtitle">Inscripciones admitidas vs capacidad total de cada programa.</p>
          </div>
          <div class="chart-container-inner">
            <BarChart :chartData="dashboardStore.studentsPerCourseData" />
          </div>
        </div>

        <!-- Chart 2: Request Status -->
        <div class="chart-card glass-card">
          <div class="chart-card-header">
            <h3>Proporción de Solicitudes</h3>
            <p class="chart-subtitle">Estados de procesamiento de las postulaciones registradas.</p>
          </div>
          <div class="chart-container-inner">
            <DoughnutChart :chartData="dashboardStore.applicationsStatusData" />
          </div>
        </div>
      </section>

      <!-- Lower Information Section -->
      <section class="lower-info-grid">
        <!-- Session details -->
        <div class="glass-card details-card">
          <h3>Información de Sesión</h3>
          <p class="card-desc">Parámetros técnicos de tu token y perfil administrativo.</p>
          <div class="details-list">
            <div class="details-item">
              <span class="details-label">Nombre Completo:</span>
              <span class="details-value">{{ authStore.user?.fullName }}</span>
            </div>
            <div class="details-item">
              <span class="details-label">Correo Electrónico:</span>
              <span class="details-value">{{ authStore.user?.email }}</span>
            </div>
            <div class="details-item">
              <span class="details-label">Rol:</span>
              <span class="details-value role-badge" :class="authStore.user?.role">
                {{ authStore.user?.role === 'suadmin' ? 'Super Admin' : 'Admin' }}
              </span>
            </div>
            <div class="details-item">
              <span class="details-label">Token de Acceso:</span>
              <span class="details-value token-text" :title="authStore.token || ''">
                {{ authStore.token }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Access Shortcuts -->
        <div class="glass-card details-card">
          <h3>Accesos Rápidos</h3>
          <p class="card-desc">Atajos de navegación rápida a la gestión administrativa.</p>
          <div class="shortcuts-grid">
            <router-link to="/admin/requests" class="shortcut-btn">
              <span class="shortcut-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg></span>
              <span>Solicitudes</span>
            </router-link>

            <router-link to="/admin/courses" class="shortcut-btn">
              <span class="shortcut-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg></span>
              <span>Cursos</span>
            </router-link>

            <router-link to="/admin/users" class="shortcut-btn">
              <span class="shortcut-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg></span>
              <span>Usuarios</span>
            </router-link>

            <router-link to="/admin/waiting-list" class="shortcut-btn">
              <span class="shortcut-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></span>
              <span>Espera</span>
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.dashboard-welcome {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge {
  background-color: var(--primary-color-soft);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
  width: max-content;
}

h1 {
  font-family: var(--font-display);
  font-size: 2.2rem;
  color: var(--text-dark);
  margin: 0;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1rem;
  margin: 0;
}

.dashboard-content-grid {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* Loading & Error States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
  gap: 1.5rem;
  border: 1px solid var(--border-color);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--primary-color-soft);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container h3 {
  color: #F44336;
  margin: 0;
}

.error-container p {
  color: var(--text-muted);
  margin: 0;
  max-width: 400px;
}

/* Metric Cards Layout */
.metrics-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

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
  box-shadow: 0 10px 20px rgba(84, 24, 193, 0.08);
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
  background-color: rgba(84, 24, 193, 0.08);
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

/* Charts Layout */
.charts-grid-section {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 1.5rem;
}

.chart-card {
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: var(--white);
}

.chart-card-header h3 {
  margin: 0 0 0.25rem 0;
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--text-dark);
}

.chart-subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.chart-container-inner {
  height: 350px;
  position: relative;
}

/* Lower Info Layout */
.lower-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.details-card {
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.details-card h3 {
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
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Shortcuts buttons */
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
  box-shadow: 0 4px 12px rgba(84, 24, 193, 0.05);
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

/* Responsive adjustments */
@media (max-width: 1200px) {
  .metrics-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .charts-grid-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .lower-info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .metrics-cards-grid {
    grid-template-columns: 1fr;
  }
  
  .shortcuts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
