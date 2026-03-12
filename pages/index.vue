<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { useRuntimeConfig } from '#imports'

// Componenti modulari
import HeroSection from '~/components/home/HeroSection.vue'
import FeaturedVehicles from '~/components/home/FeaturedVehicles.vue'
import PortalCTA from '~/components/home/PortalCTA.vue'
import QuoteSection from '~/components/home/QuoteSection.vue'
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
    const res = await $fetch('/api/motos')
    vehicles.value = Array.isArray(res.motos) ? res.motos : []
  } catch (e) {
    console.error('Errore nel caricamento:', e)
    error.value = true
  } finally {
    loading.value = false
  }
}

fetchVehicles()
</script>

<template>
  <div>
    <!-- Hero dinamico -->
    <HeroSection
      badge="Concessionaria moto e scooter a Capodrise"
      title="La tua concessionaria di riferimento"
      subtitle="Vendita plurimarche, assistenza qualificata e ricambi originali"
    />

    <!-- Featured Vehicles dinamico -->
    <FeaturedVehicles :vehicles="vehicles" />

    <!-- Portal CTA -->
    <PortalCTA />

    <!-- Quote Section -->
    <QuoteSection />

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