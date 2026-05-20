<script setup lang="ts">
/**
 * AboutView.vue
 * Information about the Course Flow platform.
 */
import { Lightbulb, Handshake, Globe, Users, TrendingUp, Building2 } from '@lucide/vue';
</script>

<template>
  <div class="about-view">
    <!-- About Hero -->
    <section class="about-hero section-padding">
      <div class="container text-center">
        <h1 class="hero-title">Conoce <span class="text-accent">Course Flow</span></h1>
        <p class="hero-subtitle mx-auto">
          Construimos un entorno de aprendizaje tecnológico, equitativo y accesible para todas y
          todos.
        </p>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="mission-vision section-padding bg-soft">
      <div class="container grid-2">
        <div class="mission-content">
          <h2 class="section-title">Nuestra Misión</h2>
          <p>
            Acompañar a las personas en su desarrollo digital ofreciendo formación tecnológica
            inclusiva para reducir la brecha digital y fomentar la diversidad en el sector
            tecnológico.
          </p>
        </div>
        <div class="vision-content">
          <h2 class="section-title">Nuestra Visión</h2>
          <p>
            Ser la red de aprendizaje de referencia que conecta el talento diverso con las
            oportunidades laborales y de crecimiento profesional en el sector digital.
          </p>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="values section-padding">
      <div class="container">
        <h2 class="section-title text-center">Nuestros Valores</h2>
        <div class="values-grid">
          <div class="value-card glass-card">
            <div class="value-icon"><Lightbulb :size="40" /></div>
            <h3>Innovación</h3>
            <p>Buscamos constantemente soluciones pedagógicas innovadoras orientadas al empleo.</p>
          </div>
          <div class="value-card glass-card">
            <div class="value-icon"><Handshake :size="40" /></div>
            <h3>Inclusión y Diversidad</h3>
            <p>
              Creemos en el potencial y talento de cada persona sin importar su punto de partida.
            </p>
          </div>
          <div class="value-card glass-card">
            <div class="value-icon"><Globe :size="40" /></div>
            <h3>Accesibilidad</h3>
            <p>
              Garantizamos educación tecnológica gratuita y de alta calidad para colectivos
              diversos.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Data -->
    <section class="impact section-padding bg-soft">
      <div class="container">
        <h2 class="section-title text-center">Nuestros Datos de Impacto</h2>
        <div class="values-grid">
          <div class="value-card glass-card">
            <div class="value-icon"><Users :size="40" /></div>
            <h3>+1.200</h3>
            <p>Personas formadas y acompañadas en su inserción laboral digital.</p>
          </div>
          <div class="value-card glass-card">
            <div class="value-icon"><TrendingUp :size="40" /></div>
            <h3>63%</h3>
            <p>Tasa de inserción y éxito laboral en empresas aliadas.</p>
          </div>
          <div class="value-card glass-card">
            <div class="value-icon"><Building2 :size="40" /></div>
            <h3>+400</h3>
            <p>Empresas colaboradoras y partners que confían en nuestro talento.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Story -->
    <section class="story section-padding">
      <div class="container max-w-md text-center">
        <h2 class="section-title">Nuestra Historia</h2>
        <p>
          Fundada en 2024, Course Flow nació de la necesidad de ofrecer un entorno de aprendizaje
          más accesible y solidario en el ámbito del desarrollo tecnológico. Lo que comenzó como un
          proyecto local de inclusión digital se ha consolidado en una plataforma robusta diseñada
          para conectar la formación de calidad con el empleo del futuro.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-view {
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
  max-width: 700px;
}

.section-title {
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 4rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.value-card {
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  transition: transform 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
}

.value-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.value-card h3 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.max-w-md {
  max-width: 800px;
  margin: 0 auto;
}
</style>
