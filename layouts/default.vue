<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'

const mobileMenuOpen = ref(false)

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

let ctx

onMounted(async () => {
  await nextTick()
  ctx = gsap.context(() => {
    // Animazione degli elementi interni (senza far muovere l'intero header)
    const navElements = document.querySelectorAll('.brand, .main-nav a, .btn-primary-custom, .mobile-toggle')
    if (navElements.length > 0) {
      gsap.from(navElements, {
        y: -30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        delay: 0.2,
        ease: 'expo.out'
      })
    }
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <div class="page-shell">
    <!-- Header -->
    <header class="site-header">
      <div class="container nav-shell">
        <NuxtLink to="/" class="brand" aria-label="Road Runner Moto home">
          <div class="logo-wrapper">
            <img src="/logo-road-runner.jpg" alt="Road Runner Moto logo" class="brand-logo" />
          </div>
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
  background: rgba(5, 5, 5, 0.95);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--line);
  padding-top: 0; /* Rimosso per alzare tutto al limite */
}

.nav-shell {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 5px 5px 20px; /* Ridotto ulteriormente padding a destra (5px) */
}

.brand {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 0; /* Rimosso margine per alzare al massimo */
}

.logo-wrapper {
  height: 90px; /* Ridotto leggermente per mobile per evitare deformazioni */
  width: 90px;
  flex-shrink: 0; /* Impedisce al cerchio di schiacciarsi */
  border-radius: 50%;
  background: white;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px; /* Ridotto gap su mobile */
  margin-top: 0;
  flex-shrink: 0;
  min-width: 0; /* Previene overflow */
}

.brand-logo {
  height: 100%;
  width: 100%;
  object-fit: cover;
  flex-shrink: 0;
  transform: scale(1.4);
}

@media (min-width: 1024px) {
  .logo-wrapper {
    height: 140px;
    width: 140px;
  }
  .brand {
    gap: 24px;
  }
}

.brand-copy {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centra orizzontalmente le scritte */
  text-align: center;
  line-height: 1;
}

.brand-name {
  font-weight: 950;
  font-size: 1.4rem; /* Leggermente più piccola su mobile per far stare tutto */
  letter-spacing: -0.01em;
}

.brand-tagline {
  font-size: 0.9rem; /* Leggermente più piccola su mobile */
  color: var(--primary-2);
  font-weight: 900;
  letter-spacing: 0.35em;
}

@media (min-width: 1024px) {
  .brand-name {
    font-size: 1.8rem;
  }
  .brand-tagline {
    font-size: 1.2rem;
  }
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
    font-size: 1.1rem; /* Ingrandito da 0.9rem */
    font-weight: 700; /* Più bold */
    color: var(--muted);
    transition: color var(--transition);
  }
  
  .main-nav a:hover {
    color: var(--text);
  }
}

.portal-link {
  font-size: 1.1rem; /* Ingrandito da 0.9rem */
  font-weight: 800;
  color: var(--primary-2) !important;
  background: rgba(215, 24, 42, 0.1);
  padding: 10px 20px; /* Aumentato padding */
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
  justify-content: center;
  align-items: center;
  gap: 6px;
  background: var(--primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0;
  width: 46px;
  height: 46px;
  cursor: pointer;
  z-index: 2000;
  border-radius: 12px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 8px 25px rgba(215, 24, 42, 0.5);
}

.mobile-toggle:active {
  transform: scale(0.9);
}

@media (min-width: 1024px) {
  .mobile-toggle {
    display: none;
  }
}

.mobile-toggle span {
  display: block;
  width: 26px;
  height: 3px;
  background: #ffffff;
  border-radius: 4px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
              opacity 0.3s ease,
              background-color 0.3s ease;
}

[aria-expanded="true"].mobile-toggle {
  background: #222;
  border-color: var(--primary-2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
}

/* Animazione toggle quando aperto */
[aria-expanded="true"].mobile-toggle span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}
[aria-expanded="true"].mobile-toggle span:nth-child(2) {
  opacity: 0;
  transform: translateX(-10px);
}
[aria-expanded="true"].mobile-toggle span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

.mobile-nav {
  position: fixed;
  inset: 0;
  background: #050505;
  z-index: 1050;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 110px 24px 60px; /* Ridotto il padding per l'header ora molto sottile */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  overflow-y: auto;
}

.mobile-nav-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px; /* Ridotto gap tra le voci */
  width: 100%;
}

.mobile-nav a {
  font-size: 1.5rem; /* Ridotto da 2rem */
  font-weight: 800; /* Leggermente meno bold */
  color: #ffffff;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  transition: color 0.3s ease;
}

.mobile-nav a:hover {
  color: var(--primary-2);
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