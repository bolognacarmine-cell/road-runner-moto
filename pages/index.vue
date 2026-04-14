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
import SecuritySection from '~/components/home/SecuritySection.vue'
import HelmetsSection from '~/components/home/HelmetsSection.vue'
import CTABand from '~/components/home/CTABand.vue'
import BlogPreviewSection from '~/components/home/BlogPreviewSection.vue'
import ReviewsSlider from '~/components/home/ReviewsSlider.vue'
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
    { name: 'description', content: 'Road Runner Moto Capodrise: moto nuove/usate Honda Piaggio Kymco. Finanziamenti, caschi LS2, localizzatori GPS. Offerte imperdibili! Visita showroom CE' },
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
        "@id": "https://www.google.com/maps/place/?q=place_id:ChIJgUbEo8cfqokR5lP9_Wh_DaM",
        "url": siteUrl,
        "telephone": "+390823516087",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Via Retella 65",
          "addressLocality": "Capodrise",
          "postalCode": "81020",
          "addressRegion": "CE",
          "addressCountry": "IT"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "125"
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
            "closes": "19:00"
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
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Qual è la miglior concessionaria moto a Caserta?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Road Runner Moto è considerata una delle migliori concessionarie a Caserta e provincia (Capodrise), grazie a oltre 20 anni di esperienza, showroom plurimarche Honda, Piaggio, Kymco e un servizio di assistenza tecnica specializzata post-vendita."
            }
          },
          {
            "@type": "Question",
            "name": "Dove trovare moto usate vicino Napoli e Caserta?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A Capodrise (CE), Road Runner Moto offre un vasto assortimento di moto usate garantite e controllate. Situata in posizione strategica vicino a Caserta e facilmente raggiungibile da Napoli, propone permute flessibili e finanziamenti su misura."
            }
          },
          {
            "@type": "Question",
            "name": "Road Runner Moto offre finanziamenti per l'acquisto?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sì, Road Runner Moto collabora con Compass (Gruppo Mediobanca) per offrire finanziamenti personalizzati e veloci su tutta la gamma di moto nuove e usate, permettendo acquisti leggeri con rate su misura."
            }
          }
        ]
      })
    }
  ]
})

// Stato dei veicoli
const selectedBrand = ref(null)
const loading = ref(true)
const error = ref(false)

// Filtraggio veicoli per brand
const filteredVehicles = computed(() => {
  let list = vehicles.value
  
  // Escludi SOLO i veicoli impostati come privati (Nascosti)
  list = list.filter(v => v.isVisible !== false)
  
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

// Recupero veicoli dal backend con useAsyncData per evitare hydration mismatch
const { data: motosData, error: fetchError } = await useAsyncData('motos', () => $fetch('/api/motos'), {
  transform: (res) => {
    return Array.isArray(res.motos) ? res.motos : []
  }
})

// vehicles sarà reattivo a motosData.value
const vehicles = computed(() => motosData.value || [])

onMounted(() => {
  if (fetchError.value) {
    error.value = true
  }
  loading.value = false
})
</script>

<template>
  <div>
    <!-- Hero dinamico -->
    <HeroSection
      badge="Concessionaria moto e scooter a Capodrise"
      title="Dove la qualità incontra la strada"
      subtitle="Vendita plurimarche, finanziamenti su misura e assistenza specializzata"
    />

    <!-- Striscia icone info -->
    <LazyIntroStrip />

    <!-- Featured Vehicles dinamico (Nuovo & Usato incorporati) -->
    <LazyFeaturedVehicles 
      id="moto"
      :vehicles="filteredVehicles" 
      :loading="loading" 
      :error="error" 
    />

    <LazyBrandsSection 
      :selected-brand="selectedBrand" 
      @select-brand="handleBrandSelect" 
    />

    <!-- About Section (La Nostra Storia) -->
    <LazyAboutSection />

    <!-- Lifestyle (Vivi la tua passione al massimo) -->
    <LazyLifestyleSection />

    <!-- Helmets Section (Protezione e Stile - Caschi Protettivi) -->
    <LazyHelmetsSection />

    <!-- Security Section (Protezione Avanzata) -->
    <LazySecuritySection />

    <!-- Trade-In (Permute) Section -->
    <LazyTradeInSection />

    <!-- Service & Support (Officina & Finanziamenti) -->
    <LazyServiceSection />

    <!-- Portal CTA -->
    <LazyPortalCTA />

    <!-- Quote Section -->
    <LazyQuoteSection :vehicles="vehicles" />

    <!-- CTA Band -->
    <LazyCTABand />

    <!-- Blog Preview dinamico -->
    <LazyBlogPreviewSection id="blog" />

    <!-- Reviews Slider -->
    <LazyReviewsSlider id="recensioni" />

    <!-- Contact Section -->
    <LazyContactSection id="contatti" />

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