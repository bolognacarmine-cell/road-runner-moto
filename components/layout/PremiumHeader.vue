
<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { gsap } from 'gsap'
import { useSearch } from '~/composables/useSearch'

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const { searchQuery, setSearchQuery } = useSearch()
const internalSearchQuery = ref(searchQuery.value)

// Sincronizza l'input interno con lo stato globale
watch(internalSearchQuery, (newVal) => {
  setSearchQuery(newVal)
})

// Sincronizza lo stato globale con l'input interno (es. se resettato altrove)
watch(searchQuery, (newVal) => {
  if (newVal !== internalSearchQuery.value) {
    internalSearchQuery.value = newVal
  }
})

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

let ctx
onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  await nextTick()
  
  ctx = gsap.context(() => {
    // Reveal iniziale elegante
    const elements = document.querySelectorAll('.logo-container, .search-bar-container, .nav-item, .social-links, .mobile-toggle')
    gsap.from(elements, {
      y: -20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: 'power3.out',
      delay: 0.2
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (ctx) ctx.revert()
})
</script>

<template>
  <header class="premium-header" :class="{ 'is-scrolled': isScrolled }">
    <div class="container header-inner">
      
      <!-- Logo a Sinistra -->
      <NuxtLink to="/" class="logo-container" aria-label="Road Runner Moto Home">
        <div class="logo-box">
          <img src="/logo-road-runner.jpg" alt="Road Runner Logo" class="main-logo" />
        </div>
        <div class="brand-info">
          <span class="brand-title">ROAD RUNNER</span>
          <span class="brand-subtitle">MOTO & SERVICE</span>
        </div>
      </NuxtLink>

      <!-- Barra di Ricerca Centrale -->
      <div class="search-bar-container">
        <div class="search-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            v-model="internalSearchQuery"
            type="text" 
            placeholder="Cerca modello, marca o categoria..." 
            class="search-input"
          />
        </div>
      </div>

      <!-- Menu e Social a Destra -->
      <div class="actions-container">
        <nav class="desktop-nav">
          <NuxtLink v-for="item in [
            { name: 'Veicoli', link: '/#moto' },
            { name: 'Servizi', link: '/#servizi' },
            { name: 'Contatti', link: '/#contatti' }
          ]" :key="item.name" :to="item.link" class="nav-item">
            {{ item.name }}
          </NuxtLink>
        </nav>

        <div class="social-links">
          <a href="https://facebook.com" target="_blank" class="social-icon" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="https://instagram.com" target="_blank" class="social-icon" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
        </div>

        <!-- Mobile Toggle -->
        <button class="mobile-toggle" @click="toggleMenu" :class="{ 'is-open': mobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="slide">
      <div v-if="mobileMenuOpen" class="mobile-menu-overlay">
        <nav class="mobile-nav">
          <NuxtLink to="/#moto" @click="toggleMenu">Veicoli</NuxtLink>
          <NuxtLink to="/#servizi" @click="toggleMenu">Servizi</NuxtLink>
          <NuxtLink to="/blog" @click="toggleMenu">Blog</NuxtLink>
          <NuxtLink to="/#contatti" @click="toggleMenu">Contatti</NuxtLink>
          <NuxtLink to="/portale/login" class="mobile-portal-btn" @click="toggleMenu">Area Clienti</NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.premium-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 1000;
  background: rgba(3, 3, 3, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-header.is-scrolled {
  height: 85px;
  background: rgba(5, 5, 5, 0.95);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 30px;
}

/* --- Logo Section --- */
.logo-container {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-box {
  width: 64px;
  height: 64px;
  background: #fff;
  border-radius: 50%;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  border: 2px solid var(--primary-2);
  overflow: hidden;
}

.logo-container:hover .logo-box {
  transform: scale(1.1);
  box-shadow: 0 12px 35px rgba(225, 29, 72, 0.3);
}

.main-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.2);
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-title {
  color: #fff;
  font-size: 1.4rem;
  font-weight: 950;
  letter-spacing: -0.02em;
  line-height: 1;
}

.brand-subtitle {
  color: var(--primary-2);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.25em;
  margin-top: 4px;
}

/* --- Search Bar --- */
.search-bar-container {
  flex: 1;
  max-width: 500px;
}

.search-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.3s ease;
}

.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  padding: 12px 20px 12px 50px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--primary-2);
  box-shadow: 0 0 20px rgba(225, 29, 72, 0.15);
}

.search-input:focus + .search-icon {
  color: var(--primary-2);
}

/* --- Actions & Nav --- */
.actions-container {
  display: flex;
  align-items: center;
  gap: 32px;
}

.desktop-nav {
  display: flex;
  gap: 24px;
}

.nav-item {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-2);
  transition: width 0.3s ease;
}

.nav-item:hover {
  color: #fff;
}

.nav-item:hover::after {
  width: 100%;
}

.social-links {
  display: flex;
  gap: 16px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding-left: 24px;
}

.social-icon {
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  width: 20px;
  height: 20px;
}

.social-icon:hover {
  color: var(--primary-2);
  transform: translateY(-2px);
}

/* --- Mobile Menu --- */
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.mobile-toggle span {
  display: block;
  width: 28px;
  height: 2px;
  background: #fff;
  transition: all 0.3s ease;
}

@media (max-width: 1024px) {
  .search-bar-container {
    display: none;
  }
  .desktop-nav {
    display: none;
  }
  .mobile-toggle {
    display: flex;
  }
  .social-links {
    padding-left: 0;
    border-left: none;
  }
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #050505;
  z-index: -1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.mobile-nav a {
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  text-decoration: none;
}

.mobile-portal-btn {
  background: var(--primary);
  padding: 16px 40px;
  border-radius: 100px;
  font-size: 1.125rem !important;
}

/* Animations */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from, .slide-leave-to {
  transform: translateY(-100%);
}
</style>
