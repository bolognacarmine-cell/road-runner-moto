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
    <!-- Header Premium -->
    <PremiumHeader />

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
  padding-top: 100px; /* Spazio per l'header fisso */
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 90px;
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