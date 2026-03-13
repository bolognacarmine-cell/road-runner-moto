<script setup>
import { computed } from 'vue'
import { gsap } from 'gsap'
import { onMounted, onUnmounted, nextTick } from 'vue'
import MotoCarousel from '~/components/moto/MotoCarousel.vue'

// Props: veicoli dinamici e filtri
const props = defineProps({
  vehicles: { type: Array, default: () => [] }
})

// Computed: veicoli filtrati (puoi aggiungere filtri dinamici se vuoi)
const featuredMotos = computed(() => {
  return props.vehicles.slice(0, 6)
})

const formatPrice = (price) => {
  if (!price) return 'Prezzo su richiesta'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)
}

const formatYear = (moto) => moto.annoImmatricolazione || moto.anno || 'N/D'

const formatImages = (moto) => {
  if (moto?.immagini && Array.isArray(moto.immagini) && moto.immagini.length > 0) {
    return moto.immagini.map(img => {
      const url = typeof img === 'string' ? img : (img?.url || '/logo-road-runner.jpg')
      return url.replace('/upload/', '/upload/f_auto,q_auto/')
    })
  }
  return ['/logo-road-runner.jpg']
}

// Animazioni GSAP
let ctx

onMounted(async () => {
  await nextTick()
  ctx = gsap.context(() => {
    const cards = document.querySelectorAll('.featured-grid .moto-card')
    if (cards.length > 0) {
      gsap.from(cards, { y: 28, opacity: 0, duration: 0.7, stagger: 0.12, delay: 0.2 })
    }
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <section id="moto" class="featured-section">
    <div class="container">
      <div class="section-heading">
        <p class="section-kicker">Catalogo</p>
        <h2>Moto e scooter in evidenza</h2>
        <p>Esplora una selezione di veicoli disponibili in concessionaria.</p>
      </div>

      <div v-if="!props.vehicles.length" class="state-box">Nessun veicolo disponibile.</div>

      <div v-else class="featured-grid">
        <article v-for="moto in featuredMotos" :key="moto._id" class="moto-card">
          <MotoCarousel :images="formatImages(moto)" :altText="`${moto.marca} ${moto.modello}`" height="240px" />
          <div class="moto-body">
            <p class="moto-kicker">{{ moto.marca || 'Moto' }}</p>
            <h3>{{ moto.modello || 'Modello disponibile' }}</h3>
            <ul class="moto-meta">
              <li>Anno: {{ formatYear(moto) }}</li>
              <li>Km: {{ moto.chilometri?.toLocaleString('it-IT') || 'N/D' }}</li>
              <li>Cilindrata: {{ moto.cilindrata ? `${moto.cilindrata} cc` : 'N/D' }}</li>
            </ul>
            <div class="moto-footer">
              <strong>{{ formatPrice(moto.prezzo) }}</strong>
              <NuxtLink :to="`/moto/${moto.slug || moto._id}`">Dettagli</NuxtLink>
            </div>
          </div>
        </article>
      </div>

      <div class="section-footer mt-5">
        <NuxtLink to="/blog?category=Novità%20Moto" class="btn-read-more-section">
          Leggi di più sulle novità →
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured-section {
  padding: 100px 0;
  background: var(--bg);
  position: relative;
  z-index: 2;
  margin-top: -2px; /* Piccola sovrapposizione per evitare linee bianche tra sezioni */
  scroll-margin-top: 180px; /* Margine per l'header fisso quando si scende dal catalogo */
}

.section-heading {
  margin-bottom: 48px;
}

.section-kicker {
  color: var(--primary-2);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 1rem;
  margin-bottom: 16px;
}

.section-heading h2 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 950;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
}

.featured-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 640px) {
  .featured-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .featured-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}

.moto-card {
  background: var(--panel);
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--line);
  transition: transform var(--transition), border-color var(--transition);
}

@media (hover: hover) {
  .moto-card:hover {
    transform: translateY(-8px);
    border-color: rgba(255, 255, 255, 0.15);
  }
}

.moto-body {
  padding: 24px;
}

.moto-kicker {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary-2);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.moto-body h3 {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 16px;
}

.moto-meta {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
}

.moto-meta li {
  font-size: 0.85rem;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.03);
  padding: 4px 10px;
  border-radius: 6px;
}

.moto-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.moto-footer strong {
  font-size: 1.25rem;
  color: #fff;
  font-weight: 900;
}

.moto-footer a {
  font-weight: 700;
  color: var(--primary-2);
  font-size: 0.9rem;
}

.state-box {
  text-align: center;
  padding: 60px 20px;
  background: var(--panel);
  border-radius: var(--radius);
  color: var(--muted);
  border: 1px dashed var(--line);
}

.moto-footer a:hover {
  color: #fff;
}

.section-footer {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}

.btn-read-more-section {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--line);
  color: #fff;
  border-radius: 100px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-read-more-section:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--primary-2);
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.mt-5 { margin-top: 3rem; }
</style>