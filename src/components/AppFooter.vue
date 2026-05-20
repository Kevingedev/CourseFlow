<script setup lang="ts">
import logoUrl from '@/assets/logo.svg'
</script>

<template>
  <footer class="footer">
    <div class="container footer-grid">
      <!-- Column 1: Brand -->
      <div class="footer-col">
        <div class="logo">
          <img :src="logoUrl" alt="CourseFlow Logo" class="footer-logo" />
        </div>
        <p class="footer-desc">
          Plataforma de gestión pedagógica profesional. Impulsando el talento digital y la
          inclusión.
        </p>
      </div>

      <!-- Column 2: Quick Links -->
      <div class="footer-col">
        <h4 class="footer-title">Enlaces rápidos</h4>
        <ul class="footer-links">
          <li><router-link to="/about">Conócenos</router-link></li>
          <li><router-link to="/courses">Formaciones</router-link></li>
          <li><router-link to="/contact">Contacto</router-link></li>
        </ul>
      </div>

      <!-- Column 3: Contact -->
      <div class="footer-col">
        <h4 class="footer-title">Contacto</h4>
        <ul class="footer-links">
          <li>+34 900 123 456</li>
          <li>info@courseflow.com</li>
        </ul>
      </div>

      <!-- Column 4: Socials -->
      <div class="footer-col">
        <h4 class="footer-title">Redes sociales</h4>
        <div class="social-icons">
          <a href="#" class="social-icon" aria-label="Facebook">FB</a>
          <a href="#" class="social-icon" aria-label="Instagram">IG</a>
          <a href="#" class="social-icon" aria-label="YouTube">YT</a>
          <a href="#" class="social-icon" aria-label="LinkedIn">LI</a>
        </div>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>© 2024 CourseFlow. Todos los derechos reservados.</p>
      <div class="legal-links">
        <router-link to="/">Política de privacidad</router-link>
        <router-link to="/">Términos y condiciones</router-link>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--white);
  border-top: 1px solid var(--border-color);
  padding: 5rem 0 2rem;
  margin-top: auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 576px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.footer-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.footer-desc {
  color: var(--text-muted);
  font-size: 0.875rem;
  max-width: 250px;
}

.footer-title {
  margin-bottom: 1.5rem;
  font-size: 1rem;
  color: var(--text-dark);
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-links li {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.footer-links a:hover {
  color: var(--primary-color);
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-icon {
  width: 36px;
  height: 36px;
  background-color: var(--primary-color-soft);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.75rem;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background-color: var(--primary-color);
  color: var(--white);
  transform: translateY(-3px);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(84, 24, 193, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.legal-links {
  display: flex;
  gap: 2rem;
}

@media (max-width: 576px) {
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
