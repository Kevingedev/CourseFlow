<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Languages } from '@lucide/vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useI18n, type LocaleCode } from '@/i18n'
import logoUrl from '../assets/logo.svg'

const isMenuOpen = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const { locale, localeOptions, setLocale, t } = useI18n()

const isLangDropdownOpen = ref(false)
const langMenuTop = ref(0)
const langMenuLeft = ref(0)

const currentLocaleShort = computed(() => {
  const opt = localeOptions.find((o) => o.code === locale.value)
  return opt?.shortLabel ?? 'ES'
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'home' })
  isMenuOpen.value = false
}

const toggleLangDropdown = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  langMenuTop.value = rect.bottom + 4
  langMenuLeft.value = Math.max(8, rect.right - 180)
  isLangDropdownOpen.value = !isLangDropdownOpen.value
}

const closeLangDropdown = () => {
  isLangDropdownOpen.value = false
}

const handleLangClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.language-dropdown') && !target.closest('.lang-dropdown-menu')) {
    closeLangDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleLangClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleLangClickOutside)
})
</script>

<template>
  <nav class="navbar glass-card">
    <div class="navbar-content">
      <router-link to="/" class="logo">
        <img :src="logoUrl" alt="CourseFlow Logo" class="navbar-logo" />
      </router-link>

      <!-- Desktop Links -->
      <div class="nav-links-desktop">
        <router-link to="/about" class="nav-link">{{ t('nav.about') }}</router-link>
        <router-link to="/courses" class="nav-link">{{ t('nav.courses') }}</router-link>
        <router-link to="/contact" class="nav-link">{{ t('nav.contact') }}</router-link>
        <router-link
          v-if="authStore.isAdminOrSuadmin"
          to="/admin/dashboard"
          class="nav-link admin-link"
        >
          {{ t('nav.admin') }}
        </router-link>

        <div class="language-dropdown">
          <button
            type="button"
            class="language-dropdown-trigger"
            :aria-label="t('nav.language')"
            @click="toggleLangDropdown"
          >
            <Languages :size="16" aria-hidden="true" />
            <span class="lang-label">{{ currentLocaleShort }}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="chevron"
              :class="{ open: isLangDropdownOpen }"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <Teleport to="body">
            <Transition name="dropdown">
              <div
                v-if="isLangDropdownOpen"
                class="lang-dropdown-menu"
                :style="{ top: langMenuTop + 'px', left: langMenuLeft + 'px' }"
                @click.stop
              >
                <button
                  v-for="option in localeOptions"
                  :key="option.code"
                  type="button"
                  class="lang-dropdown-item"
                  :class="{ active: option.code === locale }"
                  @click="setLocale(option.code as LocaleCode)"
                >
                  <svg
                    v-if="option.code === locale"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span v-else class="check-spacer"></span>
                  {{ option.label }}
                </button>
              </div>
            </Transition>
          </Teleport>
        </div>

        <template v-if="authStore.isAuthenticated">
          <span class="user-greeting">{{
            t('nav.greeting', { name: authStore.user?.fullName || '' })
          }}</span>
          <button class="btn-logout" @click="handleLogout">{{ t('nav.logout') }}</button>
        </template>
        <template v-else>
          <router-link to="/login" class="btn-primary">{{ t('nav.login') }}</router-link>
        </template>
      </div>

      <!-- Mobile Toggle -->
      <button class="mobile-toggle" @click="toggleMenu">
        <svg
          v-if="!isMenuOpen"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg
          v-else
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="slide">
      <div v-if="isMenuOpen" class="mobile-menu">
        <router-link to="/about" class="mobile-link" @click="isMenuOpen = false">{{
          t('nav.about')
        }}</router-link>
        <router-link to="/courses" class="mobile-link" @click="isMenuOpen = false">{{
          t('nav.courses')
        }}</router-link>
        <router-link to="/contact" class="mobile-link" @click="isMenuOpen = false">{{
          t('nav.contact')
        }}</router-link>
        <router-link
          v-if="authStore.isAdminOrSuadmin"
          to="/admin/dashboard"
          class="mobile-link admin-link"
          @click="isMenuOpen = false"
        >
          {{ t('nav.admin') }}
        </router-link>

        <div class="mobile-language-select">
          <span>{{ t('nav.language') }}</span>
          <div class="mobile-lang-options">
            <button
              v-for="option in localeOptions"
              :key="option.code"
              type="button"
              class="mobile-lang-btn"
              :class="{ active: option.code === locale }"
              @click="setLocale(option.code)"
            >
              <svg
                v-if="option.code === locale"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span v-else class="check-spacer"></span>
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="mobile-divider"></div>

        <template v-if="authStore.isAuthenticated">
          <div class="mobile-user-greeting">
            {{ t('nav.greeting', { name: authStore.user?.fullName || '' }) }}
          </div>
          <button class="btn-logout w-full" @click="handleLogout">{{ t('nav.logout') }}</button>
        </template>
        <template v-else>
          <router-link
            to="/login"
            class="btn-primary w-full text-center"
            @click="isMenuOpen = false"
            >{{ t('nav.login') }}</router-link
          >
        </template>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navbar-logo {
  height: 52px;
  width: auto;
  object-fit: contain;
}

