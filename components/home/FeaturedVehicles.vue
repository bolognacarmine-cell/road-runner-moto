<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { gsap } from 'gsap'
import { useSearch } from '~/composables/useSearch'
import { useFilter } from '~/composables/useFilter'
import MotoCarousel from '~/components/moto/MotoCarousel.vue'

// Props: veicoli dinamici e filtri
const props = defineProps({
  vehicles: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: Boolean, default: false }
})

// Stato globale della ricerca
const { searchQuery, setSearchQuery } = useSearch()
const { activeFilter, setFilter } = useFilter()
const localSearchQuery = ref(searchQuery.value)

// Sincronizza l'input locale con lo stato globale
watch(localSearchQuery, (newVal) => {
  setSearchQuery(newVal)
})

// Sincronizza lo stato globale con l'input locale (se resettato altrove)
watch(searchQuery, (newVal) => {
  if (newVal !== localSearchQuery.value) {
    localSearchQuery.value = newVal
  }
})

// Stato filtro attivo
const activeCategory = ref('tutte')
const maxKm = ref(null) // Nuovo: filtro chilometri
const sortBy = ref('recente') // Nuovo: ordinamento (recente, alfabetico, anno)

const resetFilters = () => {
  localSearchQuery.value = ''
  setFilter('tutti')
  activeCategory.value = 'tutte'
  maxKm.value = null
  sortBy.value = 'recente'
}

// Helper per verificare la visibilità
const isVisible = (m) => m.isVisible === true || m.isVisible === undefined || m.isVisible === 'true'

// Computed: categorie uniche dai veicoli caricate nel database
const dynamicCategories = computed(() => {
  const cats = props.vehicles
    .map(m => m.categoria)
    .filter(c => c && c !== '')
  return [...new Set(cats)].sort()
})

// Computed: veicoli filtrati
const featuredMotos = computed(() => {
  if (!props.vehicles || !Array.isArray(props.vehicles)) return []
  
  // Filtriamo subito i veicoli non visibili
  let filtered = props.vehicles.filter(isVisible)
  
  // 0. Filtro per ricerca globale (Header)
  const query = (searchQuery.value || '').toString().toLowerCase().trim()
  if (query) {
    filtered = filtered.filter(m => 
      `${m.marca || ''} ${m.modello || ''} ${m.categoria || ''}`.toLowerCase().includes(query)
    )
  }

  // 1. Filtro per stato (nuovo/usato/promozione/venduto)
  const filterVal = (activeFilter.value || 'tutti').toLowerCase()
  
  if (filterVal === 'nuovo') {
    filtered = filtered.filter(m => 
      (m.nuovaUsata || '').toLowerCase().includes('nuov') || 
      (m.stato || '').toLowerCase().includes('nuov')
    )
  } else if (filterVal === 'usato') {
    filtered = filtered.filter(m => 
      (m.nuovaUsata || '').toLowerCase().includes('usat') || 
      (m.stato || '').toLowerCase().includes('usat')
    )
  } else if (filterVal === 'promozioni') {
    filtered = filtered.filter(m => 
      (m.nuovaUsata || '').toLowerCase().includes('promozion') || 
      m.isPromotion || m.prezzoScontato || m.offerta === true
    )
  } else if (filterVal === 'venduto') {
    filtered = filtered.filter(m => 
      m.venduta === true || (m.nuovaUsata || '').toLowerCase().includes('vendut')
    )
  }

  // 2. Filtro per categoria locale (Select)
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
  
  return filtered.slice(0, 24) // Aumentiamo il limite per mostrare più veicoli
})

const formatPrice = (price) => {
  if (!price) return 'Prezzo su richiesta'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)
}

const formatYear = (moto) => moto.annoImmatricolazione || moto.anno || 'N/D'

