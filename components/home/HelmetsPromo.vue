
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentSlide = ref(0)
const images = [
  {
    url: 'https://images.weserv.nl/?url=https://trae-user-assets.s3.amazonaws.com/uploads/3a79f1f0-0d65-4b1d-876a-9f5b66781829/image.png',
    title: 'Showroom MomoDesign',
    desc: 'La nuova collezione 2026 disponibile'
  },
  {
    url: 'https://images.weserv.nl/?url=https://trae-user-assets.s3.amazonaws.com/uploads/1e176694-8031-414c-836d-004456181829/image.png',
    title: 'MomoDesign Blue Matte',
    desc: 'Stile urbano e distintivo'
  },
  {
    url: 'https://images.weserv.nl/?url=https://trae-user-assets.s3.amazonaws.com/uploads/7f651818-2900-4103-8310-310310310310/image.png',
    title: 'MomoDesign Military Green',
    desc: 'Design moderno e personalità'
  }
]

let autoplayInterval

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % images.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + images.length) % images.length
}

const setSlide = (index) => {
  currentSlide.value = index
}

onMounted(() => {
  autoplayInterval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  if (autoplayInterval) clearInterval(autoplayInterval)
})
</script>

<template>
  <div class="helmets-promo-card">
    <div class="promo-grid">
      <!-- Sezione Testi -->
      <div class="promo-content">
        <div class="brand-badge">Official Dealer</div>
        <h2 class="promo-title">Le linee casco per moto</h2>
        <p class="promo-intro">
          Vieni a scoprire da noi la nuova collezione <strong>MomoDesign</strong> e tanti altri modelli. 
          Nuove colorazioni Momo Design disponibili per la stagione 2026.
        </p>

        <div class="promo-sections">
          <div class="promo-item">
            <div class="item-header">
              <span class="item-icon">🇮🇹</span>
              <h3>MomoDesign</h3>
            </div>
            <p>
              Concessionario Ufficiale MomoDesign. Scopri una linea di caschi dal design moderno, 
              urbano e distintivo, pensata per chi cerca stile, comfort e personalità su ogni percorso.
            </p>
          </div>

          <div class="promo-divider"></div>

          <div class="promo-item">
            <div class="item-header">
              <span class="item-icon">🌬️</span>
              <h3>LS2 Airflow 2</h3>
            </div>
            <p>
              La linea LS2 Airflow 2 è disponibile in varie colorazioni e misure, ideale per chi 
              desidera un casco pratico, leggero e versatile per l’utilizzo quotidiano in città.
            </p>
          </div>
        </div>

        <div class="promo-actions">
          <NuxtLink to="/caschi" class="btn-promo-primary">Esplora ora</NuxtLink>
          <a href="https://wa.me/393391581997" target="_blank" class="btn-promo-outline">
            Richiedi informazioni
          </a>
        </div>
      </div>

      <!-- Sezione Carosello -->
      <div class="promo-visual">
        <div class="carousel-container">
          <div 
            class="carousel-track" 
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div 
              v-for="(img, index) in images" 
              :key="index" 
              class="slide"
            >
              <div class="slide-image-wrapper">
                <!-- Immagine con fallback elegante -->
                <img :src="img.url" :alt="img.title" @error="(e) => e.target.src = '/logo-road-runner.jpg'" />
                <div class="slide-overlay">
                  <h4>{{ img.title }}</h4>
                  <p>{{ img.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Controlli Carosello -->
          <button @click="prevSlide" class="nav-btn prev" aria-label="Precedente">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button @click="nextSlide" class="nav-btn next" aria-label="Successivo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          <!-- Indicatori -->
          <div class="carousel-dots">
            <button 
              v-for="(_, index) in images" 
              :key="index" 
              @click="setSlide(index)"
              class="dot"
              :class="{ active: currentSlide === index }"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.helmets-promo-card {
  background: linear-gradient(145deg, #111, #0a0a0a);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5);
  margin: 60px 0;
  position: relative;
}

.promo-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  min-height: 650px;
}

/* Content Side */
.promo-content {
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-badge {
  display: inline-block;
  background: var(--primary);
  color: white;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
  width: fit-content;
}

.promo-title {
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 950;
  line-height: 1.1;
  margin-bottom: 24px;
  color: white;
}

.promo-intro {
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 90%;
}

.promo-intro strong {
  color: white;
  font-weight: 700;
}

.promo-sections {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 50px;
}

.promo-item h3 {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: white;
}

.promo-item p {
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  font-size: 0.95rem;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.item-icon {
  font-size: 1.5rem;
}

.promo-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0.1), transparent);
  width: 100%;
}

.promo-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-promo-primary {
  background: white;
  color: black;
  padding: 16px 32px;
  border-radius: 16px;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.btn-promo-outline {
  background: transparent;
  color: white;
  padding: 16px 32px;
  border-radius: 16px;
  font-weight: 800;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.btn-promo-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
}

.btn-promo-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: white;
}

/* Visual Side - Carousel */
.promo-visual {
  position: relative;
  background: #000;
}

.carousel-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1);
}

.slide {
  min-width: 100%;
  height: 100%;
}

.slide-image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.slide-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
}

.slide-overlay h4 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 4px;
}

.slide-overlay p {
  opacity: 0.7;
  font-size: 0.9rem;
}

/* Carousel Controls */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s;
}

.nav-btn:hover {
  background: white;
  color: black;
}

.prev { left: 20px; }
.next { right: 20px; }

.nav-btn svg {
  width: 24px;
  height: 24px;
}

.carousel-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s;
}

.dot.active {
  width: 24px;
  border-radius: 4px;
  background: white;
}

/* Responsive */
@media (max-width: 1024px) {
  .promo-grid {
    grid-template-columns: 1fr;
  }
  
  .promo-visual {
    height: 450px;
    order: -1; /* Immagine sopra su tablet/mobile */
  }

  .promo-content {
    padding: 40px;
  }
}

@media (max-width: 640px) {
  .helmets-promo-card {
    border-radius: 24px;
    margin: 40px 0;
  }

  .promo-title {
    font-size: 2.2rem;
  }

  .promo-actions {
    flex-direction: column;
  }

  .btn-promo-primary, .btn-promo-outline {
    text-align: center;
    width: 100%;
  }

  .promo-visual {
    height: 350px;
  }
}
</style>
