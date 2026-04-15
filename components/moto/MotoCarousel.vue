
<template>
  <div class="carousel-container" @mouseenter="showArrows = true" @mouseleave="showArrows = false">
    <!-- Watermark Logo -->
    <div 
      v-if="(images && images.length > 0) || !images" 
      class="carousel-watermark"
      :class="watermarkPosition"
    >
      <img src="/logo-road-runner.jpg" alt="Road Runner" />
    </div>

    <!-- Immagini -->
    <div class="carousel-wrapper">
      <div 
        v-for="(img, index) in images" 
        :key="index"
        class="carousel-slide"
        v-show="currentIndex === index"
      >
        <img :src="img" :alt="altText" class="carousel-img" loading="lazy" />
      </div>
      
      <!-- Placeholder se non ci sono immagini -->
      <div v-if="!images || images.length === 0" class="carousel-slide">
        <img src="/logo-road-runner.jpg" :alt="altText" class="carousel-img" />
      </div>
    </div>

    <!-- Frecce (se più di una immagine) -->
    <template v-if="images && images.length > 1">
      <button 
        class="nav-btn prev" 
        @click.stop="handlePrevManual" 
        v-show="showArrows"
      >
        <span>‹</span>
      </button>
      <button 
        class="nav-btn next" 
        @click.stop="handleNextManual" 
        v-show="showArrows"
      >
        <span>›</span>
      </button>

      <!-- Indicatori (pallini) -->
      <div class="carousel-dots">
        <span 
          v-for="(_, index) in images" 
          :key="index"
          class="dot"
          :class="{ active: currentIndex === index }"
          @click.stop="manualSelect(index)"
        ></span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  altText: {
    type: String,
    default: 'Immagine Moto'
  },
  height: {
    type: String,
    default: '100%'
  },
  autoplayInterval: {
    type: Number,
    default: 4000 // 4 secondi
  },
  watermarkPosition: {
    type: String,
    default: 'top-right' // 'top-right' o 'top-left'
  }
})

const currentIndex = ref(0)
const showArrows = ref(false)
let timer = null

const startAutoplay = () => {
  if (props.images && props.images.length > 1) {
    stopAutoplay()
    timer = setInterval(() => {
      nextSlide()
    }, props.autoplayInterval)
  }
}

const stopAutoplay = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

const manualSelect = (index) => {
  currentIndex.value = index
  startAutoplay() // Reset timer
}

const handleNextManual = () => {
  nextSlide()
  startAutoplay() // Reset timer
}

const handlePrevManual = () => {
  prevSlide()
  startAutoplay() // Reset timer
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: v-bind(height);
  background: #000;
  overflow: hidden;
}

.carousel-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-slide {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Watermark Style */
.carousel-watermark {
  position: absolute;
  z-index: 30;
  pointer-events: none;
  /* Tecnica per mantenere colori e rimuovere il bianco (multiply) */
  mix-blend-mode: multiply;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  transition: all 0.3s ease;
}

/* Visibilità specifica per i Caschi (top-left) */
.carousel-watermark.top-left {
  top: 16px;
  left: 16px;
  opacity: 0.5; /* Più evidenziato per i caschi */
}

/* Visibilità specifica per le Moto (top-right) */
.carousel-watermark.top-right {
  top: 16px;
  right: 16px;
  opacity: 0.4; /* Aumentata visibilità anche per le moto */
}

.carousel-watermark img {
  width: 85px; /* Leggermente più grande per visibilità */
  height: auto;
  display: block;
}

@media (max-width: 768px) {
  .carousel-watermark.top-right {
    top: 12px;
    right: 12px;
  }
  .carousel-watermark.top-left {
    top: 12px;
    left: 12px;
  }
  .carousel-watermark img {
    width: 60px;
  }
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  font-size: 1.5rem;
}

.nav-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
  transform: translateY(-50%) scale(1.1);
}

.prev { left: 16px; }
.next { right: 16px; }

.carousel-dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: white;
  width: 24px;
  border-radius: 10px;
}
</style>
