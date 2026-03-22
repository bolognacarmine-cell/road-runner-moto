<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { gsap } from 'gsap'
import { useSearch } from '~/composables/useSearch'
import { useFilter } from '~/composables/useFilter'
import MotoCarousel from '~/components/moto/MotoCarousel.vue'

// Props: veicoli dinamici e filtri
const props = defineProps({
  vehicles: { type: Array, default: () => [] }
})

// Stato globale della ricerca
const { searchQuery, setSearchQuery } = useSearch()
const { activeFilter } = useFilter()
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
  
  let filtered = [...props.vehicles]
  
  // 0. Filtro per ricerca globale (Header)
  const query = (searchQuery.value || '').toString().toLowerCase().trim()
  if (query) {
    filtered = filtered.filter(m => 
      `${m.marca || ''} ${m.modello || ''} ${m.categoria || ''}`.toLowerCase().includes(query)
    )
  }

  // 1. Filtro per stato (nuovo/usato/promozione)
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
  
  return filtered.slice(0, 12)
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
            <span class="tab-count">{{ props.vehicles.length }}</span>
          </button>
          
          <button 
            @click="activeFilter = 'nuovo'"
            :class="{ active: activeFilter === 'nuovo' }"
            class="main-tab-btn"
          >
            <span class="tab-icon">✨</span>
            <span class="tab-label">NUOVO</span>
            <span class="tab-count">
              {{ props.vehicles.filter(m => (m.nuovaUsata || '').toLowerCase().includes('nuov') || (m.stato || '').toLowerCase().includes('nuov')).length }}
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
              {{ props.vehicles.filter(m => (m.nuovaUsata || '').toLowerCase().includes('usat') || (m.stato || '').toLowerCase().includes('usat')).length }}
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
              {{ props.vehicles.filter(m => (m.nuovaUsata || '').toLowerCase().includes('promozion') || m.isPromotion || m.prezzoScontato).length }}
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

      <div v-if="!props.vehicles.length" class="state-box">Nessun veicolo disponibile.</div>

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
              <div v-if="moto.nuovaUsata === 'promozione' || moto.isPromotion || moto.prezzoScontato || moto.offerta === true" class="badge-promo-card">PROMO</div>
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

.section-description {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
  margin-top: 8px;
}

.main-filter-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.main-tab-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px 28px;
  border-radius: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
  margin-top: 40px;
}

.moto-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
  display: flex;
  flex-direction: column;
}

.moto-card:hover {
  transform: translateY(-12px);
  border-color: rgba(225, 29, 72, 0.3);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7);
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
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.badge-status-card.new {
  background: var(--primary);
}

.badge-status-card.used {
  background: #333;
  border: 1px solid rgba(255, 255, 255, 0.1);
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