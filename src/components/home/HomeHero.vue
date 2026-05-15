<script setup lang="ts">
// Hero content component
</script>

<template>
  <section class="hero section-padding">
    <div class="container hero-grid">
      <div class="hero-content">
        <h1 class="hero-title">Elevate Your <span class="text-accent">Learning Journey.</span></h1>
        <p class="hero-subtitle">
          Discover a new way to manage and participate in pedagogical courses. Expertly designed for
          educators and learners alike.
        </p>
        <div class="hero-actions">
          <router-link to="/courses" class="btn-primary">Explore Courses</router-link>
          <router-link to="/about" class="btn-secondary">Learn More</router-link>
        </div>
      </div>
      <div class="hero-image-container">
        <div class="hero-image-placeholder">
          <!-- Image placeholder -->
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
  font-size: 4.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
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
}

.hero-image-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  background-color: var(--primary-color-soft);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(84, 24, 193, 0.1);
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
