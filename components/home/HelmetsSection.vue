
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

const currentSlide = ref(0)
const images = [
  { url: '/img/helmets/collezione (1).jpg', title: 'Showroom ROAD RUNNER', badge: 'Official Dealer' },
  { url: '/img/helmets/collezione (2).jpg', title: 'MomoDesign FGTR Blue', badge: 'Nuova Collezione' },
  { url: '/img/helmets/collezione (3).jpg', title: 'MomoDesign FGTR Green', badge: 'Nuowe Colorazioni' },
  { url: '/img/helmets/collezione (4).jpg', title: 'MomoDesign Classic Black', badge: 'Best Seller' },
  { url: '/img/helmets/collezione (5).jpg', title: 'MomoDesign Titanium', badge: 'Disponibilità Immediata' }
]

let autoplayInterval
const nextSlide = () => { currentSlide.value = (currentSlide.value + 1) % images.length }
const prevSlide = () => { currentSlide.value = (currentSlide.value - 1 + images.length) % images.length }

onMounted(() => {
  autoplayInterval = setInterval(nextSlide, 5000)
  
  // Animazioni GSAP
  gsap.from('.helmets-text-content > *', {
    scrollTrigger: {
      trigger: '.helmets-section',
      start: 'top 70%',
    },
    x: -50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
  })

  gsap.from('.helmets-visual-box', {
    scrollTrigger: {
      trigger: '.helmets-section',
      start: 'top 70%',
    },
    x: 50,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  })
})

onUnmounted(() => {
  if (autoplayInterval) clearInterval(autoplayInterval)
})
</script>

<template>
  <section id="caschi" class="helmets-section">
    <div class="container">
      <div class="helmets-grid">
        
        <!-- Parte Sinistra: Contenuto Testuale Strutturato -->
        <div class="helmets-text-content">
          <div class="kicker">Protezione & Stile</div>
          <h2 class="section-title">Caschi Protettivi</h2>
          <p class="section-intro">
            La nostra selezione esclusiva di caschi dei migliori brand. 
            Sicurezza, comfort e design per ogni tipologia di guida, dal commuting urbano ai lunghi viaggi touring.
          </p>

          <div class="brand-highlights">
            <!-- Blocco MomoDesign -->
            <div class="highlight-card">
              <div class="card-header">
                <span class="flag">🇮🇹</span>
                <h3>MomoDesign</h3>
                <span class="badge">Official Dealer</span>
              </div>
              <p>
                Vieni a scoprire da noi la nuova collezione <strong>MomoDesign</strong>. 
                Linee moderne, spirito urbano e personalità distintiva, con le nuovissime colorazioni 2026 ora disponibili in store.
              </p>
            </div>

            <!-- Blocco LS2 -->
            <div class="highlight-card">
              <div class="card-header">
                <span class="icon">🌬️</span>
                <h3>LS2 Airflow 2</h3>
                <span class="badge blue">Disponibile</span>
              </div>
              <p>
                La linea <strong>LS2 Airflow 2</strong> è l'alleato ideale per chi cerca praticità e leggerezza quotidiana. 
                Disponibile in varie misure e colorazioni per adattarsi a ogni stile.
              </p>
            </div>
          </div>

          <div class="commercial-badges">
            <span class="c-badge">🛡️ Massima Sicurezza</span>
            <span class="c-badge">☁️ Comfort Premium</span>
            <span class="c-badge">🎨 Varie Taglie & Colori</span>
          </div>

          <div class="cta-group">
            <NuxtLink to="/caschi" class="btn-primary-helmets">Esplora la collezione</NuxtLink>
            <a href="https://wa.me/393391581997" target="_blank" class="btn-outline-helmets">Richiedi informazioni</a>
          </div>
        </div>

        <!-- Parte Destra: Visual Carosello Premium -->
        <div class="helmets-visual-box">
          <div class="carousel-wrapper">
            <div class="carousel-inner" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div v-for="(img, index) in images" :key="index" class="carousel-item">
                <img :src="img.url" :alt="img.title" />
                <div class="item-overlay">
                  <span class="item-badge">{{ img.badge }}</span>
                  <h4>{{ img.title }}</h4>
                </div>
              </div>
            </div>
            
            <div class="carousel-nav">
              <button @click="prevSlide" class="nav-btn">←</button>
              <button @click="nextSlide" class="nav-btn">→</button>
            </div>

            <div class="carousel-dots">
              <span 
                v-for="(_, index) in images" 
                :key="index" 
                class="dot" 
                :class="{ active: currentSlide === index }"
                @click="currentSlide = index"
              ></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.helmets-section {
  padding: 120px 0;
  background: #080808;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
}

.helmets-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

/* Typography & Content */
.kicker {
  color: var(--primary);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.85rem;
  margin-bottom: 16px;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 950;
  margin-bottom: 24px;
  line-height: 1.1;
  color: white;
}

.section-intro {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 40px;
}

/* Brand Cards */
.brand-highlights {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
}

.highlight-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 24px;
  transition: all 0.3s ease;
}

.highlight-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(225, 29, 72, 0.3);
  transform: translateX(10px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.card-header h3 {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
}

.card-header .badge {
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  background: var(--primary);
  padding: 4px 10px;
  border-radius: 100px;
  margin-left: auto;
}

.card-header .badge.blue {
  background: #3b82f6;
}

.highlight-card p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  margin: 0;
}

.highlight-card p strong {
  color: white;
}

/* Badges */
.commercial-badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.c-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 16px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* CTA Buttons */
.cta-group {
  display: flex;
  gap: 20px;
}

.btn-primary-helmets {
  background: white;
  color: black;
  padding: 18px 36px;
  border-radius: 16px;
  font-weight: 900;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-outline-helmets {
  background: transparent;
  color: white;
  padding: 18px 36px;
  border-radius: 16px;
  font-weight: 900;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.btn-primary-helmets:hover {
  transform: translateY(-3px);
  background: var(--primary);
  color: white;
  box-shadow: 0 15px 30px rgba(225, 29, 72, 0.2);
}

.btn-outline-helmets:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.05);
}

/* Carousel Side */
.helmets-visual-box {
  position: relative;
  height: 700px;
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.carousel-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-inner {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1);
}

.carousel-item {
  min-width: 100%;
  height: 100%;
  position: relative;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 50px;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  color: white;
}

.item-badge {
  display: inline-block;
  background: var(--primary);
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.item-overlay h4 {
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  pointer-events: none;
}

.nav-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s;
  font-size: 1.2rem;
}

.nav-btn:hover {
  background: white;
  color: black;
}

.carousel-dots {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  width: 30px;
  border-radius: 4px;
  background: white;
}

/* Responsive */
@media (max-width: 1024px) {
  .helmets-grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  
  .helmets-visual-box {
    height: 500px;
    order: -1;
  }
}

@media (max-width: 640px) {
  .helmets-section { padding: 80px 0; }
  .cta-group { flex-direction: column; }
  .btn-primary-helmets, .btn-outline-helmets { text-align: center; }
  .helmets-visual-box { height: 400px; }
  .item-overlay { padding: 30px; }
}
</style>
