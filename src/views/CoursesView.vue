<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { Monitor, ChartBar, Settings } from '@lucide/vue';

interface Course {
  id: number;
  name: string;
  description: string;
  instructor?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  category?: string;
  capacity?: number;
  is_active?: boolean;
}

const courses = ref<Course[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const showAll = ref(false);

const displayedCourses = computed(() => {
  if (showAll.value) return courses.value;
  return courses.value.slice(0, 6);
});

const router = useRouter();

function goToCourse(id?: number) {
  if (!id) return;
  router.push(`/courses/${id}`);
}

function formatDuration(start?: string, end?: string) {
  if (!start || !end) return 'TBD';
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e <= s) return 'TBD';
  const diffMs = e.getTime() - s.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays >= 30) {
    const months = Math.round(diffDays / 30);
    return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  }
  if (diffDays >= 7) {
    const weeks = Math.round(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  }
  return `${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
}

async function loadCourses() {
  loading.value = true;
  error.value = null;
  try {
    const res = await api.get('/courses');
    courses.value = res.data;
  } catch (err: unknown) {
    error.value = (err as { response?: { data?: string }; message?: string }).response?.data || (err as { message?: string }).message || 'Error cargando cursos';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadCourses();
});
</script>

<template>
  <div class="courses-view">
    <!-- Courses Hero -->
    <section class="courses-hero section-padding">
      <div class="container text-center">
        <h1 class="hero-title">Nuestros itinerarios <span class="text-accent">formativos</span></h1>
        <p class="hero-subtitle mx-auto">
          Descubre y aprende con nuestros programas gratuitos diseñados para impulsar tu carrera en
          tecnología.
        </p>
      </div>
    </section>

    <!-- Categories -->
    <section class="categories section-padding bg-soft">
      <div class="container">
        <h2 class="section-title text-center">Explora por especialidad</h2>
        <div class="categories-grid">
          <div class="category-card glass-card">
            <div class="category-icon"><Monitor :size="40" /></div>
            <h3>Desarrollo Web y Apps</h3>
            <p>
              Adquiere las competencias técnicas en front-end y back-end más demandadas del sector
              digital.
            </p>
          </div>
          <div class="category-card glass-card">
            <div class="category-icon"><ChartBar :size="40" /></div>
            <h3>Datos e Inteligencia Artificial</h3>
            <p>
              Domina el análisis de datos y aprende a aplicar soluciones de inteligencia artificial
              en proyectos reales.
            </p>
          </div>
          <div class="category-card glass-card">
            <div class="category-icon"><Settings :size="40" /></div>
            <h3>Soporte y Sistemas</h3>
            <p>
              Especialízate en infraestructuras de red, sistemas cloud y soporte informático
              profesional.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Courses Grid -->
    <section class="upcoming-courses section-padding">
      <div class="container">
        <h2 class="section-title text-center">Catálogo de Cursos</h2>

        <div v-if="loading" class="text-center">
          Cargando cursos...
        </div>

        <div v-else-if="error" class="text-center">
          <p style="color: var(--error-color)">Error: {{ error }}</p>
        </div>

        <div v-else>
          <div class="courses-grid">
            <div v-if="courses.length === 0" class="text-center">No hay cursos disponibles.</div>

            <div v-for="course in displayedCourses" :key="course.id" class="course-card glass-card">
              <div class="course-image-placeholder">
                <span>{{ course.category || 'Course' }}</span>
              </div>
              <div class="course-content">
                <span class="course-tag">{{ course.is_active ? 'Open' : 'Closed' }}</span>
                <h3>{{ course.name }}</h3>
                <p>{{ course.description }}</p>
                <p class="course-meta">Duración: <strong>{{ formatDuration(course.start_date, course.end_date) }}</strong></p>
                <div class="course-footer">
                  <span class="course-price">Capacidad: {{ course.capacity ?? '–' }}</span>
                  <button class="btn-primary-small" :disabled="!course.is_active" @click="goToCourse(course.id)">¡Inscríbete ya!</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="courses.length > 6" class="text-center" style="margin-top: 1.5rem">
            <button class="btn-primary" @click="showAll = !showAll">{{ showAll ? 'Mostrar menos' : 'Ver más' }}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Coming Soon Banner -->
    <section class="coming-soon section-padding bg-soft">
      <div class="container text-center max-w-md">
        <div class="provisional-banner glass-card">
          <h2 class="section-title">Catálogo completo en desarrollo</h2>
          <p>
            Estamos preparando un catálogo interactivo de cursos. Muy pronto podrás buscar, filtrar
            e inscribirte directamente en nuestras formaciones de calidad.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.courses-view {
  display: flex;
  flex-direction: column;
}

.text-center {
  text-align: center;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.text-accent {
  color: var(--primary-color);
}

.bg-soft {
  background-color: var(--primary-color-soft);
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-muted);
  max-width: 600px;
}

.section-title {
  font-size: 2.25rem;
  margin-bottom: 2.5rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.category-card {
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
}

.course-card {
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.course-card:hover {
  transform: translateY(-8px);
}


/* Make grid items stretch so cards have equal height */
.courses-grid {
  align-items: stretch;
}

.course-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.course-image-placeholder {
  width: 100%;
  height: 160px;
  background-color: var(--primary-color-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.25rem;
}

.course-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.course-tag {
  display: inline-block;
  background-color: var(--secondary-color-soft);
  color: var(--secondary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.course-content h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.course-content p {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.course-price {
  font-weight: 700;
  color: var(--primary-color);
}

.btn-primary-small {
  background-color: var(--primary-color);
  color: var(--white);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.provisional-banner {
  padding: 3rem;
  border-radius: 24px;
}

.max-w-md {
  max-width: 800px;
  margin: 0 auto;
}
</style>
