<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import { Lock, PartyPopper, Ban, Calendar, OctagonX, TriangleAlert } from '@lucide/vue';
import { useI18n } from '@/i18n'

interface Course {
  id: number;
  name: string;
  description?: string;
  summary?: string;
  banner?: string;
  delivery?: string;
  technologies?: string[];
  syllabus?: string[];
  prerequisites?: string;
  learning_outcomes?: string[];
  instructor?: string;
  start_date?: string;
  end_date?: string;
  category?: string;
  capacity?: number;
  is_active?: boolean;
}

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const authStore = useAuthStore();
const { t } = useI18n()

const course = ref<Course | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const checkingEnrollment = ref(false);
const isEnrolled = ref(false);
const acceptedCount = ref(0);
const totalApplicationsCount = ref(0);
const isCourseFull = ref(false);
const isBlockedByCapacity = ref(false);

const submitError = ref<string | null>(null);
const submitting = ref(false);

const getRequestErrorMessage = (err: unknown, fallback: string): string => {
  if (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof err.response === 'object' &&
    err.response !== null &&
    'data' in err.response
  ) {
    const data = err.response.data

    if (typeof data === 'string') {
      return data
    }

    if (data && typeof data === 'object' && 'detail' in data && typeof data.detail === 'string') {
      return data.detail
    }
  }

  if (err instanceof Error && err.message) {
    return err.message
  }

  return fallback
}

function formatDuration(start?: string, end?: string) {
  if (!start || !end) return t('courses.duration.tbd');
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e <= s) return t('courses.duration.tbd');
  const diffMs = e.getTime() - s.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays >= 365) {
    const years = Math.round(diffDays / 365);
    return `${years} ${years === 1 ? t('courses.duration.year') : t('courses.duration.years')}`;
  }
  if (diffDays >= 30) {
    const months = Math.round(diffDays / 30);
    return `${months} ${months === 1 ? t('courses.duration.month') : t('courses.duration.months')}`;
  }
  if (diffDays >= 7) {
    const weeks = Math.round(diffDays / 7);
    return `${weeks} ${weeks === 1 ? t('courses.duration.week') : t('courses.duration.weeks')}`;
  }
  return `${diffDays} ${diffDays === 1 ? t('courses.duration.day') : t('courses.duration.days')}`;
}

const isPastStartDate = computed(() => {
  if (!course.value?.start_date) return false;
  const start = new Date(course.value.start_date);
  const today = new Date();
  start.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  return today >= start;
});

async function checkEnrollment() {
  if (!id || !authStore.isAuthenticated || !authStore.user?.id) return;
  checkingEnrollment.value = true;
  try {
    const res = await api.get(`/applications?user_id=${authStore.user.id}&course_id=${id}`);
    if (res.data && res.data.length > 0) {
      isEnrolled.value = true;
    }
  } catch (err) {
    console.error('Error checking enrollment:', err);
  } finally {
    checkingEnrollment.value = false;
  }
}

async function checkCourseCapacity() {
  if (!id || !course.value) return;
  try {
    const acceptedRes = await api.get(`/applications?course_id=${id}&status=aceptado`);
    acceptedCount.value = acceptedRes.data.length;

    const allRes = await api.get(`/applications?course_id=${id}`);
    totalApplicationsCount.value = allRes.data.length;

    const capacity = course.value.capacity || 20;
    
    // Full if accepted applications equal capacity
    isCourseFull.value = acceptedCount.value >= capacity;
    
    // Blocked if total applications equal or exceed 120% of capacity
    isBlockedByCapacity.value = totalApplicationsCount.value >= Math.floor(capacity * 1.2);
  } catch (err) {
    console.error('Error checking capacity:', err);
  }
}

async function loadCourse() {
  if (!id) return;
  loading.value = true;
  error.value = null;
  try {
    const res = await api.get(`/courses/${id}`);
    course.value = res.data;
    await checkEnrollment();
    await checkCourseCapacity();
  } catch (err: unknown) {
    error.value = getRequestErrorMessage(err, t('courses.loadError'));
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadCourse();
});