const formatImages = (moto) => {
  if (moto?.immagini && Array.isArray(moto.immagini) && moto.immagini.length > 0) {
    return moto.immagini.map(img => {
      let url = typeof img === 'string' ? img : (img?.url || '/logo-road-runner.jpg')
      
      // Se l'URL non inizia con http, potrebbe essere un path locale o un placeholder
      if (!url.startsWith('http') && !url.startsWith('/')) {
        url = '/' + url
      }
      
      // Ottimizzazione Cloudinary solo se è un URL Cloudinary
      if (url.includes('cloudinary.com')) {
        return url.replace('/upload/', '/upload/f_auto,q_auto/')
      }
      return url
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
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.7, 
          stagger: 0.12, 
          delay: 0.2, 
          ease: 'power2.out',
          clearProps: 'opacity,transform'
        }
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
      <div class="section-heading-row">
        <div class="heading-left">
          <p class="section-kicker">Showroom</p>
          <h2>Nuovo & Usato Garantito</h2>
          <p class="section-description">Esplora la nostra selezione di moto e scooter plurimarche, pronti per la strada.</p>
        </div>
        
        <!-- Premium Search Bar Integrata -->
        <div class="search-bar-container">
          <div class="search-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              v-model="localSearchQuery"
              type="text" 
              placeholder="Cerca per marca o modello..." 
              class="search-input"
            />
          </div>
        </div>
      </div>

      <div class="section-filters-only">
        <!-- Filtri Veicoli Premium - Grandi e Ben Visibili -->
        <div class="main-filter-tabs">
          <button 
            @click="activeFilter = 'tutti'"
            :class="{ active: activeFilter === 'tutti' }"
            class="main-tab-btn"
          >
            <span class="tab-label">TUTTI</span>
            <span class="tab-count">{{ props.vehicles.filter(isVisible).length }}</span>
          </button>
          
          <button 
            @click="activeFilter = 'nuovo'"
            :class="{ active: activeFilter === 'nuovo' }"
            class="main-tab-btn"
          >
            <span class="tab-icon">✨</span>
            <span class="tab-label">NUOVO</span>
            <span class="tab-count">
              {{ props.vehicles.filter(m => isVisible(m) && ((m.nuovaUsata || '').toLowerCase().includes('nuov') || (m.stato || '').toLowerCase().includes('nuov'))).length }}
            </span>
          </button>

          <button 
            @click="activeFilter = 'usato'"
            :class="{ active: activeFilter === 'usato' }"
            class="main-tab-btn"
          >
            <span class="tab-icon">🏁</span>
            <span class="tab-label">USATO</span>
            <span class="tab-count">
              {{ props.vehicles.filter(m => isVisible(m) && ((m.nuovaUsata || '').toLowerCase().includes('usat') || (m.stato || '').toLowerCase().includes('usat'))).length }}
            </span>
          </button>

          <button 
            @click="activeFilter = 'promozioni'"
            :class="{ active: activeFilter === 'promozioni' }"
            class="main-tab-btn promo-tab"
          >
            <span class="tab-icon">🔥</span>
            <span class="tab-label">OFFERTE</span>
            <span class="tab-count">
              {{ props.vehicles.filter(m => isVisible(m) && ((m.nuovaUsata || '').toLowerCase().includes('promozion') || m.isPromotion || m.prezzoScontato)).length }}
            </span>
          </button>

          <button 
            @click="activeFilter = 'venduto'"
            :class="{ active: activeFilter === 'venduto' }"
            class="main-tab-btn sold-tab"
          >
            <span class="tab-icon">🤝</span>
            <span class="tab-label">VENDUTO</span>
            <span class="tab-count">
              {{ props.vehicles.filter(m => isVisible(m) && (m.venduta === true || (m.nuovaUsata || '').toLowerCase().includes('vendut'))).length }}
            </span>
          </button>
        </div>

        <div class="secondary-filters-row">
          <div v-if="dynamicCategories.length" class="filter-group">
            <select v-model="activeCategory" class="premium-select">
              <option value="tutte">Tutte le Categorie</option>
              <option v-for="cat in dynamicCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div v-if="activeFilter === 'usato' || activeFilter === 'tutti'" class="filter-group">
            <select v-model="maxKm" class="premium-select">
              <option :value="null">Qualsiasi Chilometraggio</option>
              <option :value="5000">Fino a 5.000 km</option>
              <option :value="10000">Fino a 10.000 km</option>
              <option :value="20000">Fino a 20.000 km</option>
              <option :value="50000">Fino a 50.000 km</option>
            </select>
          </div>

          <div class="filter-group">
            <select v-model="sortBy" class="premium-select">
              <option value="recente">Ultimi Arrivi</option>
              <option value="alfabetico">Marca e Modello (A-Z)</option>
              <option value="anno">Anno (Più Recente)</option>
              <option value="prezzo_asc">Prezzo (Crescente)</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="loading" class="state-container loading">
        <div class="loader"></div>
        <p>Caricamento veicoli in corso...</p>
      </div>

      <div v-else-if="error" class="state-container error">
        <p>Si è verificato un errore nel caricamento dei veicoli.</p>
        <button @click="$emit('retry')" class="retry-btn">Riprova</button>
      </div>

      <div v-else-if="featuredMotos.length === 0" class="state-container empty">
        <p>Nessun veicolo trovato per i criteri selezionati.</p>
        <button @click="resetFilters" class="reset-btn">Resetta filtri</button>
      </div>

      <div v-else class="featured-grid">
        <article v-for="moto in featuredMotos" :key="moto._id" class="moto-card">
          <div class="card-visual">
            <MotoCarousel :images="formatImages(moto)" :altText="`Moto ${moto.marca} ${moto.modello} in vendita a Capodrise`" height="260px" />
            <div class="card-overlay-actions">
              <NuxtLink :to="`/moto/${moto.slug || moto._id}`" class="btn-view-quick">Dettagli</NuxtLink>
            </div>
            <div class="card-badges-top">
              <div v-if="moto.nuovaUsata === 'nuova' || moto.stato === 'nuovo'" class="badge-status-card new">NUOVO</div>
              <div v-else-if="moto.nuovaUsata === 'usata' || moto.stato === 'usato'" class="badge-status-card used">USATO</div>
              <div v-if="moto.venduta === true" class="badge-status-card sold">VENDUTO</div>
              <div v-if="moto.nuovaUsata === 'promozione' || moto.isPromotion || moto.prezzoScontato || moto.offerta === true" class="badge-promo-card">PROMO</div>
            </div>
            
            <!-- Timbro VENDUTO -->
            <div v-if="moto.venduta === true" class="sold-stamp-overlay">
              <div class="sold-stamp">VENDUTO</div>
            </div>
          </div>

          <div class="moto-body">
            <div class="moto-header-main">
              <span class="brand-tag">{{ moto.marca || 'Moto' }}</span>
              <span class="category-tag" v-if="moto.categoria">{{ moto.categoria }}</span>
            </div>
            
            <h3 class="moto-title-display">{{ moto.modello || 'Modello disponibile' }}</h3>
            
            <div class="moto-spec-grid">
              <div class="spec-item">
                <span class="spec-icon">📅</span>
                <span class="spec-value">{{ formatYear(moto) }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-icon">🛣️</span>
                <span class="spec-value">{{ moto.chilometri?.toLocaleString('it-IT') || '0' }} km</span>
              </div>
              <div class="spec-item">
                <span class="spec-icon">⚡</span>
                <span class="spec-value">{{ moto.cilindrata ? `${moto.cilindrata} cc` : 'N/D' }}</span>
              </div>
            </div>

            <div class="moto-footer-premium">
              <div class="price-display-wrapper">
                <span class="price-label">Prezzo</span>
                <strong class="main-price">{{ formatPrice(moto.prezzo) }}</strong>
              </div>
              <NuxtLink :to="{ path: '/', query: { moto: moto._id }, hash: '#preventivo' }" class="btn-quote-minimal">
                <span class="icon">✉️</span>
                Preventivo
              </NuxtLink>
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
  padding: 40px 0 60px;
  background: var(--bg);
  position: relative;
  z-index: 2;
  margin-top: 0;
  scroll-margin-top: 20px;
}

.section-heading-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .section-heading-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 32px;
  }
}

.heading-left {
  flex: 1;
  min-width: 300px;
}

.section-kicker {
  color: var(--primary-2);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 1rem;
  margin-bottom: 12px;
}

.heading-left h2 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 950;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
}

