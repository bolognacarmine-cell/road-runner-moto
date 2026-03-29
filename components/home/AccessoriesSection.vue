
<script setup>
import { onMounted, nextTick, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HelmetsPromo from './HelmetsPromo.vue'
import MotoCarousel from './MotoCarousel.vue'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

const helmets = ref([])
const loading = ref(true)

const fetchHelmets = async () => {
  try {
    const { data } = await useFetch('/api/helmets')
    if (data.value && data.value.helmets) {
      helmets.value = data.value.helmets.filter(h => h.isVisible !== false)
    }
  } catch (e) {
    console.error('Errore recupero caschi:', e)
  } finally {
    loading.value = false
  }
}

let ctx

onMounted(async () => {
  fetchHelmets()
  await nextTick()
  ctx = gsap.context(() => {
    // Animazione Intestazione
    gsap.from('.accessories-header > *', {
      scrollTrigger: {
        trigger: '.accessories-section',
        start: 'top 80%',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    })

    // Animazione Card Caschi
    gsap.from('.helmet-card', {
      scrollTrigger: {
        trigger: '.helmets-grid',
        start: 'top 75%',
      },
      y: 50,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out'
    })

    // Effetto parallasse sullo sfondo decorativo
    gsap.to('.bg-decoration', {
      y: -100,
      scrollTrigger: {
        trigger: '.accessories-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
  })
})
</script>

<template>
  <section id="accessori" class="accessories-section">
    <!-- Elemento decorativo di sfondo -->
    <div class="bg-decoration">ACCESSORIES</div>
    
    <div class="container accessories-container">
      <div class="accessories-header">
        <p class="section-kicker">Abbigliamento e Protezione</p>
        <h2 class="section-title">La tua sicurezza, con stile</h2>
        <p class="section-subtitle">
          Da ROAD RUNNER trovi una selezione esclusiva di <strong>caschi e accessori</strong> dei migliori brand. 
          Dall'integrale racing al jet urbano, proteggiamo la tua passione con il massimo della qualità.
        </p>
      </div>

      <!-- Nuova Card Promozionale Caschi -->
      <HelmetsPromo />

      <div v-if="helmets.length > 0" class="helmets-dynamic-grid">
        <div v-for="h in helmets" :key="h._id" class="helmet-product-card">
          <div class="product-badge" v-if="h.badge">{{ h.badge }}</div>
          <div class="product-visual">
            <MotoCarousel :images="h.immagini" :altText="h.nome" />
          </div>
          <div class="product-info">
            <span class="product-category">{{ h.categoria }}</span>
            <h3 class="product-name">{{ h.marca }} {{ h.modello }}</h3>
            <p class="product-desc">{{ h.descrizioneBreve }}</p>
            <div class="product-meta">
              <span class="product-price">
                <span v-if="h.prezzoScontato" class="old-price">€ {{ h.prezzoOriginale }}</span>
                <span class="current-price">€ {{ h.prezzoScontato || h.prezzoOriginale }}</span>
              </span>
              <span class="product-taglia" v-if="h.taglie">Taglie: {{ h.taglie }}</span>
            </div>
            <div class="product-actions">
              <a :href="`https://wa.me/393391581997?text=Ciao, vorrei informazioni sul casco ${h.marca} ${h.modello}`" target="_blank" class="btn-info">
                Richiedi info
              </a>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && helmets.length === 0" class="helmets-grid">
        <!-- Card 1: Integrali -->
        <div class="helmet-card">
          <div class="helmet-visual">
            <div class="helmet-icon-box">🪖</div>
            <div class="helmet-tag">Racing & Sport</div>
          </div>
          <div class="helmet-info">
            <h3>Caschi Integrali</h3>
            <p>Massima protezione e aerodinamica per chi non accetta compromessi sulla velocità.</p>
            <ul class="feature-list">
              <li>Fibra di carbonio</li>
              <li>Sistemi di ventilazione avanzati</li>
              <li>Design aerodinamico</li>
            </ul>
          </div>
        </div>

        <!-- Card 2: Modulari -->
        <div class="helmet-card featured-card">
          <div class="helmet-visual">
            <div class="helmet-icon-box">🏍️</div>
            <div class="helmet-tag featured-tag">Best Seller</div>
          </div>
          <div class="helmet-info">
            <h3>Caschi Modulari</h3>
            <p>La versatilità perfetta per il touring e i lunghi viaggi, senza rinunciare alla sicurezza.</p>
            <ul class="feature-list">
              <li>Doppia omologazione P/J</li>
              <li>Visierino parasole integrato</li>
              <li>Comfort acustico superiore</li>
            </ul>
          </div>
        </div>

        <!-- Card 3: Jet -->
        <div class="helmet-card">
          <div class="helmet-visual">
            <div class="helmet-icon-box">🛵</div>
            <div class="helmet-tag">Urban Style</div>
          </div>
          <div class="helmet-info">
            <h3>Caschi Jet</h3>
            <p>Leggerezza e stile per i tuoi spostamenti quotidiani in città su scooter o cafe racer.</p>
            <ul class="feature-list">
              <li>Ampio campo visivo</li>
              <li>Interni anallergici</li>
              <li>Stile iconico</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="accessories-footer">
        <div class="brands-mini-info">
          <span>Trattiamo i migliori marchi:</span>
          <div class="brands-placeholder">
            AGV • SHOEI • ARAI • HJC • NOLAN • SHARK
          </div>
        </div>
        <NuxtLink to="/#contatti" class="btn-primary-custom">Chiedi disponibilità taglie</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.accessories-section {
  padding: 140px 0;
  background: #080808;
  position: relative;
  overflow: hidden;
  scroll-margin-top: 100px;
}

.bg-decoration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 15vw;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.02);
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
  letter-spacing: 0.05em;
}

.accessories-container {
  position: relative;
  z-index: 2;
}

.accessories-header {
  max-width: 800px;
  margin-bottom: 80px;
}

.section-kicker {
  color: var(--primary-2);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.section-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 950;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.section-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}

.section-subtitle strong {
  color: #fff;
  font-weight: 700;
}

.helmets-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 80px;
}

.helmet-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  padding: 40px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.helmet-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(225, 29, 72, 0.3);
  transform: translateY(-15px);
}

.featured-card {
  background: rgba(225, 29, 72, 0.03);
  border-color: rgba(225, 29, 72, 0.1);
  transform: scale(1.05);
}

.helmet-visual {
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.helmet-icon-box {
  font-size: 3rem;
  background: rgba(255, 255, 255, 0.05);
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.helmet-tag {
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 100px;
  color: rgba(255, 255, 255, 0.5);
}

.featured-tag {
  background: var(--primary);
  color: #fff;
}

.helmet-info h3 {
  font-size: 1.75rem;
  font-weight: 900;
  margin-bottom: 16px;
  color: #fff;
}

.helmet-info p {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 24px;
  font-size: 1rem;
  line-height: 1.5;
}

.feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.feature-list li::before {
  content: '→';
  color: var(--primary-2);
  font-weight: 900;
}

.accessories-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 60px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-wrap: wrap;
  gap: 32px;
}

.brands-mini-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.brands-mini-info span {
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.1em;
}

.brands-placeholder {
  font-size: 1.25rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.05em;
}

@media (max-width: 1024px) {
  .helmets-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .featured-card {
    transform: scale(1);
  }
  .accessories-header {
    margin-bottom: 60px;
  }
}

@media (max-width: 640px) {
  .accessories-section {
    padding: 80px 0;
  }
  .accessories-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  .brands-placeholder {
    font-size: 1rem;
  }
}

/* Nuovi stili per la griglia dinamica dei caschi */
.helmets-dynamic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
  margin-bottom: 80px;
}

.helmet-product-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  overflow: hidden;
  transition: all 0.4s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.helmet-product-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--primary);
}

.product-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--primary);
  color: white;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  z-index: 10;
}

.product-visual {
  height: 300px;
  background: #000;
}

.product-info {
  padding: 30px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-category {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary-2);
  font-weight: 800;
  margin-bottom: 8px;
  display: block;
}

.product-name {
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  margin-bottom: 12px;
}

.product-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 24px;
}

.product-meta {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.product-price {
  display: flex;
  flex-direction: column;
}

.old-price {
  text-decoration: line-through;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.3);
}

.current-price {
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
}

.product-taglia {
  font-size: 0.85rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
}

.btn-info {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px;
  background: white;
  color: black;
  text-decoration: none;
  border-radius: 16px;
  font-weight: 800;
  transition: all 0.3s;
}

.btn-info:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-3px);
}

@media (max-width: 640px) {
  .helmets-dynamic-grid {
    grid-template-columns: 1fr;
  }
}
</style>
