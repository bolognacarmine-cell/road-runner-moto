<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { useSearch } from '~/composables/useSearch'

const { setSearchQuery } = useSearch()

const setFilter = (filter) => {
  // Se siamo nella home, scrolliamo alla sezione moto e impostiamo il filtro
  // Nota: FeaturedVehicles.vue dovrà essere aggiornato per reagire a questi click se necessario
  // Per ora impostiamo solo la query di ricerca o usiamo un evento globale se serve
}

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
      gsap.fromTo(navElements, 
        { y: -30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          delay: 0.2,
          ease: 'expo.out',
          clearProps: 'all'
        }
      )
    }
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <div class="page-shell">
    <!-- Header Standard Minimale -->
    <header class="minimal-header">
      <div class="container header-content">
        <NuxtLink to="/" class="minimal-logo">
          <div class="logo-box">
            <img src="/logo-road-runner.jpg" alt="Logo" />
          </div>
          <div class="brand-info">
            <span class="brand-title">ROAD RUNNER</span>
            <span class="brand-subtitle">Concessionaria Moto Nuove & Usate</span>
          </div>
        </NuxtLink>
        <nav class="minimal-nav">
          <NuxtLink to="/#chi-samo">Chi Siamo</NuxtLink>
          <NuxtLink to="/#moto" @click="setFilter('nuovo')">Nuovo</NuxtLink>
          <NuxtLink to="/#moto" @click="setFilter('usato')">Usato</NuxtLink>
          <NuxtLink to="/#moto" @click="setFilter('promozioni')">Promozioni</NuxtLink>
          <NuxtLink to="/#accessori">Accessori</NuxtLink>
          <NuxtLink to="/#mondo-biker">Mondo Biker</NuxtLink>
          <NuxtLink to="/#permute">Permute</NuxtLink>
          <NuxtLink to="/#assistenza">Assistenza</NuxtLink>
          <NuxtLink to="/blog">Blog</NuxtLink>
          <NuxtLink to="/#contatti">Contatti</NuxtLink>
          <NuxtLink to="/portale/login" class="portal-link-minimal">Area Clienti</NuxtLink>
        </nav>
      </div>
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
.minimal-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem 0;
  z-index: 1000;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.minimal-logo {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
}

.logo-box {
  width: 60px;
  height: 60px;
  background: #fff;
  border-radius: 50%;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  overflow: hidden;
}

.logo-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.1);
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-title {
  color: #fff;
  font-weight: 950;
  font-size: 1.5rem;
  letter-spacing: -0.02em;
  line-height: 1;
}

.brand-subtitle {
  color: var(--primary-2);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  margin-top: 4px;
}

.minimal-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.minimal-nav a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 700;
  transition: all 0.3s;
}

.minimal-nav a:hover {
  color: var(--primary-2);
  transform: translateY(-1px);
}

.portal-link-minimal {
  background: rgba(225, 29, 72, 0.15);
  padding: 8px 18px;
  border-radius: 100px;
  border: 1px solid rgba(225, 29, 72, 0.3);
  color: var(--primary-2) !important;
}

.portal-link-minimal:hover {
  background: var(--primary-2);
  color: #fff !important;
}

.main-content {
  min-height: 100vh;
}

@media (max-width: 1100px) {
  .minimal-nav {
    gap: 1rem;
  }
  .brand-subtitle {
    display: none;
  }
}

@media (max-width: 850px) {
  .minimal-nav {
    display: none;
  }
}

/* Header Styles Rimossi in favore di PremiumHeader.vue */

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