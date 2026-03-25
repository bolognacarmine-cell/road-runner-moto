<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { useRuntimeConfig } from '#imports'

// Componenti modulari
import HeroSection from '~/components/home/HeroSection.vue'
import AboutSection from '~/components/home/AboutSection.vue'
import FeaturedVehicles from '~/components/home/FeaturedVehicles.vue'
import TradeInSection from '~/components/home/TradeInSection.vue'
import LifestyleSection from '~/components/home/LifestyleSection.vue'
import ServiceSection from '~/components/home/ServiceSection.vue'
import PortalCTA from '~/components/home/PortalCTA.vue'
import QuoteSection from '~/components/home/QuoteSection.vue'
import BrandsSection from '~/components/home/BrandsSection.vue'
import CTABand from '~/components/home/CTABand.vue'
import BlogPreviewSection from '~/components/home/BlogPreviewSection.vue'
import ContactSection from '~/components/home/ContactSection.vue'

// Config runtime
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'http://localhost:3000'
const apiBase = config.public.apiBase || 'http://localhost:3001'

// SEO Avanzata & Dati Strutturati
useHead({
  htmlAttrs: { lang: 'it' },
  title: 'Road Runner Moto | Concessionaria Moto Nuove & Usate a Capodrise (CE)',
  meta: [
    { name: 'description', content: 'Road Runner di Tartaglione Pasquale: la tua concessionaria di fiducia a Capodrise per moto e scooter nuovi e usati. Assistenza tecnica, finanziamenti personalizzati e permute garantite.' },
    { name: 'keywords', content: 'concessionaria moto capodrise, moto usate caserta, scooter nuovi caserta, assistenza moto capodrise, finanziamenti moto, permuta moto usato' },
    { name: 'robots', content: 'index,follow' },
    { name: 'author', content: 'Road Runner Moto' },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Road Runner Moto | Concessionaria Moto Nuove & Usate a Capodrise' },
    { property: 'og:description', content: 'Vieni a scoprire la nostra gamma di moto e scooter. Qualità, professionalità e assistenza dedicata a Capodrise.' },
    { property: 'og:url', content: siteUrl },
    { property: 'og:image', content: `${siteUrl}/logo-road-runner.jpg` },
    { property: 'og:site_name', content: 'Road Runner Moto' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Road Runner Moto | Concessionaria Moto Nuove & Usate' },
    { name: 'twitter:description', content: 'Moto e scooter nuovi e usati a Capodrise. Assistenza e finanziamenti personalizzati.' },
    { name: 'twitter:image', content: `${siteUrl}/logo-road-runner.jpg` }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AutoDealer",
        "name": "Road Runner Moto",
        "image": `${siteUrl}/logo-road-runner.jpg`,
        "@id": siteUrl,
        "url": siteUrl,
        "telephone": "+390823516087",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Via San Francesco 13",
          "addressLocality": "Capodrise",
          "postalCode": "81020",
          "addressRegion": "CE",
          "addressCountry": "IT"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 41.0425,
          "longitude": 14.3056
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "19:30"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Saturday",
            "opens": "09:00",
            "closes": "13:00"
          }
        ],
        "sameAs": [
          "https://www.facebook.com/roadrunnermoto",
          "https://www.instagram.com/roadrunnermoto"
        ]
      })
    }
  ]
})

// Stato dei veicoli
const vehicles = ref([])
const selectedBrand = ref(null)
const loading = ref(true)
const error = ref(false)

// Filtraggio veicoli per brand
const filteredVehicles = computed(() => {
  let list = vehicles.value
  
  // Escludi i veicoli venduti dallo showroom pubblico
  list = list.filter(v => !v.venduta)
  
  if (!selectedBrand.value) return list
  return list.filter(v => 
    v.marca && v.marca.toLowerCase() === selectedBrand.value.toLowerCase()
  )
})

const handleBrandSelect = (brandName) => {
  if (selectedBrand.value === brandName) {
    selectedBrand.value = null // Deseleziona se già attivo
  } else {
    selectedBrand.value = brandName
    // Scroll fluido alla sezione veicoli per mostrare il risultato
    const el = document.getElementById('moto')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
}

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
      title="Dove la qualità incontra la strada"
      subtitle="Vendita plurimarche, finanziamenti su misura e assistenza specializzata"
    />

    <!-- About Section -->
    <AboutSection />

    <BrandsSection 
      :selected-brand="selectedBrand" 
      @select-brand="handleBrandSelect" 
    />

    <!-- Featured Vehicles dinamico (Nuovo & Usato incorporati) -->
    <FeaturedVehicles 
      id="moto"
      :vehicles="filteredVehicles" 
      :loading="loading" 
      :error="error" 
    />

    <!-- Lifestyle (Accessori & Mondo Biker) -->
    <LifestyleSection />

    <!-- Trade-In (Permute) Section -->
    <TradeInSection />

    <!-- Service & Support (Officina & Finanziamenti) -->
    <ServiceSection />

    <!-- Portal CTA -->
    <PortalCTA />

    <!-- Quote Section -->
    <QuoteSection :vehicles="vehicles" />

    <!-- CTA Band -->
    <CTABand />

    <!-- Blog Preview dinamico -->
    <BlogPreviewSection />

    <!-- Contact Section -->
    <ContactSection />

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