<script setup lang="ts">
import HomeHero from '@/components/home/HomeHero.vue'
</script>

<template>
  <div class="home-view">
    <HomeHero />

    <section class="features section-padding">
      <div class="container">
        <h2 class="section-title">¿Por qué elegir <span class="text-accent">Course Flow?</span></h2>
        <div class="features-grid">
          <div class="feature-card glass-card">
            <h3>Formación y Acompañamiento</h3>
            <p>
              Aprende de profesionales del sector tecnológico y docentes con amplia experiencia.
            </p>
          </div>
          <div class="feature-card glass-card">
            <h3>Metodología Flexible e Inclusiva</h3>
            <p>
              Accede a las formaciones en cualquier momento, desde cualquier lugar y a tu ritmo.
            </p>
          </div>
          <div class="feature-card glass-card">
            <h3>Aprendizaje Práctico</h3>
            <p>
              Participa con proyectos reales y dinámicos diseñados para impulsar tu carrera digital.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
}

.text-accent {
  color: var(--primary-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2.5rem;
  border-radius: 16px;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.feature-card p {
  color: var(--text-muted);
}
</style>