// Split auth user full name if possible
const getPrefilledNames = () => {
  const fullName = authStore.user?.fullName || '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length > 1) {
    return {
      first: parts[0],
      last: parts.slice(1).join(' ')
    };
  }
  return { first: fullName, last: '' };
};

const names = getPrefilledNames();

const form = ref({
  name: names.first,
  lastName: names.last,
  email: authStore.user?.email || '',
  phone: '',
  birth_date: '',
  dni_nie: '',
  has_darde: '' as boolean | '',
  previous_education: '',
  municipality: '',
  province: '',
  hasDisability: '',
  disabilityCertificate: '',
  socialMedia: '',
  internetExperience: '',
  additionalComments: '',
  agreeTerms: false
});

function validateDniNie(value: string) {
  const cleanVal = value.trim().toUpperCase();
  const regex = /^[XYZ0-9]\d{7}[A-Z]$/;
  return regex.test(cleanVal);
}

function calculateAge(birthDateStr: string) {
  if (!birthDateStr) return 0;
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

async function submitForm() {
  submitError.value = null;

  if (!authStore.isAuthenticated) {
    alert(t('courseDetail.validation.login'));
    router.push('/login');
    return;
  }

  if (!form.value.agreeTerms) {
    alert(t('courseDetail.validation.terms'));
    return;
  }

  // 1. DNI/NIE validation
  if (!validateDniNie(form.value.dni_nie)) {
    submitError.value = t('courseDetail.validation.dni');
    return;
  }

  // 2. Minimum Age validation
  if (calculateAge(form.value.birth_date) < 18) {
    submitError.value = t('courseDetail.validation.age');
    return;
  }

  // 3. DARDE check
  if (form.value.has_darde === '') {
    submitError.value = t('courseDetail.validation.darde');
    return;
  }

  // 4. Previous education text limit validation
  if (form.value.previous_education.length > 250) {
    submitError.value = t('courseDetail.validation.previousEducation');
    return;
  }

  submitting.value = true;

  try {
    const newApplication = {
      user_id: authStore.user?.id,
      course_id: Number(id),
      status: 'pendiente', // standard initial status
      created_at: new Date().toISOString(),
      dni_nie: form.value.dni_nie.trim().toUpperCase(),
      birth_date: form.value.birth_date,
      has_darde: form.value.has_darde === true,
      previous_education: form.value.previous_education ? form.value.previous_education.trim() : null,
      phone: form.value.phone,
      municipality: form.value.municipality,
      province: form.value.province,
      hasDisability: form.value.hasDisability,
      disabilityCertificate: form.value.disabilityCertificate,
      socialMedia: form.value.socialMedia,
      internetExperience: form.value.internetExperience,
      additionalComments: form.value.additionalComments
    };

    await api.post('/applications', newApplication);

    alert(t('courseDetail.validation.success'));
    isEnrolled.value = true;
    await checkCourseCapacity();
  } catch (err: unknown) {
    submitError.value = getRequestErrorMessage(err, t('courseDetail.validation.submitError'));
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="course-detail-page">
    <header class="course-hero" :style="course && course.banner ? `background-image: url(${course.banner})` : ''">
      <div class="container hero-inner">
        <div class="hero-text">
          <h1 class="hero-title">{{ course?.name || t('courseDetail.fallbackTitle') }}</h1>
          <p class="hero-subtitle">{{ course?.summary || course?.description || '' }}</p>
        </div>
      </div>
    </header>

    <main class="container section-padding">
      <div class="detail-grid">
        <section class="detail-main">
          <div v-if="loading" class="text-center">{{ t('courseDetail.loading') }}</div>
          <div v-else-if="error" class="text-center" style="color:var(--error-color)">{{ t('courseDetail.error', { message: error }) }}</div>

          <div v-else-if="course">
            <div class="glass-card detail-card">
              <div class="meta-row">
                <div class="meta-left">
                  <span class="course-tag">{{ course.is_active ? t('courses.status.open') : t('courses.status.closed') }}</span>
                </div>
                <div class="meta-right">
                  <div>{{ t('courseDetail.start') }}: <strong>{{ course.start_date || t('courses.duration.tbd') }}</strong></div>
                  <div>{{ t('courseDetail.end') }}: <strong>{{ course.end_date || t('courses.duration.tbd') }}</strong></div>
                  <div>{{ t('courseDetail.duration') }}: <strong>{{ formatDuration(course.start_date, course.end_date) }}</strong></div>
                </div>
              </div>

              <h2 class="detail-heading">{{ t('courseDetail.about') }}</h2>
              <p class="detail-text">{{ course.summary || course.description }}</p>

              <h3>{{ t('courseDetail.syllabus') }}</h3>
              <ul class="detail-list">
                <li v-for="(item, idx) in (course.syllabus || [])" :key="idx">{{ item }}</li>
              </ul>

              <h3>{{ t('courseDetail.outcomes') }}</h3>
              <ul class="detail-list">
                <li v-for="(lo, i) in (course.learning_outcomes || [])" :key="i">{{ lo }}</li>
              </ul>
            </div>
          </div>
        </section>

        <aside class="detail-aside">
          <div class="glass-card aside-card enroll-form-container">
            <!-- 1. Not Authenticated State -->
            <div v-if="!authStore.isAuthenticated" class="status-prompt-box text-center">
              <div class="status-icon"><Lock :size="56" /></div>
              <h3 class="form-title">{{ t('courseDetail.private.title') }}</h3>
              <p class="form-subtitle">{{ t('courseDetail.private.text') }}</p>
              <router-link to="/login" class="full-width btn-primary-link text-center" style="display: block; margin-top: 1.5rem; text-decoration: none;">
                {{ t('courseDetail.private.cta') }}
              </router-link>
            </div>

            <!-- 2. Already Enrolled State -->
            <div v-else-if="isEnrolled" class="status-prompt-box text-center">
              <div class="status-icon"><PartyPopper :size="56" /></div>
              <h3 class="form-title">{{ t('courseDetail.enrolled.title') }}</h3>
              <p class="form-subtitle">{{ t('courseDetail.enrolled.text') }}</p>
            </div>

            <!-- 3. Course Inactive State -->
            <div v-else-if="course && !course.is_active" class="status-prompt-box text-center">
              <div class="status-icon"><Ban :size="56" /></div>
              <h3 class="form-title">{{ t('courseDetail.inactive.title') }}</h3>
              <p class="form-subtitle">{{ t('courseDetail.inactive.text') }}</p>
            </div>

            <!-- 4. Course Already Started State -->
            <div v-else-if="isPastStartDate" class="status-prompt-box text-center">
              <div class="status-icon"><Calendar :size="56" /></div>
              <h3 class="form-title">{{ t('courseDetail.closed.title') }}</h3>
              <p class="form-subtitle">{{ t('courseDetail.closed.text', { date: course?.start_date || '' }) }}</p>
            </div>

            <!-- 5. Blocked by Over-booking (>120% capacity) State -->
            <div v-else-if="isBlockedByCapacity" class="status-prompt-box text-center">
              <div class="status-icon"><OctagonX :size="56" /></div>
              <h3 class="form-title">{{ t('courseDetail.full.title') }}</h3>
              <p class="form-subtitle">{{ t('courseDetail.full.text') }}</p>
            </div>

            <!-- 6. Active Form State -->
            <div v-else>
              <h3 class="form-title">{{ t('courseDetail.form.title') }}</h3>
              
              <!-- Warning Badge if Capacity Reached but pending (over-booking) is allowed -->
              <div v-if="isCourseFull" class="warning-badge">
                <TriangleAlert :size="16" style="vertical-align: middle; margin-right: 4px;" /> {{ t('courseDetail.form.warning') }}
              </div>
              <p v-else class="form-subtitle">{{ t('courseDetail.form.subtitle') }}</p>

              <form @submit.prevent="submitForm" class="enroll-form">
                <!-- Información Personal -->
                <fieldset class="form-section">
                  <legend class="section-title">{{ t('courseDetail.form.personal') }}</legend>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">{{ t('courseDetail.form.name') }}</label>
                      <input v-model="form.name" class="form-input" type="text" :placeholder="t('courseDetail.form.namePlaceholder')" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">{{ t('courseDetail.form.lastName') }}</label>
                      <input v-model="form.lastName" class="form-input" type="text" :placeholder="t('courseDetail.form.lastNamePlaceholder')" required />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">{{ t('courseDetail.form.email') }}</label>
                    <input v-model="form.email" class="form-input" type="email" placeholder="tu@correo.com" required />
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">{{ t('courseDetail.form.dni') }}</label>
                      <input v-model="form.dni_nie" class="form-input" type="text" placeholder="12345678Z o X1234567Z" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">{{ t('courseDetail.form.birthDate') }}</label>
                      <input v-model="form.birth_date" class="form-input" type="date" required />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">{{ t('courseDetail.form.phone') }}</label>
                    <div class="phone-input-group">
                      <select class="phone-country">
                        <option selected>ES +34</option>
                        <option>MX +52</option>
                        <option>AR +54</option>
                        <option>CO +57</option>
                        <option>CL +56</option>
                        <option>PE +51</option>
                      </select>
                      <input v-model="form.phone" class="form-input" type="tel" :placeholder="t('courseDetail.form.phonePlaceholder')" required />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">{{ t('courseDetail.form.darde') }}</label>
                    <select v-model="form.has_darde" class="form-input" required>
                      <option value="" disabled>{{ t('courseDetail.form.selectOption') }}</option>
                      <option :value="true">{{ t('courseDetail.form.yes') }}</option>
                      <option :value="false">{{ t('courseDetail.form.no') }}</option>
                    </select>
                  </div>
                </fieldset>

                <!-- Formación Previa (Solo si el curso requiere requisitos) -->
                <fieldset v-if="course?.prerequisites" class="form-section">
                  <legend class="section-title">{{ t('courseDetail.form.requirements') }}</legend>
                  <div class="prerequisites-box">
                    <strong>{{ t('courseDetail.form.requirementsLabel') }}</strong>
                    <p>{{ course.prerequisites }}</p>
                  </div>
                  <div class="form-group">
                    <label class="form-label">{{ t('courseDetail.form.previousEducation') }}</label>
                    <textarea v-model="form.previous_education" class="form-input" rows="3" :placeholder="t('courseDetail.form.previousEducationPlaceholder')" maxlength="250"></textarea>
                    <p class="char-counter">{{ t('courseDetail.form.remainingChars', { count: 250 - form.previous_education.length }) }}</p>
                  </div>
                </fieldset>

                <!-- Ubicación -->
                <fieldset class="form-section">
                  <legend class="section-title">{{ t('courseDetail.form.location') }}</legend>

                  <div class="form-group">
                    <label class="form-label">{{ t('courseDetail.form.municipality') }}</label>
                    <select v-model="form.municipality" class="form-input">
                      <option value="">{{ t('courseDetail.form.selectMunicipality') }}</option>
                      <option>Madrid</option>
                      <option>Barcelona</option>
                      <option>Valencia</option>
                      <option>Sevilla</option>
                      <option>Bilbao</option>
                      <option>{{ t('courseDetail.form.other') }}</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">{{ t('courseDetail.form.province') }}</label>
                    <select v-model="form.province" class="form-input">
                      <option value="">{{ t('courseDetail.form.selectProvince') }}</option>
                      <option>Madrid</option>
                      <option>Barcelona</option>
                      <option>Valencia</option>
                      <option>Sevilla</option>
                      <option>Bilbao</option>
                      <option>{{ t('courseDetail.form.other') }}</option>
                    </select>
                  </div>
                </fieldset>

                <!-- Discapacidad -->
                <fieldset class="form-section">
                  <legend class="section-title">{{ t('courseDetail.form.accessibility') }}</legend>

                  <div class="form-group">
                    <label class="form-label">{{ t('courseDetail.form.specialSituation') }}</label>
                    <select v-model="form.hasDisability" class="form-input">
                      <option value="">{{ t('courseDetail.form.selectOption') }}</option>
                      <option value="yes-certificate">{{ t('courseDetail.form.disabilityCertificate') }}</option>
                      <option value="no-certificate">{{ t('courseDetail.form.noCertificate') }}</option>
                      <option value="in-process">{{ t('courseDetail.form.vulnerable') }}</option>
                      <option value="none">{{ t('courseDetail.form.none') }}</option>
                    </select>
                  </div>

                  <div v-if="form.hasDisability === 'yes-certificate'" class="form-group">
                    <label class="form-label">{{ t('courseDetail.form.certificateType') }}</label>
                    <select v-model="form.disabilityCertificate" class="form-input">
                      <option value="">{{ t('courseDetail.form.selectType') }}</option>
                      <option>{{ t('courseDetail.form.physical') }}</option>
                      <option>{{ t('courseDetail.form.sensory') }}</option>
                      <option>{{ t('courseDetail.form.intellectual') }}</option>
                      <option>{{ t('courseDetail.form.other') }}</option>
                    </select>
                  </div>
                </fieldset>

                <!-- Conectividad -->
                <fieldset class="form-section">
                  <legend class="section-title">{{ t('courseDetail.form.connectivity') }}</legend>

                  <div class="form-group">
                    <label class="form-label">{{ t('courseDetail.form.internet') }}</label>
                    <select v-model="form.internetExperience" class="form-input">
                      <option value="">{{ t('courseDetail.form.selectOption') }}</option>
                      <option>{{ t('courseDetail.form.wifi') }}</option>
                      <option>{{ t('courseDetail.form.mobileConnection') }}</option>
                      <option>{{ t('courseDetail.form.limitedConnection') }}</option>
                      <option>{{ t('courseDetail.form.noConnection') }}</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">{{ t('courseDetail.form.social') }}</label>
                    <select v-model="form.socialMedia" class="form-input">
                      <option value="">{{ t('courseDetail.form.selectNetwork') }}</option>
                      <option>Facebook</option>
                      <option>Instagram</option>
                      <option>WhatsApp</option>
                      <option>Twitter/X</option>
                      <option>LinkedIn</option>
                      <option>{{ t('courseDetail.form.none') }}</option>
                    </select>
                  </div>
                </fieldset>

                <!-- Comentarios -->
                <fieldset class="form-section">
                  <legend class="section-title">{{ t('courseDetail.form.comments') }}</legend>

                  <div class="form-group">
                    <label class="form-label">{{ t('courseDetail.form.moreInfo') }}</label>
                    <textarea v-model="form.additionalComments" class="form-input" rows="3" :placeholder="t('courseDetail.form.commentsPlaceholder')"></textarea>
                  </div>
                </fieldset>

                <!-- Términos -->
                <div class="form-section">
                  <label class="checkbox-label">
                    <input v-model="form.agreeTerms" type="checkbox" required />
                    <span>{{ t('courseDetail.form.terms') }}</span>
                  </label>
                </div>

                <div v-if="submitError" class="submit-error-msg">
                  <TriangleAlert :size="16" style="vertical-align: middle; margin-right: 4px;" /> {{ submitError }}
                </div>

                <!-- Botón -->
                <button type="submit" class="full-width btn-primary" :disabled="submitting">
                  {{ submitting ? t('courseDetail.form.submitting') : t('courseDetail.form.submit') }}
                </button>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
.course-hero {
  min-height: 360px;
  background: linear-gradient(90deg, rgba(84,24,193,0.08), rgba(255,87,34,0.02));
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
}

.hero-inner {
  display: flex;
  align-items: center;
}

.hero-text {
  max-width: 900px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 1rem;
  color: var(--text-dark);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: start;
}

.detail-card {
  padding: 2rem;
  background: var(--white);
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.meta-left {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.meta-right {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: right;
}

.meta-right div {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.meta-right strong {
  color: var(--text-dark);
  font-weight: 600;
}

.course-tag {
  background: var(--secondary-color-soft);
  color: var(--secondary-color);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.8rem;
}

.detail-heading {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 2rem 0 1rem;
  color: var(--text-dark);
}

.detail-text {
  color: var(--text-muted);
  line-height: 1.7;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.detail-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 2rem 0 1rem;
  color: var(--text-dark);
}

.detail-list {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--text-muted);
  line-height: 1.8;
}

.detail-list li {
  margin-bottom: 0.75rem;
}

/* Form Styles */
.detail-aside {
  margin-top: 2rem;
}

.aside-card {
  padding: 2rem;
  position: static;
  max-width: 100%;
  background: var(--white);
}

.enroll-form-container {
  border-radius: 16px;
}

.form-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  color: var(--text-dark);
}

.form-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0 0 1.75rem;
  line-height: 1.6;
}

.enroll-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--primary-color);
  margin: 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--primary-color-soft);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-dark);
  display: block;
}

