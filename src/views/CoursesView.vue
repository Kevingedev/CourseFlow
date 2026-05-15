<script setup lang="ts">
/**
 * CoursesView.vue
 * Placeholder for the Course Catalog page.
 */
</script>

<template>
  <div class="courses-view">
    <!-- Courses Hero -->
    <section class="courses-hero section-padding">
      <div class="container text-center">
        <h1 class="hero-title">Our Pedagogical <span class="text-accent">Catalog</span></h1>
        <p class="hero-subtitle mx-auto">
          Explore our diverse range of courses designed to elevate your teaching and learning
          experience.
        </p>
      </div>
    </section>

    <!-- Categories -->
    <section class="categories section-padding bg-soft">
      <div class="container">
        <h2 class="section-title text-center">Explore by Category</h2>
        <div class="categories-grid">
          <div class="category-card glass-card">
            <div class="category-icon">🏫</div>
            <h3>Teaching Methods</h3>
            <p>Modern strategies for effective classroom management and engagement.</p>
          </div>
          <div class="category-card glass-card">
            <div class="category-icon">💻</div>
            <h3>Digital Tools</h3>
            <p>Master the latest technology to enhance your educational workflows.</p>
          </div>
          <div class="category-card glass-card">
            <div class="category-icon">👥</div>
            <h3>Leadership</h3>
            <p>Develop the skills needed to lead educational institutions and teams.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Courses Grid -->
    <section class="upcoming-courses section-padding">
      <div class="container">
        <h2 class="section-title text-center">Upcoming Courses</h2>
        <div class="courses-grid">
          <div v-for="i in 3" :key="i" class="course-card glass-card">
            <div class="course-image-placeholder">
              <span>Coming Soon</span>
            </div>
            <div class="course-content">
              <span class="course-tag">New</span>
              <h3>Course Title {{ i }}</h3>
              <p>A brief description of what this amazing pedagogical course will cover.</p>
              <div class="course-footer">
                <span class="course-price">Provisional</span>
                <button class="btn-primary-small">Notify Me</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Coming Soon Banner -->
    <section class="coming-soon section-padding bg-soft">
      <div class="container text-center max-w-md">
        <div class="provisional-banner glass-card">
          <h2 class="section-title">Full Catalog Under Development</h2>
          <p>
            We are working hard to bring you a fully interactive course catalog. Soon you will be
            able to filter, search, and enroll in our premium courses directly.
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

.course-image-placeholder {
  width: 100%;
  aspect-ratio: 16/9;
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
