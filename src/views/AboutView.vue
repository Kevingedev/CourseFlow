<script setup lang="ts">
/**
 * AboutView.vue
 * Information about the Course Flow platform.
 */
import { Lightbulb, Handshake, Globe, Users, TrendingUp, Building2 } from '@lucide/vue';
import { useI18n } from '@/i18n'

const { t } = useI18n()
</script>

<template>
  <div class="about-view">
    <!-- About Hero -->
    <section class="about-hero section-padding">
      <div class="container text-center">
        <h1 class="hero-title">{{ t('about.hero.titlePrefix') }} <span class="text-accent">Course Flow</span></h1>
        <p class="hero-subtitle mx-auto">
          {{ t('about.hero.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="mission-vision section-padding bg-soft">
      <div class="container grid-2">
        <div class="mission-content">
          <h2 class="section-title">{{ t('about.mission.title') }}</h2>
          <p>
            {{ t('about.mission.text') }}
          </p>
        </div>
        <div class="vision-content">
          <h2 class="section-title">{{ t('about.vision.title') }}</h2>
          <p>
            {{ t('about.vision.text') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="values section-padding">
      <div class="container">
        <h2 class="section-title text-center">{{ t('about.values.title') }}</h2>
        <div class="values-grid">
          <div class="value-card glass-card">
            <div class="value-icon"><Lightbulb :size="40" /></div>
            <h3>{{ t('about.values.innovation.title') }}</h3>
            <p>{{ t('about.values.innovation.text') }}</p>
          </div>
          <div class="value-card glass-card">
            <div class="value-icon"><Handshake :size="40" /></div>
            <h3>{{ t('about.values.inclusion.title') }}</h3>
            <p>
              {{ t('about.values.inclusion.text') }}
            </p>
          </div>
          <div class="value-card glass-card">
            <div class="value-icon"><Globe :size="40" /></div>
            <h3>{{ t('about.values.accessibility.title') }}</h3>
            <p>
              {{ t('about.values.accessibility.text') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Data -->
    <section class="impact section-padding bg-soft">
      <div class="container">
        <h2 class="section-title text-center">{{ t('about.impact.title') }}</h2>
        <div class="values-grid">
          <div class="value-card glass-card">
            <div class="value-icon"><Users :size="40" /></div>
            <h3>+1.200</h3>
            <p>{{ t('about.impact.people') }}</p>
          </div>
          <div class="value-card glass-card">
            <div class="value-icon"><TrendingUp :size="40" /></div>
            <h3>63%</h3>
            <p>{{ t('about.impact.rate') }}</p>
          </div>
          <div class="value-card glass-card">
            <div class="value-icon"><Building2 :size="40" /></div>
            <h3>+400</h3>
            <p>{{ t('about.impact.partners') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Story -->
    <section class="story section-padding">
      <div class="container max-w-md text-center">
        <h2 class="section-title">{{ t('about.story.title') }}</h2>
        <p>
          {{ t('about.story.text') }}
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