/* --- Search Bar Style --- */
.search-bar-container {
  width: 100%;
  max-width: 450px;
}

@media (max-width: 768px) {
  .search-bar-container {
    max-width: 100%;
    margin-top: 10px;
  }
}

.search-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.3s ease;
}

.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  padding: 14px 20px 14px 50px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  -webkit-appearance: none; /* iOS fix */
}

.search-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--primary-2);
  box-shadow: 0 0 20px rgba(225, 29, 72, 0.15);
}

.search-input:focus + .search-icon {
  color: var(--primary-2);
}

/* --- Filter Section Premium --- */
.section-filters-only {
  margin-bottom: 60px;
}

@media (max-width: 768px) {
  .section-filters-only {
    margin-bottom: 40px;
  }
}

.section-description {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
  margin-top: 8px;
}

.main-filter-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 12px;
  -webkit-overflow-scrolling: touch; /* Smooth scroll on iOS */
  scrollbar-width: none; /* Hide scrollbar Firefox */
}

.main-filter-tabs::-webkit-scrollbar {
  display: none; /* Hide scrollbar Chrome/Safari */
}

.main-tab-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 14px 24px;
  border-radius: 18px;
  color: white;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  white-space: nowrap; /* Keep label on one line */
  flex-shrink: 0;
}

