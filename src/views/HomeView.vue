<script setup lang="ts">
import HomeHero from '@/components/home/HomeHero.vue'
</script>

<template>
  <div class="home-view">
    <HomeHero />

    <section class="features section-padding">
      <div class="container">
        <h2 class="section-title">Why Choose <span class="text-accent">Course Flow?</span></h2>
        <div class="features-grid">
          <div class="feature-card glass-card">
            <h3>Expert Instructors</h3>
            <p>Learn from industry leaders and experienced educators in various fields.</p>
          </div>
          <div class="feature-card glass-card">
            <h3>Flexible Learning</h3>
            <p>Access your courses anytime, anywhere, and at your own pace.</p>
          </div>
          <div class="feature-card glass-card">
            <h3>Interactive Content</h3>
            <p>Engage with dynamic materials designed to enhance your pedagogical experience.</p>
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
