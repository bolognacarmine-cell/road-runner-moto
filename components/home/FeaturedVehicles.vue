<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { gsap } from 'gsap'
import { useSearch } from '~/composables/useSearch'
import MotoCarousel from '~/components/moto/MotoCarousel.vue'

// Props: veicoli dinamici e filtri
const props = defineProps({
  vehicles: { type: Array, default: () => [] }
})

// Stato globale della ricerca
const { searchQuery } = useSearch()

// Stato filtro attivo
const activeFilter = ref('tutti')
const activeCategory = ref('tutte')
const maxKm = ref(null) // Nuovo: filtro chilometri
const sortBy = ref('recente') // Nuovo: ordinamento (recente, alfabetico, anno)

// Computed: categorie uniche dai veicoli caricate nel database
const dynamicCategories = computed(() => {
  const cats = props.vehicles
    .map(m => m.categoria)
    .filter(c => c && c !== '')
  return [...new Set(cats)].sort()
})

// Computed: veicoli filtrati
const featuredMotos = computed(() => {
  let filtered = [...props.vehicles]
  
  // 0. Filtro per ricerca globale (Header)
  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    filtered = filtered.filter(m => 
      `${m.marca || ''} ${m.modello || ''} ${m.categoria || ''}`.toLowerCase().includes(query)
    )
  }

  // 1. Filtro per stato (nuovo/usato/promozione)
  if (activeFilter.value === 'nuovo') {
    filtered = filtered.filter(m => m.nuovaUsata === 'nuova' || m.stato === 'nuovo')
  } else if (activeFilter.value === 'usato') {
    filtered = filtered.filter(m => m.nuovaUsata === 'usata' || m.stato === 'usato')
  } else if (activeFilter.value === 'promozioni') {
    filtered = filtered.filter(m => m.nuovaUsata === 'promozione' || m.isPromotion || m.prezzoScontato || m.offerta === true)
  }

  // 2. Filtro per categoria
  if (activeCategory.value !== 'tutte') {
    filtered = filtered.filter(m => m.categoria === activeCategory.value)
  }

  // 3. Filtro per chilometri (solo per usati o se specificato)
  if (maxKm.value !== null) {
    filtered = filtered.filter(m => {
      // Se è nuovo i km sono 0, quindi passano sempre il filtro
      const km = m.chilometri || 0
      return km <= maxKm.value
    })
  }

  // 4. Ordinamento
  filtered.sort((a, b) => {
    if (sortBy.value === 'alfabetico') {
      const nameA = `${a.marca} ${a.modello}`.toLowerCase()
      const nameB = `${b.marca} ${b.modello}`.toLowerCase()
      return nameA.localeCompare(nameB)
    } else if (sortBy.value === 'anno') {
      const yearA = a.annoImmatricolazione || a.anno || 0
      const yearB = b.annoImmatricolazione || b.anno || 0
      return yearB - yearA // Dal più recente
    } else if (sortBy.value === 'prezzo_asc') {
      return (a.prezzo || 0) - (b.prezzo || 0)
    } else {
      // Default: più recenti inseriti (se disponibile createdAt) o ID
      return (b._id > a._id) ? 1 : -1
    }
  })
  
  return filtered.slice(0, 12) // Aumentato a 12 per dare più respiro ai filtri
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

const animateCards = () => {
  if (ctx) ctx.revert()
  ctx = gsap.context(() => {
    const cards = document.querySelectorAll('.featured-grid .moto-card')
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, delay: 0.2, ease: 'power2.out' }
      )
    }
  })
}

// Watch per riattivare l'animazione quando cambiano i veicoli filtrati
watch([featuredMotos, searchQuery], () => {
  nextTick(() => {
    animateCards()
  })
}, { deep: true })

