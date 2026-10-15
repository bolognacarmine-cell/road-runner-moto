
<script setup lang="ts">
import { ref } from 'vue'
import FeaturedVehicles from '~/components/home/FeaturedVehicles.vue'

// SSR data fetching — il catalogo è visibile ai crawler
const { data: vehiclesData, pending: loading, error: fetchError } = await useAsyncData(
  'motos-catalog',
  () => $fetch('/api/motos'),
  {
    transform: (res: any) => Array.isArray(res.motos) ? res.motos : []
  }
)

const vehicles = computed(() => vehiclesData.value || [])
const error = computed(() => !!fetchError.value)

useHead({
  title: 'Catalogo Veicoli | Road Runner Moto',
  meta: [
    { name: 'description', content: 'Catalogo moto usate e scooter a Capodrise (CE). Honda, Piaggio, Kymco, motomorini e altre marche. Usato plurimarche garantito con controlli tecnici. Finanziamenti Compass e permute.' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Dove posso comprare moto usate garantite a Caserta?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Da Road Runner Moto a Capodrise (CE), trovi una vasta selezione di moto usate garantite di ogni marca (Honda, Piaggio, Kymco, etc.). Ogni veicolo è sottoposto a rigidi controlli tecnici prima della vendita."
            }
          },
          {
            "@type": "Question",
            "name": "Posso permutare la mia vecchia moto per un usato?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Certamente! Road Runner Moto accetta permute flessibili sia sull'acquisto di moto nuove che usate in stock. Contattaci per una valutazione rapida della tua moto attuale."
            }
          }
        ]
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": vehicles.value.map((moto, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Vehicle",
            "name": `${moto.marca} ${moto.modello}`,
            "url": `https://road-runner.it/moto/${moto._id}`,
            "image": moto.immagini?.[0] || '/logo-road-runner.jpg',
            "offers": {
              "@type": "Offer",
              "price": moto.prezzo || 0,
              "priceCurrency": "EUR",
              "availability": moto.stato === 'disponibile' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
            }
          }
        }))
      })
    }
  ]
})
</script>

<template>
  <div class="catalog-page">
    <div class="catalog-hero">
      <div class="container">
        <h1>Catalogo Veicoli</h1>
        <p>Tutte le nostre moto e scooter pronti per te</p>
        
        <!-- AEO Direct Response Paragraph -->
        <div class="aeo-direct-response mt-8 max-w-3xl mx-auto p-4 bg-white/5 border-t border-primary-2 rounded-lg text-left">
          <p class="text-sm italic text-muted mb-2">Informazioni per chi cerca moto usate vicino Napoli e Caserta:</p>
          <p class="text-md leading-relaxed text-gray-300">
            <strong>Road Runner Moto</strong> è la destinazione ideale per chi cerca <strong>moto usate a Caserta e provincia</strong>. Situata a Capodrise, la nostra concessionaria offre un catalogo aggiornato di <strong>usato garantito plurimarche</strong>, tra cui scooter Honda, Piaggio e modelli Kymco. Grazie alla nostra officina specializzata, ogni veicolo è pronto per la strada. Offriamo anche valutazioni immediate per la tua <strong>permuta</strong> e finanziamenti agevolati.
          </p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="container py-5 text-center">
      <div class="spinner"></div>
      <p>Caricamento catalogo...</p>
    </div>

    <div v-else-if="error" class="container py-5 text-center">
      <p class="text-danger">Si è verificato un errore durante il caricamento.</p>
      <button @click="fetchVehicles" class="btn-primary-custom">Riprova</button>
    </div>

    <FeaturedVehicles v-else :vehicles="vehicles" />

    <!-- FAQ Section (visibile per coerenza con schema FAQPage) -->
    <section class="faq-section" aria-labelledby="faq-heading">
      <h2 id="faq-heading">Domande frequenti</h2>
      <details>
        <summary>Dove posso comprare moto usate garantite a Caserta?</summary>
        <p>Da Road Runner Moto a Capodrise (CE), trovi una vasta selezione di moto usate garantite di ogni marca (Honda, Piaggio, Kymco, etc.). Ogni veicolo è sottoposto a rigidi controlli tecnici prima della vendita.</p>
      </details>
      <details>
        <summary>Posso permutare la mia vecchia moto per un usato?</summary>
        <p>Certamente! Road Runner Moto accetta permute flessibili sia sull'acquisto di moto nuove che usate in stock. Contattaci per una valutazione rapida della tua moto attuale.</p>
      </details>
    </section>
  </div>
</template>

<style scoped>
.catalog-page {
  padding-top: 80px; /* Offset for header */
  background: #050505;
  min-height: 100vh;
}

.catalog-hero {
  padding: 60px 0;
  background: linear-gradient(to bottom, #111, #050505);
  text-align: center;
  border-bottom: 1px solid #222;
}

.catalog-hero h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 10px;
  color: #fff;
}

.catalog-hero p {
  color: #888;
  font-size: 1.2rem;
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.text-center {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 91, 107, 0.3);
  border-radius: 50%;
  border-top-color: #ff5b6b;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