@media (max-width: 414px) {
  .main-tab-btn {
    padding: 12px 20px;
    border-radius: 16px;
  }
}

.main-tab-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.main-tab-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.2);
}

.main-tab-btn.active {
  border-color: transparent;
  box-shadow: 0 10px 30px -10px rgba(225, 29, 72, 0.5);
}

.main-tab-btn.active::before {
  opacity: 1;
}

.main-tab-btn.active .tab-label,
.main-tab-btn.active .tab-count,
.main-tab-btn.active .tab-icon {
  color: white;
  position: relative;
  z-index: 1;
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-label {
  font-weight: 800;
  letter-spacing: 0.05em;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.tab-count {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 10px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 900;
  color: var(--primary-2);
}

.main-tab-btn.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.promo-tab.active::before {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.promo-tab.active {
  box-shadow: 0 10px 30px -10px rgba(245, 158, 11, 0.5);
}

.promo-tab .tab-count {
  color: #f59e0b;
}

.secondary-filters-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .secondary-filters-row {
    flex-direction: column;
    gap: 12px;
  }
  .filter-select {
    min-width: 100%;
  }
}

.premium-select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 20px;
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

.premium-select:focus {
  border-color: var(--primary-2);
  background: rgba(255, 255, 255, 0.08);
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

@media (max-width: 1024px) {
  .featured-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 640px) {
  .featured-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-label {
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--primary-2);
  opacity: 0.8;
}

.filter-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 12px 24px;
  border-radius: 100px;
  background: rgba(225, 29, 72, 0.15);
  border: 1px solid rgba(225, 29, 72, 0.3);
  color: var(--primary-2);
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 220px;
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23e11d48' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  padding-right: 48px;
}

.filter-select:hover, .filter-select:focus {
  background: var(--primary-2);
  border-color: var(--primary-2);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(225, 29, 72, 0.3);
  color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
  margin-top: 40px;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  margin-top: 40px;
}

.state-container p {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.loader {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(225, 29, 72, 0.1);
  border-left-color: #e11d48;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.retry-btn, .reset-btn {
  padding: 12px 24px;
  background: #e11d48;
  color: #fff;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.retry-btn:hover, .reset-btn:hover {
  background: #be123c;
  transform: translateY(-2px);
}

.moto-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.moto-card:hover {
  transform: translateY(-12px) scale(1.02);
  border-color: var(--primary-2);
  box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.8);
  background: rgba(255, 255, 255, 0.08);
}

.card-visual {
  position: relative;
  overflow: hidden;
}

.card-overlay-actions {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
  z-index: 5;
}

.moto-card:hover .card-overlay-actions {
  opacity: 1;
}

.btn-view-quick {
  background: #fff;
  color: #000;
  padding: 12px 32px;
  border-radius: 100px;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  transform: translateY(20px);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.moto-card:hover .btn-view-quick {
  transform: translateY(0);
}

.card-badges-top {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 6;
}

.badge-status-card {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 950;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

/* Sold Stamp */
.sold-stamp-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 8;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: grayscale(1);
  pointer-events: none;
}

.sold-stamp {
  color: #ff0000;
  font-size: 2.2rem;
  font-weight: 900;
  text-transform: uppercase;
  padding: 8px 24px;
  border: 6px solid #ff0000;
  border-radius: 12px;
  transform: rotate(-20deg);
  opacity: 0.9;
  letter-spacing: 3px;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

@media (max-width: 480px) {
  .sold-stamp {
    font-size: 1.6rem;
    border-width: 4px;
    padding: 6px 16px;
  }
}

.badge-status-card.new {
  background: var(--primary);
}

.badge-status-card.used {
  background: #333;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.badge-status-card.sold {
  background: #ff0000;
  box-shadow: 0 4px 12px rgba(255, 0, 0, 0.4);
}

.badge-promo-card {
  background: #f59e0b;
  color: white;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.moto-body {
  padding: 28px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.moto-header-main {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.brand-tag {
  color: var(--primary-2);
  font-weight: 900;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.category-tag {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  font-weight: 600;
}

.moto-title-display {
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 24px;
  color: #fff;
  line-height: 1.2;
}

.moto-spec-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 24px;
}

.spec-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.spec-icon {
  font-size: 1rem;
  opacity: 0.7;
}

.spec-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.moto-footer-premium {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.price-display-wrapper {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.main-price {
  font-size: 1.4rem;
  font-weight: 950;
  color: #fff;
}

.btn-quote-minimal {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 800;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.btn-quote-minimal:hover {
  background: var(--primary);
  border-color: var(--primary);
  transform: scale(1.05);
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