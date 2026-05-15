<script setup lang="ts">
/**
 * AboutView.vue
 * Information about the Course Flow platform.
 */
</script>

<template>
  <div class="about-view">
    <!-- About Hero -->
    <section class="about-hero section-padding">
      <div class="container text-center">
        <h1 class="hero-title">About <span class="text-accent">Course Flow</span></h1>
        <p class="hero-subtitle mx-auto">
          We are dedicated to revolutionizing pedagogical management through innovation and
          technology.
        </p>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="mission-vision section-padding bg-soft">
      <div class="container grid-2">
        <div class="mission-content">
          <h2 class="section-title">Our Mission</h2>
          <p>
            To empower learners and educators through an intuitive and efficient course management
            system that streamlines administrative tasks and enhances the learning experience.
          </p>
        </div>
        <div class="vision-content">
          <h2 class="section-title">Our Vision</h2>
          <p>
            To become the leading global platform for pedagogical organization, fostering a seamless
            connection between high-quality educational content and those seeking to grow.
          </p>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="values section-padding">
      <div class="container">
        <h2 class="section-title text-center">Our Core Values</h2>
        <div class="values-grid">
          <div class="value-card glass-card">
            <div class="value-icon">💡</div>
            <h3>Innovation</h3>
            <p>Constantly seeking new ways to improve educational management and delivery.</p>
          </div>
          <div class="value-card glass-card">
            <div class="value-icon">🎯</div>
            <h3>Excellence</h3>
            <p>Striving for the highest quality in every feature and service we provide.</p>
          </div>
          <div class="value-card glass-card">
            <div class="value-icon">🌍</div>
            <h3>Accessibility</h3>
            <p>Ensuring our platform is usable and beneficial for everyone, everywhere.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Story -->
    <section class="story section-padding bg-soft">
      <div class="container max-w-md text-center">
        <h2 class="section-title">Our Story</h2>
        <p>
          Founded in 2024, Course Flow emerged from the need for a more cohesive and user-friendly
          way to handle pedagogical workflows. What started as a small project has grown into a
          robust platform designed to meet the evolving needs of modern education.
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

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
}
</style>
