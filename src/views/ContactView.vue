<script setup lang="ts">
/**
 * ContactView.vue
 * Placeholder for the Contact page.
 */
</script>

<template>
  <div class="contact-view">
    <!-- Contact Hero -->
    <section class="contact-hero section-padding">
      <div class="container text-center">
        <h1 class="hero-title">Get in <span class="text-accent">Touch</span></h1>
        <p class="hero-subtitle mx-auto">
          Have questions about our courses or the platform? Our team is here to help you.
        </p>
      </div>
    </section>

    <!-- Contact Content -->
    <section class="contact-content section-padding">
      <div class="container grid-2">
        <!-- Contact Info -->
        <div class="contact-info">
          <h2 class="section-title">Contact Information</h2>
          <div class="info-items">
            <div class="info-item">
              <div class="info-icon">📧</div>
              <div class="info-text">
                <h3>Email Us</h3>
                <p>info@courseflow.com</p>
                <p>support@courseflow.com</p>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">📞</div>
              <div class="info-text">
                <h3>Call Us</h3>
                <p>+34 900 123 456</p>
                <p>Mon - Fri, 9:00 - 18:00</p>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">📍</div>
              <div class="info-text">
                <h3>Visit Us</h3>
                <p>Calle Ficticia 123, 28001</p>
                <p>Madrid, Spain</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="contact-form-container glass-card">
          <form class="contact-form" @submit.prevent>
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" placeholder="John Doe" required />
            </div>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" placeholder="john@example.com" required />
            </div>
            <div class="form-group">
              <label for="subject">Subject</label>
              <input type="text" id="subject" placeholder="How can we help?" required />
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea
                id="message"
                rows="5"
                placeholder="Your message here..."
                required
              ></textarea>
            </div>
            <button type="submit" class="btn-primary w-full">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact-view {
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

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-muted);
  max-width: 600px;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 4rem;
  align-items: start;
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  margin-top: 2rem;
}

.info-item {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.info-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  background-color: var(--primary-color-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.info-text h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.info-text p {
  color: var(--text-muted);
}

.contact-form-container {
  padding: 3rem;
  border-radius: 20px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-dark);
}

.form-group input,
.form-group textarea {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--white);
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.w-full {
  width: 100%;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  .contact-form-container {
    padding: 2rem;
  }
}
</style>