onMounted(async () => {
  await nextTick()
  animateCards()
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
        
        <!-- Filtri Veicoli -->
        <div class="filters-container">
          <div class="filter-group">
            <span class="filter-label">Stato:</span>
            <div class="filter-tabs">
              <button 
                v-for="filter in ['tutti', 'nuovo', 'usato', 'promozioni']" 
                :key="filter"
                @click="activeFilter = filter"
                :class="{ active: activeFilter === filter }"
                class="filter-btn"
              >
                {{ filter.charAt(0).toUpperCase() + filter.slice(1) }}
              </button>
            </div>
          </div>

          <div v-if="dynamicCategories.length" class="filter-group">
            <span class="filter-label">Categoria:</span>
            <div class="filter-tabs">
              <button 
                @click="activeCategory = 'tutte'"
                :class="{ active: activeCategory === 'tutte' }"
                class="filter-btn"
              >
                Tutte
              </button>
              <button 
                v-for="cat in dynamicCategories" 
                :key="cat"
                @click="activeCategory = cat"
                :class="{ active: activeCategory === cat }"
                class="filter-btn"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <!-- Nuovi filtri: KM e Ordinamento -->
          <div class="extra-filters">
            <div v-if="activeFilter === 'usato' || activeFilter === 'tutti'" class="filter-group">
              <span class="filter-label">Chilometraggio:</span>
              <select v-model="maxKm" class="filter-select">
                <option :value="null">Qualsiasi km</option>
                <option :value="5000">Fino a 5.000 km</option>
                <option :value="10000">Fino a 10.000 km</option>
                <option :value="20000">Fino a 20.000 km</option>
                <option :value="50000">Fino a 50.000 km</option>
              </select>
            </div>

            <div class="filter-group">
              <span class="filter-label">Ordina per:</span>
              <select v-model="sortBy" class="filter-select">
                <option value="recente">Ultimi arrivi</option>
                <option value="alfabetico">A-Z (Marca/Modello)</option>
                <option value="anno">Anno (Più recente)</option>
                <option value="prezzo_asc">Prezzo (Crescente)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!props.vehicles.length" class="state-box">Nessun veicolo disponibile.</div>

      <div v-else class="featured-grid">
        <article v-for="moto in featuredMotos" :key="moto._id" class="moto-card">
          <MotoCarousel :images="formatImages(moto)" :altText="`${moto.marca} ${moto.modello}`" height="240px" />
          <div class="moto-body">
            <div class="moto-tags">
              <span class="moto-kicker">{{ moto.marca || 'Moto' }}</span>
              <div class="tag-group">
                <span v-if="moto.nuovaUsata === 'promozione'" class="tag promo-tag">PROMO</span>
                <span v-if="moto.categoria" class="tag">{{ moto.categoria }}</span>
              </div>
            </div>
            <h3>{{ moto.modello || 'Modello disponibile' }}</h3>
            <ul class="moto-meta">
              <li>Anno: {{ formatYear(moto) }}</li>
              <li>Km: {{ moto.chilometri?.toLocaleString('it-IT') || 'N/D' }}</li>
              <li>Cilindrata: {{ moto.cilindrata ? `${moto.cilindrata} cc` : 'N/D' }}</li>
            </ul>
            <div class="moto-footer">
              <div class="price-box">
                <strong>{{ formatPrice(moto.prezzo) }}</strong>
              </div>
              <div class="action-links">
                <NuxtLink :to="`/moto/${moto.slug || moto._id}`" class="link-details">Dettagli</NuxtLink>
                <NuxtLink :to="{ path: '/', query: { moto: moto._id }, hash: '#preventivo' }" class="btn-quote-mini">Preventivo</NuxtLink>
              </div>
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

.filters-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 32px;
}

.extra-filters {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
}

.filter-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 10px 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line);
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  outline: none;
}

.filter-select:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--primary-2);
}

.filter-select option {
  background: #111;
  color: #fff;
}

.filter-btn {
  padding: 10px 24px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--line);
  color: var(--muted);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: capitalize;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.filter-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  box-shadow: 0 10px 20px -5px rgba(225, 29, 72, 0.4);
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

.moto-tags {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.tag-group {
  display: flex;
  gap: 6px;
}

.moto-kicker {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary-2);
  text-transform: uppercase;
}

.tag {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  background: rgba(225, 29, 72, 0.1);
  color: var(--primary-2);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(225, 29, 72, 0.2);
}

.tag.promo-tag {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
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
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.price-box strong {
  font-size: 1.25rem;
  color: #fff;
  font-weight: 900;
}

.action-links {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.link-details {
  font-weight: 700;
  color: var(--muted);
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-details:hover {
  color: #fff;
}

.btn-quote-mini {
  background: var(--primary);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.2);
  opacity: 1 !important;
  visibility: visible !important;
}

.btn-quote-mini:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(225, 29, 72, 0.3);
  filter: brightness(1.1);
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
@media (max-width: 480px) {
  .action-links {
    flex-direction: column;
    align-items: stretch;
  }
  .btn-quote-mini {
    text-align: center;
  }
}
</style>