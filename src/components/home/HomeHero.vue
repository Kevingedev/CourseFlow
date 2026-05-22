<script setup lang="ts">
import { useI18n } from '@/i18n'

const { t } = useI18n()
</script>

<template>
  <section class="hero section-padding">
    <div class="container hero-grid">
      <div class="hero-content">
        <h1 class="hero-title">
          {{ t('home.hero.titlePrefix') }} <span class="text-accent">{{ t('home.hero.titleAccent') }}</span>
        </h1>
        <p class="hero-subtitle">
          {{ t('home.hero.subtitle') }}
        </p>
        <div class="hero-actions">
          <router-link to="/courses" class="btn-primary">{{ t('home.hero.primary') }}</router-link>
          <router-link to="/about" class="btn-secondary">{{ t('home.hero.secondary') }}</router-link>
        </div>
      </div>
      <div class="hero-image-container">
        <div class="hero-image-placeholder">
          <img src="/home_hero.png" :alt="t('home.hero.imageAlt')" class="hero-img" />
        </div>
        <div class="decor-blob blob-1"></div>
        <div class="decor-blob blob-2"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  align-items: center;
}

@media (max-width: 992px) {
  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

.hero-title {
  font-size: clamp(2.5rem, 4.5vw, 4rem);
  line-height: 1.15;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.75rem;
  }
}

.text-accent {
  color: var(--primary-color);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  max-width: 500px;
}

@media (max-width: 992px) {
  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
}

@media (max-width: 992px) {
  .hero-actions {
    justify-content: center;
  }
}

.hero-image-container {
  position: relative;
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
}

.hero-image-placeholder {
  width: 100%;
  aspect-ratio: 4 / 3;
  background-color: #f9eeee;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(67, 17, 185, 0.1);
  border: 1px solid rgba(67, 17, 185, 0.08);
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.hero-img:hover {
  transform: scale(1.03);
}

.decor-blob {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  filter: blur(60px);
  z-index: -1;
}

.blob-1 {
  background-color: var(--secondary-color-soft);
  top: -20px;
  right: -20px;
}

.blob-2 {
  background-color: var(--primary-color-soft);
  bottom: -20px;
  left: -20px;
}
</style>
