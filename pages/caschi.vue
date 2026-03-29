
<script setup>
import { useAsyncData, useFetch, computed } from '#imports'
import MotoCarousel from '~/components/moto/MotoCarousel.vue'

// Recupero dinamico dei caschi dal database
const { data: helmetsData, pending: loading } = await useAsyncData('helmets-page', () => $fetch('/api/helmets'), {
  transform: (res) => {
    return Array.isArray(res.helmets) ? res.helmets.filter(h => h.isVisible !== false) : []
  }
})

const helmets = computed(() => helmetsData.value || [])

// Filtri (opzionale, ma utile per l'eleganza commerciale)
const selectedCategory = ref('Tutti')
const categories = ['Tutti', 'Integrale', 'Modular', 'Jet', 'Cross']

const filteredHelmets = computed(() => {
  if (selectedCategory.value === 'Tutti') return helmets.value
  return helmets.value.filter(h => h.categoria === selectedCategory.value)
})

useHead({
  title: 'Collezione Caschi Moto | ROAD RUNNER MOTO',
  meta: [
    { name: 'description', content: 'Scopri la nostra selezione premium di caschi per moto: MomoDesign, LS2 e molto altro. Sicurezza e stile per ogni motociclista.' }
  ]
})
</script>

<template>
  <div class="caschi-page">
    <!-- Header Sezione -->
    <section class="caschi-header-section">
      <div class="container">
        <NuxtLink to="/" class="btn-back">← Torna alla Home</NuxtLink>
        <h1 class="page-title">Caschi Protettivi</h1>
        <p class="page-subtitle">
          La nostra selezione esclusiva di caschi dei migliori brand. 
          Sicurezza, comfort e design per ogni tipologia di guida.
        </p>

        <!-- Filtri Categorie -->
        <div class="categories-filter">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="{ active: selectedCategory === cat }"
            class="filter-btn"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </section>

    <!-- Griglia Prodotti Dinamica -->
    <section class="caschi-grid-section">
      <div class="container">
        <div v-if="loading" class="loading-state">
          <div class="loader"></div>
          <p>Caricamento collezione...</p>
        </div>

        <div v-else-if="filteredHelmets.length === 0" class="empty-state">
          <p>Nessun casco disponibile per questa categoria.</p>
        </div>

        <div v-else class="helmets-dynamic-grid">
          <div v-for="h in filteredHelmets" :key="h._id" class="helmet-product-card">
            <!-- Badge Commerciale -->
            <div class="product-badge" v-if="h.badge" :class="h.badge">
              {{ h.badge === 'novita' ? 'Novità' : (h.badge === 'promo' ? 'Promo' : (h.badge === 'offerta' ? 'Offerta' : 'Best Seller')) }}
            </div>

            <!-- Carosello Immagini -->
            <div class="product-visual">
              <MotoCarousel :images="h.immagini" :altText="`${h.marca} ${h.modello}`" />
            </div>

            <!-- Info Prodotto -->
            <div class="product-info">
              <!-- Testo Promozionale -->
              <div v-if="h.promozioneAttiva && h.testoPromozionale" class="promo-text-banner">
                {{ h.testoPromozionale }}
              </div>

              <div class="product-header">
                <span class="product-brand">{{ h.marca }}</span>
                <span class="product-category-tag">{{ h.categoria }}</span>
              </div>
              <h3 class="product-name">{{ h.nome || `${h.marca} ${h.modello}` }}</h3>
              <p class="product-desc-short">{{ h.descrizioneBreve }}</p>
              
              <div class="product-specs" v-if="h.colore || h.taglie">
                <span v-if="h.colore">🎨 {{ h.colore }}</span>
                <span v-if="h.taglie">📏 {{ h.taglie }}</span>
              </div>

              <!-- Prezzi e Disponibilità -->
              <div class="product-footer">
                <div class="product-price-box">
                  <span v-if="h.prezzoScontato" class="old-price">€ {{ h.prezzoOriginale }}</span>
                  <span class="current-price">€ {{ h.prezzoScontato || h.prezzoOriginale }}</span>
                </div>
                <div class="product-status" :class="h.disponibilita">
                  {{ h.disponibilita }}
                </div>
              </div>

              <!-- CTA WhatsApp -->
              <div class="product-actions">
                <a 
                  :href="`https://wa.me/393391581997?text=Ciao, vorrei informazioni sul casco ${h.marca} ${h.modello} (Rif: ${h._id})`" 
                  target="_blank" 
                  class="btn-whatsapp-helmet"
                >
                  <span class="icon">💬</span> Richiedi Informazioni
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.caschi-page {
  min-height: 100vh;
  background: #050505;
  color: white;
  padding-top: 100px; /* Spazio per la header fissa */
}

.caschi-header-section {
  padding: 60px 0;
  background: linear-gradient(to bottom, #0a0a0a, #050505);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-back {
  display: inline-block;
  color: var(--primary);
  text-decoration: none;
  font-weight: 700;
  margin-bottom: 30px;
  transition: transform 0.3s;
}

.btn-back:hover {
  transform: translateX(-5px);
}

.page-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 950;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 700px;
  line-height: 1.6;
  margin-bottom: 50px;
}

/* Filtri */
.categories-filter {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  padding: 10px 24px;
  border-radius: 100px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.filter-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
  box-shadow: 0 10px 20px rgba(225, 29, 72, 0.2);
}

/* Griglia */
.caschi-grid-section {
  padding: 80px 0;
}

.helmets-dynamic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 40px;
}

.helmet-product-card {
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.helmet-product-card:hover {
  transform: translateY(-12px);
  border-color: var(--primary);
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5);
}

.product-visual {
  height: 350px;
  background: #000;
  position: relative;
}

.product-badge {
  position: absolute;
  top: 24px;
  right: 24px;
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  z-index: 10;
  color: white;
}

.product-badge.novita { background: #3b82f6; }
.product-badge.promo { background: #10b981; }
.product-badge.offerta { background: var(--primary); }
.product-badge.bestseller { background: #f59e0b; }

.product-info {
  padding: 32px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.promo-text-banner {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 800;
  margin-bottom: 20px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  text-align: center;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.product-brand {
  color: var(--primary-2);
  font-weight: 900;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
}

.product-category-tag {
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 10px;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.4);
}

.product-name {
  font-size: 1.6rem;
  font-weight: 900;
  margin-bottom: 16px;
  line-height: 1.2;
}

.product-desc-short {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 24px;
}

.product-specs {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  font-size: 0.85rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
}

.product-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.product-price-box {
  display: flex;
  flex-direction: column;
}

.old-price {
  text-decoration: line-through;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.9rem;
}

.current-price {
  font-size: 1.8rem;
  font-weight: 950;
  color: white;
}

.product-status {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: 8px;
}

.product-status.disponibile { color: #10b981; background: rgba(16, 185, 129, 0.1); }
.product-status.ordinabile { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
.product-status.esaurito { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

.btn-whatsapp-helmet {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 18px;
  background: white;
  color: black;
  text-decoration: none;
  border-radius: 18px;
  font-weight: 900;
  transition: all 0.3s;
}

.btn-whatsapp-helmet:hover {
  background: #25D366;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(37, 211, 102, 0.2);
}

/* States */
.loading-state, .empty-state {
  text-align: center;
  padding: 100px 0;
  color: rgba(255, 255, 255, 0.4);
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(225, 29, 72, 0.1);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 640px) {
  .caschi-page { padding-top: 80px; }
  .page-title { font-size: 2.8rem; }
  .helmets-dynamic-grid { grid-template-columns: 1fr; }
  .product-visual { height: 300px; }
}
</style>
