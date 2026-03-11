<script setup>
import { computed } from 'vue'
import { gsap } from 'gsap'
import { onMounted, onUnmounted, nextTick } from 'vue'

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

const formatImage = (moto) => {
  // Supporto per array di stringhe o array di oggetti
  let raw = '/logo-road-runner.jpg'
  
  if (moto?.immagini && moto.immagini.length > 0) {
    const firstImg = moto.immagini[0]
    raw = typeof firstImg === 'string' ? firstImg : (firstImg?.url || raw)
  } else if (moto?.immagine) {
    raw = moto.immagine
  }
  
  return typeof raw === 'string' ? raw.replace('/upload/', '/upload/f_auto,q_auto/') : '/logo-road-runner.jpg'
}

// Animazioni GSAP
onMounted(async () => {
  await nextTick()
  const ctx = gsap.context(() => {
    gsap.from('.featured-grid .moto-card', { y: 28, opacity: 0, duration: 0.7, stagger: 0.12, delay: 0.2 })
  })
  onUnmounted(() => ctx.revert())
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
          <img :src="formatImage(moto)" :alt="`${moto.marca} ${moto.modello}`" class="moto-image" loading="lazy" />
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
    </div>
  </section>
</template>

<style scoped>
/* Qui rimane lo stesso style scoped già fornito per FeaturedVehicles */
</style>
<style scoped>
.featured-section {
  padding: 88px 16px;
  background: #050505;
  color: #f5f5f5;
}

.section-heading {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 40px;
}

.section-heading h2 {
  margin: 0 0 12px;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
}

.section-kicker {
  margin: 0 0 10px;
  color: #ff5b6b;
  text-transform: uppercase;
  font-weight: 800;
  font-size: .85rem;
  letter-spacing: .12em;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.filter-input {
  width: 100%;
  min-height: 52px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.08);
  background: #101010;
  color: #fff;
  padding: 14px 16px;
  outline: none;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}
.filter-input:focus {
  border-color: rgba(255,91,107,.65);
  box-shadow: 0 0 0 4px rgba(255,91,107,.12);
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.moto-card {
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, #131313, #0b0b0b);
  border: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 18px 50px rgba(0,0,0,.32);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.moto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 60px rgba(0,0,0,.45);
}

.moto-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
}

.moto-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.moto-kicker {
  color: #ff5b6b;
  text-transform: uppercase;
  font-weight: 800;
  font-size: .8rem;
}

.moto-body h3 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
}

.moto-meta {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
  color: #bdbdbd;
  font-size: .9rem;
}

.moto-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.moto-footer a {
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}

.catalog-cta {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

.state-box {
  text-align: center;
  padding: 24px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,.08);
  background: linear-gradient(180deg, #131313, #0b0b0b);
  color: #bdbdbd;
}

.error {
  border-color: rgba(255,91,107,.35);
  color: #ff5b6b;
}

/* Responsive */
@media (max-width: 1100px) {
  .featured-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 700px) {
  .featured-grid,
  .filters-grid {
    grid-template-columns: 1fr;
  }
}
</style>