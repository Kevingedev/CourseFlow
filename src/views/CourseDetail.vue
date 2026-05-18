<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';

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

const course = ref<Course | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

function formatDuration(start?: string, end?: string) {
  if (!start || !end) return 'TBD';
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e <= s) return 'TBD';
  const diffMs = e.getTime() - s.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays >= 365) {
    const years = Math.round(diffDays / 365);
    return `${years} ${years === 1 ? 'año' : 'años'}`;
  }
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

async function loadCourse() {
  if (!id) return;
  loading.value = true;
  error.value = null;
  try {
    const res = await api.get(`/courses/${id}`);
    course.value = res.data;
  } catch (err: any) {
    error.value = err?.response?.data || err.message || 'Error cargando curso';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadCourse();
});

function goBack() {
  router.push('/courses');
}

const form = ref({
  name: '',
  lastName: '',
  email: '',
  phone: '',
  birthYear: '',
  municipality: '',
  province: '',
  hasDisability: '',
  disabilityCertificate: '',
  socialMedia: '',
  internetExperience: '',
  additionalComments: '',
  agreeTerms: false
});

function submitForm() {
  if (!form.value.agreeTerms) {
    alert('Por favor, acepta los términos y condiciones.');
    return;
  }
  console.log('enroll', { courseId: id, ...form.value });
  alert('Gracias. Tu solicitud se ha registrado (simulado).');
  form.value = {
    name: '',
    lastName: '',
    email: '',
    phone: '',
    birthYear: '',
    municipality: '',
    province: '',
    hasDisability: '',
    disabilityCertificate: '',
    socialMedia: '',
    internetExperience: '',
    additionalComments: '',
    agreeTerms: false
  };
}

function generateYears() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 80; i <= currentYear; i++) {
    years.push(i);
  }
  return years.reverse();
}
</script>

