<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import PremiumHeader from '~/components/layout/PremiumHeader.vue'

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
    <!-- Header Standard Minimale -->
    <header class="minimal-header">
      <div class="container header-content">
        <NuxtLink to="/" class="minimal-logo">
          <img src="/logo-road-runner.jpg" alt="Logo" />
          <span>ROAD RUNNER</span>
        </NuxtLink>
        <nav class="minimal-nav">
          <NuxtLink to="/#moto">Veicoli</NuxtLink>
          <NuxtLink to="/#servizi">Servizi</NuxtLink>
          <NuxtLink to="/blog">Blog</NuxtLink>
          <NuxtLink to="/#contatti">Contatti</NuxtLink>
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
  padding: 1rem 0;
  z-index: 1000;
  background: transparent;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.minimal-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #fff;
  font-weight: 900;
  font-size: 1.2rem;
}

.minimal-logo img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.minimal-nav {
  display: flex;
  gap: 1.5rem;
}

.minimal-nav a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  transition: color 0.3s;
}

.minimal-nav a:hover {
  color: #fff;
}

.main-content {
  min-height: 100vh;
}

@media (max-width: 768px) {
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