<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'
import BarChart from '@/components/admin/charts/BarChart.vue'
import DoughnutChart from '@/components/admin/charts/DoughnutChart.vue'
import DashboardHeader from '@/components/admin/DashboardHeader.vue'
import MetricCard from '@/components/admin/MetricCard.vue'
import SessionDetails from '@/components/admin/SessionDetails.vue'
import QuickActions from '@/components/admin/QuickActions.vue'

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

onMounted(async () => {
  await dashboardStore.fetchDashboardData()
})
</script>

<template>
  <div class="admin-dashboard-container">
    <!-- Header Summary -->
    <DashboardHeader :fullName="authStore.user?.fullName" />

    <!-- Loading & Error States -->
    <div v-if="dashboardStore.loading" class="loading-container glass-card">
      <div class="spinner"></div>
      <p>Cargando información estadística...</p>
    </div>

    <div v-else-if="dashboardStore.error" class="error-container glass-card">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-60)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      <h3>Error al Cargar Datos</h3>
      <p>{{ dashboardStore.error }}</p>
      <button class="btn-primary" @click="dashboardStore.fetchDashboardData">Reintentar Conexión</button>
    </div>

    <div v-else class="dashboard-content-grid">
      <!-- Metric Cards Panels -->
      <section class="metrics-cards-grid">
        <!-- Metric Card 1: Courses -->
        <MetricCard
          label="Cursos Activos"
          :value="dashboardStore.totalCourses"
          iconClass="courses-icon"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
        </MetricCard>

        <!-- Metric Card 2: Pending Applications -->
        <MetricCard
          label="Solicitudes Pendientes"
          :value="dashboardStore.pendingApplications"
          iconClass="pending-icon"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </MetricCard>

        <!-- Metric Card 3: Admitted Students -->
        <MetricCard
          label="Alumnos Admitidos"
          :value="dashboardStore.admittedStudents"
          iconClass="admitted-icon"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
        </MetricCard>

        <!-- Metric Card 4: Waiting List -->
        <MetricCard
          label="Lista de Espera"
          :value="dashboardStore.waitingListCount"
          iconClass="waiting-icon"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </MetricCard>
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
        <SessionDetails :user="authStore.user" :token="authStore.token" />

        <!-- Quick Access Shortcuts -->
        <QuickActions />
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
  color: var(--secondary-60);
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
}
</style>