.form-input {
  padding: 0.85rem 1rem;
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: inherit;
  transition: all 0.2s ease;
  background: var(--white);
}

.form-input:hover {
  border-color: var(--primary-color-soft);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(67, 17, 185, 0.08);
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

select.form-input {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.85rem center;
  background-size: 1.2rem;
  padding-right: 2.75rem;
  cursor: pointer;
  appearance: none;
}

.phone-input-group {
  display: flex;
  gap: 0.75rem;
}

.phone-country {
  flex-shrink: 0;
  width: auto;
  min-width: 90px;
  padding: 0.85rem 0.85rem;
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;
  background-size: 1rem;
  padding-right: 2.2rem;
  background-color: var(--white);
  transition: all 0.2s ease;
}

.phone-country:hover {
  border-color: var(--primary-color-soft);
}

.phone-country:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(67, 17, 185, 0.08);
}

.phone-input-group .form-input {
  flex: 1;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-dark);
  line-height: 1.5;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.checkbox-label:hover {
  background: var(--primary-color-soft);
}

.checkbox-label input[type="checkbox"] {
  margin-top: 0.35rem;
  cursor: pointer;
  accent-color: var(--primary-color);
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.full-width {
  width: 100%;
  padding: 1rem;
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  border-radius: 10px;
  background: var(--primary-color);
  color: var(--white);
  cursor: pointer;
  transition: all 0.3s ease;
}

.full-width:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(67, 17, 185, 0.2);
}

