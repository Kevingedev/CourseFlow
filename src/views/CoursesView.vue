<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { Monitor, ChartBar, Settings } from '@lucide/vue'
import { useI18n } from '@/i18n'

interface Course {
  id: number
  name: string
  description: string
  instructor?: string
  duration?: string
  start_date?: string
  end_date?: string
  category?: string
  capacity?: number
  is_active?: boolean
}

const courses = ref<Course[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showAll = ref(false)
const { t } = useI18n()

const displayedCourses = computed(() => {
  if (showAll.value) return courses.value
  return courses.value.slice(0, 6)
})

const router = useRouter()

function goToCourse(id?: number) {
  if (!id) return
  router.push(`/courses/${id}`)
}

function formatDuration(start?: string, end?: string) {
  if (!start || !end) return t('courses.duration.tbd')
  const s = new Date(start)
  const e = new Date(end)
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e <= s) return t('courses.duration.tbd')
  const diffMs = e.getTime() - s.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays >= 30) {
    const months = Math.round(diffDays / 30)
    return `${months} ${months === 1 ? t('courses.duration.month') : t('courses.duration.months')}`
  }
  if (diffDays >= 7) {
    const weeks = Math.round(diffDays / 7)
    return `${weeks} ${weeks === 1 ? t('courses.duration.week') : t('courses.duration.weeks')}`
  }
  return `${diffDays} ${diffDays === 1 ? t('courses.duration.day') : t('courses.duration.days')}`
}

async function loadCourses() {
  loading.value = true
  error.value = null
  try {
    const res = await api.get('/api/v1/courses/')
    courses.value = res.data
  } catch (err: unknown) {
    const apiError = err as {
      response?: { status?: number; data?: { detail?: string } }
      message?: string
    }

    if (apiError.response?.status === 401) {
      error.value = t('courses.authRequired')
    } else {
      error.value = apiError.response?.data?.detail || apiError.message || t('courses.loadError')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCourses()
})
</script>

<template>
  <div class="courses-view">
    <!-- Courses Hero -->
    <section class="courses-hero section-padding">
      <div class="container text-center">
        <h1 class="hero-title">
          {{ t('courses.hero.titlePrefix') }}
          <span class="text-accent">{{ t('courses.hero.titleAccent') }}</span>
        </h1>
        <p class="hero-subtitle mx-auto">
          {{ t('courses.hero.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Categories -->
    <section class="categories section-padding bg-soft">
      <div class="container">
        <h2 class="section-title text-center">{{ t('courses.categories.title') }}</h2>
        <div class="categories-grid">
          <div class="category-card glass-card">
            <div class="category-icon"><Monitor :size="40" /></div>
            <h3>{{ t('courses.categories.web.title') }}</h3>
            <p>
              {{ t('courses.categories.web.text') }}
            </p>
          </div>
          <div class="category-card glass-card">
            <div class="category-icon"><ChartBar :size="40" /></div>
            <h3>{{ t('courses.categories.data.title') }}</h3>
            <p>
              {{ t('courses.categories.data.text') }}
            </p>
          </div>
          <div class="category-card glass-card">
            <div class="category-icon"><Settings :size="40" /></div>
            <h3>{{ t('courses.categories.systems.title') }}</h3>
            <p>
              {{ t('courses.categories.systems.text') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Courses Grid -->
    <section class="upcoming-courses section-padding">
      <div class="container">
        <h2 class="section-title text-center">{{ t('courses.catalog.title') }}</h2>

        <div v-if="loading" class="text-center">
          {{ t('courses.loading') }}
        </div>

        <div v-else-if="error" class="text-center">
          <p style="color: var(--error-color)">{{ t('courses.error', { message: error }) }}</p>
        </div>

        <div v-else>
          <div class="courses-grid">
            <div v-if="courses.length === 0" class="text-center">{{ t('courses.empty') }}</div>

            <div v-for="course in displayedCourses" :key="course.id" class="course-card glass-card">
              <div class="course-image-placeholder">
                <span>{{ course.category || t('courses.fallbackCategory') }}</span>
              </div>
              <div class="course-content">
                <span class="course-tag">{{
                  course.is_active ? t('courses.status.open') : t('courses.status.closed')
                }}</span>
                <h3>{{ course.name }}</h3>
                <p>{{ course.description }}</p>
                <p class="course-meta">
                  {{ t('courses.duration') }}:
                  <strong>{{ formatDuration(course.start_date, course.end_date) }}</strong>
                </p>
                <div class="course-footer">
                  <span class="course-price"
                    >{{ t('courses.capacity') }}: {{ course.capacity ?? '–' }}</span
                  >
                  <button
                    class="btn-primary-small"
                    :disabled="!course.is_active"
                    @click="goToCourse(course.id)"
                  >
                    {{ t('courses.apply') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="courses.length > 6" class="text-center" style="margin-top: 1.5rem">
            <button class="btn-primary" @click="showAll = !showAll">
              {{ showAll ? t('courses.showLess') : t('courses.showMore') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Coming Soon Banner -->
    <section class="coming-soon section-padding bg-soft">
      <div class="container text-center max-w-md">
        <div class="provisional-banner glass-card">
          <h2 class="section-title">{{ t('courses.comingSoon.title') }}</h2>
          <p>
            {{ t('courses.comingSoon.text') }}
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
