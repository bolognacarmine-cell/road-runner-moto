<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'

const mobileMenuOpen = ref(false)

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

onMounted(async () => {
  await nextTick()
  // Animazione d'ingresso header
  const header = document.querySelector('.site-header')
  if (header) {
    gsap.from(header, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power4.out'
    })
  }
  
  const navElements = document.querySelectorAll('.brand, .main-nav a, .btn-primary-custom')
  if (navElements.length > 0) {
    gsap.from(navElements, {
      y: -20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      delay: 0.4,
      ease: 'power2.out'
    })
  }
})
</script>

<template>
  <div class="page-shell">
    <!-- Header -->
    <header class="site-header">
      <div class="container nav-shell">
        <NuxtLink to="/" class="brand" aria-label="Road Runner Moto home">
          <img src="/logo-road-runner.jpg" alt="Road Runner Moto logo" class="brand-logo" />
          <div class="brand-copy">
            <span class="brand-name">ROAD RUNNER</span>
            <span class="brand-tagline">MOTO</span>
          </div>
        </NuxtLink>

        <!-- Desktop nav -->
        <nav class="main-nav">
          <a href="#moto">Veicoli</a>
          <a href="#servizi">Servizi</a>
          <a href="#marchi">Marchi</a>
          <a href="#contatti">Contatti</a>
          <NuxtLink to="/portale/login" class="portal-link">Area Clienti</NuxtLink>
          <NuxtLink to="/moto" class="btn-primary-custom">Catalogo</NuxtLink>
        </nav>

        <!-- Mobile toggle -->
        <button
          class="mobile-toggle"
          :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
          aria-label="Apri menu"
          @click="toggleMenu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <!-- Mobile nav -->
      <Transition name="fade">
        <div v-if="mobileMenuOpen" class="mobile-nav">
          <div class="mobile-nav-content">
            <a href="#moto" @click="mobileMenuOpen = false">Veicoli</a>
            <a href="#servizi" @click="mobileMenuOpen = false">Servizi</a>
            <a href="#marchi" @click="mobileMenuOpen = false">Marchi</a>
            <a href="#contatti" @click="mobileMenuOpen = false">Contatti</a>
            <NuxtLink to="/portale/login" class="portal-mobile-link" @click="mobileMenuOpen = false">
              Area Clienti 🔑
            </NuxtLink>
            <NuxtLink to="/moto" class="btn-primary-custom mobile-cta" @click="mobileMenuOpen = false">
              Catalogo
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Main content -->
    <main class="main-content">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <strong>Road Runner Moto</strong>
          <p>Concessionaria moto e scooter a Capodrise.</p>
        </div>
        <div>
          <strong>Contatti</strong>
          <p>0823 516087</p>
          <p>+39 339 158 1997</p>
          <p>inforoadrunner@libero.it</p>
        </div>
        <div>
          <strong>Sede</strong>
          <p>Via Retella 65</p>
          <p>Capodrise (CE)</p>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>&copy; 2026 Road Runner Moto. Tutti i diritti riservati.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.main-content {
  padding-top: var(--header-h);
}

@media (min-width: 1024px) {
  .main-content {
    padding-top: 100px;
  }
}

.site-header {
  height: auto;
}

.nav-shell {
  max-width: 1400px;
  margin: 0 auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  height: 60px;
  width: auto;
  border-radius: 10px;
}

@media (min-width: 1024px) {
  .brand-logo {
    height: 70px;
  }
}

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.brand-name {
  font-weight: 900;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
}

.brand-tagline {
  font-size: 0.8rem;
  color: var(--primary-2);
  font-weight: 800;
  letter-spacing: 0.25em;
}

.main-nav {
  display: none;
}

@media (min-width: 1024px) {
  .main-nav {
    display: flex;
    align-items: center;
    gap: 32px;
  }
  
  .main-nav a {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--muted);
    transition: color var(--transition);
  }
  
  .main-nav a:hover {
    color: var(--text);
  }
}

.portal-link {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary-2) !important;
  background: rgba(215, 24, 42, 0.1);
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(215, 24, 42, 0.2);
}

.portal-link:hover {
  background: rgba(215, 24, 42, 0.2);
}

.portal-mobile-link {
  font-size: 1.25rem !important;
  font-weight: 800;
  color: var(--primary-2) !important;
  margin: 10px 0;
}

.mobile-toggle {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1100;
}

@media (min-width: 1024px) {
  .mobile-toggle {
    display: none;
  }
}

.mobile-toggle span {
  display: block;
  width: 32px;
  height: 3px;
  background: #fff;
  border-radius: 4px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Animazione toggle quando aperto */
[aria-expanded="true"].mobile-toggle span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}
[aria-expanded="true"].mobile-toggle span:nth-child(2) {
  opacity: 0;
}
[aria-expanded="true"].mobile-toggle span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

.mobile-nav {
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 5, 0.98);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.mobile-nav-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.mobile-nav a {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text);
  padding: 10px;
}

.mobile-cta {
  margin-top: 20px;
  width: 100%;
  max-width: 280px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.site-footer {
  padding: 80px 0 40px;
  background: #080808;
  border-top: 1px solid var(--line);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.footer-grid strong {
  display: block;
  margin-bottom: 16px;
  font-size: 1.1rem;
  color: var(--text);
}

.footer-grid p {
  color: var(--muted);
  font-size: 0.95rem;
}

.footer-bottom {
  padding-top: 40px;
  border-top: 1px solid var(--line);
  text-align: center;
  color: #555;
  font-size: 0.85rem;
}
</style>