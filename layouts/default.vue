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
      <div v-if="mobileMenuOpen" class="mobile-nav">
        <a href="#moto" @click="mobileMenuOpen = false">Veicoli</a>
        <a href="#servizi" @click="mobileMenuOpen = false">Servizi</a>
        <a href="#marchi" @click="mobileMenuOpen = false">Marchi</a>
        <a href="#contatti" @click="mobileMenuOpen = false">Contatti</a>
        <NuxtLink to="/moto" class="btn-primary-custom mobile-cta" @click="mobileMenuOpen = false">
          Catalogo
        </NuxtLink>
      </div>
    </header>

    <!-- Main content -->
    <main>
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
    </footer>
  </div>
</template>