<template>
  <div class="course-detail-page">
    <header class="course-hero" :style="course && course.banner ? `background-image: url(${course.banner})` : ''">
      <div class="container hero-inner">
        <div class="hero-text">
          <h1 class="hero-title">{{ course?.name || 'Curso' }}</h1>
          <p class="hero-subtitle">{{ course?.summary || course?.description || '' }}</p>
        </div>
      </div>
    </header>

    <main class="container section-padding">
      <div class="detail-grid">
        <section class="detail-main">
          <div v-if="loading" class="text-center">Cargando curso...</div>
          <div v-else-if="error" class="text-center" style="color:var(--error-color)">Error: {{ error }}</div>

          <div v-else-if="course">
            <div class="glass-card detail-card">
              <div class="meta-row">
                <div class="meta-left">
                  <span class="course-tag">{{ course.is_active ? 'Open' : 'Closed' }}</span>
                </div>
                <div class="meta-right">
                  <div>Inicio: <strong>{{ course.start_date || 'TBD' }}</strong></div>
                  <div>Finalización: <strong>{{ course.end_date || 'TBD' }}</strong></div>
                  <div>Duración: <strong>{{ formatDuration(course.start_date, course.end_date) }}</strong></div>
                </div>
              </div>

              <h2 class="detail-heading">¿De qué trata este curso?</h2>
              <p class="detail-text">{{ course.summary || course.description }}</p>

              <h3>Temario</h3>
              <ul class="detail-list">
                <li v-for="(item, idx) in (course.syllabus || [])" :key="idx">{{ item }}</li>
              </ul>

              <h3>Qué aprenderás</h3>
              <ul class="detail-list">
                <li v-for="(lo, i) in (course.learning_outcomes || [])" :key="i">{{ lo }}</li>
              </ul>
            </div>
          </div>
        </section>

        <aside class="detail-aside">
          <div class="glass-card aside-card enroll-form-container">
            <h3 class="form-title">¿Interesado en este curso?</h3>
            <p class="form-subtitle">Completa este formulario y nos pondremos en contacto contigo en breve.</p>

            <form @submit.prevent="submitForm" class="enroll-form">
              <!-- Información Personal -->
              <fieldset class="form-section">
                <legend class="section-title">Tu Información</legend>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Nombre *</label>
                    <input v-model="form.name" class="form-input" type="text" placeholder="Tu nombre" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Apellido *</label>
                    <input v-model="form.lastName" class="form-input" type="text" placeholder="Tu apellido" required />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Correo Electrónico *</label>
                  <input v-model="form.email" class="form-input" type="email" placeholder="tu@correo.com" required />
                </div>

                <div class="form-group">
                  <label class="form-label">Teléfono *</label>
                  <div class="phone-input-group">
                    <select class="phone-country">
                      <option selected>🇪🇸 +34</option>
                      <option>🇲🇽 +52</option>
                      <option>🇦🇷 +54</option>
                      <option>🇨🇴 +57</option>
                      <option>🇨🇱 +56</option>
                      <option>🇵🇪 +51</option>
                    </select>
                    <input v-model="form.phone" class="form-input" type="tel" placeholder="123456789" required />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Año de Nacimiento</label>
                  <select v-model="form.birthYear" class="form-input">
                    <option value="">Selecciona tu año de nacimiento</option>
                    <option v-for="year in generateYears()" :key="year" :value="year">{{ year }}</option>
                  </select>
                </div>
              </fieldset>

              <!-- Ubicación -->
              <fieldset class="form-section">
                <legend class="section-title">Ubicación</legend>

                <div class="form-group">
                  <label class="form-label">Municipio</label>
                  <select v-model="form.municipality" class="form-input">
                    <option value="">Selecciona tu municipio</option>
                    <option>Madrid</option>
                    <option>Barcelona</option>
                    <option>Valencia</option>
                    <option>Sevilla</option>
                    <option>Bilbao</option>
                    <option>Otro</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Provincia</label>
                  <select v-model="form.province" class="form-input">
                    <option value="">Selecciona tu provincia</option>
                    <option>Madrid</option>
                    <option>Barcelona</option>
                    <option>Valencia</option>
                    <option>Sevilla</option>
                    <option>Bilbao</option>
                    <option>Otro</option>
                  </select>
                </div>
              </fieldset>

              <!-- Discapacidad -->
              <fieldset class="form-section">
                <legend class="section-title">Accesibilidad</legend>

                <div class="form-group">
                  <label class="form-label">¿Tienes alguna situación especial?</label>
                  <select v-model="form.hasDisability" class="form-input">
                    <option value="">Selecciona una opción</option>
                    <option value="yes-certificate">Tengo certificado de discapacidad</option>
                    <option value="no-certificate">No tengo certificado</option>
                    <option value="in-process">Situación de vulnerabilidad</option>
                    <option value="none">Ninguna</option>
                  </select>
                </div>

                <div v-if="form.hasDisability === 'yes-certificate'" class="form-group">
                  <label class="form-label">Tipo de Certificado</label>
                  <select v-model="form.disabilityCertificate" class="form-input">
                    <option value="">Selecciona el tipo</option>
                    <option>Física</option>
                    <option>Sensorial</option>
                    <option>Intelectual</option>
                    <option>Otra</option>
                  </select>
                </div>
              </fieldset>

              <!-- Conectividad -->
              <fieldset class="form-section">
                <legend class="section-title">Conectividad</legend>

                <div class="form-group">
                  <label class="form-label">¿Cómo te conectas a internet?</label>
                  <select v-model="form.internetExperience" class="form-input">
                    <option value="">Selecciona una opción</option>
                    <option>Banda ancha/WiFi</option>
                    <option>Conexión móvil</option>
                    <option>Conexión limitada</option>
                    <option>No tengo conexión</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">¿Qué red social usas más?</label>
                  <select v-model="form.socialMedia" class="form-input">
                    <option value="">Selecciona una red</option>
                    <option>Facebook</option>
                    <option>Instagram</option>
                    <option>WhatsApp</option>
                    <option>Twitter/X</option>
                    <option>LinkedIn</option>
                    <option>Ninguna</option>
                  </select>
                </div>
              </fieldset>

              <!-- Comentarios -->
              <fieldset class="form-section">
                <legend class="section-title">Comentarios</legend>

                <div class="form-group">
                  <label class="form-label">¿Hay algo más que debamos saber?</label>
                  <textarea v-model="form.additionalComments" class="form-input" rows="3" placeholder="Cuéntanos tus expectativas o dudas..."></textarea>
                </div>
              </fieldset>

              <!-- Términos -->
              <div class="form-section">
                <label class="checkbox-label">
                  <input v-model="form.agreeTerms" type="checkbox" required />
                  <span>Acepto los términos, privacidad y que se contacten conmigo *</span>
                </label>
              </div>

              <!-- Botón -->
              <button type="submit" class="full-width btn-primary" :disabled="loading">
                {{ loading ? 'Enviando...' : '¡Enviar Inscripción!' }}
              </button>
            </form>
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
  box-shadow: 0 0 0 4px rgba(84, 24, 193, 0.08);
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
  box-shadow: 0 0 0 4px rgba(84, 24, 193, 0.08);
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
  box-shadow: 0 8px 16px rgba(84, 24, 193, 0.2);
}

.full-width:active:not(:disabled) {
  transform: translateY(0);
}

.full-width:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