.nav-links-desktop {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.language-dropdown {
  position: relative;
  display: inline-flex;
}

.language-dropdown-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  color: var(--text-muted);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-dropdown-trigger:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(67, 17, 185, 0.04);
}

.lang-label {
  min-width: 22px;
  text-align: center;
}

.chevron {
  transition: transform 0.2s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

/* Dropdown menu (teleported) */
.lang-dropdown-menu {
  position: fixed;
  z-index: 9999;
  min-width: 160px;
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 0.35rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lang-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-dark);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  font-family: inherit;
}

.lang-dropdown-item:hover {
  background: rgba(67, 17, 185, 0.06);
  color: var(--primary-color);
}

.lang-dropdown-item.active {
  color: var(--primary-color);
  font-weight: 600;
}

.check-spacer {
  width: 16px;
  height: 16px;
}

/* Dropdown transition */
.dropdown-enter-active {
  animation: dropIn 0.15s ease;
}

.dropdown-leave-active {
  animation: dropIn 0.1s ease reverse;
}

@keyframes dropIn {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.admin-link {
  color: var(--primary-color);
  font-weight: 600;
}

.user-greeting {
  font-weight: 500;
  color: var(--text-dark);
  font-size: 0.95rem;
}

.btn-logout {
  background-color: var(--secondary-color-soft);
  color: var(--secondary-color);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid rgba(236, 86, 32, 0.2);
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background-color: var(--secondary-color);
  color: var(--white);
  transform: translateY(-1px);
}

.text-center {
  text-align: center;
}

@media (max-width: 768px) {
  .nav-links-desktop {
    display: none;
  }
}

.mobile-toggle {
  display: none;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .mobile-toggle {
    display: block;
  }
}

.mobile-menu {
  position: absolute;
  top: var(--navbar-height);
  left: 0;
  width: 100%;
  background-color: var(--white);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid var(--border-color);
}

.mobile-link {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-dark);
}

.mobile-language-select {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 100%;
}

.mobile-language-select > span {
  font-weight: 600;
  color: var(--text-muted);
  font-size: 0.88rem;
}

.mobile-lang-options {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: rgba(67, 17, 185, 0.03);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.25rem;
}

.mobile-lang-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-dark);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  width: 100%;
  text-align: left;
}

.mobile-lang-btn:hover {
  background: rgba(67, 17, 185, 0.06);
  color: var(--primary-color);
}

.mobile-lang-btn.active {
  color: var(--primary-color);
  font-weight: 600;
  background: rgba(67, 17, 185, 0.06);
}

.mobile-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 0.5rem 0;
}

.mobile-user-greeting {
  font-weight: 600;
  color: var(--text-dark);
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.w-full {
  width: 100%;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
