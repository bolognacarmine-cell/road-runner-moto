<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { useRuntimeConfig } from '#imports'

// Componenti modulari
import HeroSection from '~/components/home/HeroSection.vue'
import IntroStrip from '~/components/home/IntroStrip.vue'
import FeaturedVehicles from '~/components/home/FeaturedVehicles.vue'
import ServicesSection from '~/components/home/ServicesSection.vue'
import BrandsSection from '~/components/home/BrandsSection.vue'
import CTABand from '~/components/home/CTABand.vue'
import ContactSection from '~/components/home/ContactSection.vue'

// Config runtime
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'http://localhost:3000'
const apiBase = config.public.apiBase || 'http://localhost:3001'

// SEO
useHead({
  htmlAttrs: { lang: 'it' },
  title: 'Road Runner Moto | Moto e scooter nuovi e usati a Capodrise',
  meta: [
    { name: 'description', content: 'Road Runner è concessionaria moto e scooter a Capodrise, plurimarche con assistenza qualificata e ricambi originali.' },
    { name: 'robots', content: 'index,follow' },
    { property: 'og:title', content: 'Road Runner Moto | Concessionaria moto e scooter a Capodrise' },
    { property: 'og:description', content: 'Moto e scooter nuovi e usati plurimarche, assistenza qualificata e ricambi originali a Capodrise.' },
    { property: 'og:url', content: siteUrl },
    { property: 'og:image', content: `${siteUrl}/logo-road-runner.jpg` }
  ]
})

// Stato dei veicoli
const vehicles = ref([])
const loading = ref(true)
const error = ref(false)

// Recupero veicoli dal backend
const fetchVehicles = async () => {
  try {
    const res = await fetch(`${apiBase}/veicoli`)
    if (!res.ok) throw new Error('Errore nel caricamento')
    const data = await res.json()
    vehicles.value = Array.isArray(data) ? data.filter(v => v.tipo === 'moto') : []
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}

fetchVehicles()

// Animazioni GSAP per Hero + FeaturedVehicles + Benefits
onMounted(async () => {
  await nextTick()
  const ctx = gsap.context(() => {
    gsap.from('.hero-badge', { y: 20, opacity: 0, duration: 0.7 })
    gsap.from('.hero-title', { y: 40, opacity: 0, duration: 0.9, delay: 0.15 })
    gsap.from('.hero-subtitle, .hero-actions', {
      y: 24,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      delay: 0.35
    })
    gsap.from('.featured-grid .moto-card', { y: 28, opacity: 0, duration: 0.7, stagger: 0.12, delay: 0.2 })
    gsap.from('.benefits-grid .benefit-card', { y: 28, opacity: 0, duration: 0.7, stagger: 0.12, delay: 0.2 })
  })
  onUnmounted(() => ctx.revert())
})
</script>

<template>
  <div class="page-shell">
    <!-- Hero dinamico -->
    <HeroSection
      badge="Concessionaria moto e scooter a Capodrise"
      title="La tua concessionaria di riferimento"
      subtitle="Vendita plurimarche, assistenza qualificata e ricambi originali"
    />

    <!-- Intro Strip -->
    <IntroStrip />

    <!-- Featured Vehicles dinamico -->
    <FeaturedVehicles :vehicles="vehicles" />

    <!-- Services Section -->
    <ServicesSection />

    <!-- Brands Section -->
    <BrandsSection />

    <!-- CTA Band -->
    <CTABand />

    <!-- Contact Section -->
    <ContactSection />

    <!-- Stato caricamento / errore -->
    <div v-if="loading" class="state-box">Caricamento veicoli...</div>
    <div v-else-if="error" class="state-box error">Impossibile caricare i veicoli.</div>
  </div>
</template>

<style scoped>
.page-shell {
  background: #050505;
  color: #f5f5f5;
  min-height: 100vh;
}

.state-box {
  text-align: center;
  padding: 24px;
  margin: 24px auto;
  border-radius: 16px;
  background: #111;
  color: #fff;
}

.state-box.error {
  border: 1px solid #ff5b6b;
}
</style>