.full-width:active:not(:disabled) {
  transform: translateY(0);
}

.full-width:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Custom styles for new requirements */
.btn-primary-link {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-color);
  color: var(--white) !important;
  font-weight: 600;
  border-radius: 10px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.btn-primary-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(67, 17, 185, 0.2);
}

.prerequisites-box {
  background-color: var(--primary-color-soft);
  color: var(--primary-color);
  border: 1px dashed var(--primary-color);
  border-radius: 10px;
  padding: 1rem;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.prerequisites-box strong {
  display: block;
  margin-bottom: 0.25rem;
}

.char-counter {
  text-align: right;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.warning-badge {
  background-color: var(--secondary-color-soft);
  color: var(--secondary-color);
  border: 1px solid rgba(236, 86, 32, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.status-prompt-box {
  padding: 2.5rem 1.5rem;
}

.status-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.submit-error-msg {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

@media (max-width: 1024px) {
  .hero-title {
    font-size: 2rem;
  }
}

@media (max-width: 900px) {
  .course-hero {
    min-height: 250px;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .meta-row {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .meta-right {
    text-align: left;
  }
}

@media (max-width: 640px) {
  .detail-card {
    padding: 1.5rem;
  }

  .aside-card {
    padding: 1.5rem;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .detail-heading {
    font-size: 1.25rem;
  }

  .form-title {
    font-size: 1.2rem;
  }
}
</style>
