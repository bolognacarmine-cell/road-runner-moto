
<template>
  <div class="carousel-container" @mouseenter="showArrows = true" @mouseleave="showArrows = false">
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
        @click.stop="prevSlide" 
        v-show="showArrows"
      >
        <span>‹</span>
      </button>
      <button 
        class="nav-btn next" 
        @click.stop="nextSlide" 
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
          @click.stop="currentIndex = index"
        ></span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
  }
})

const currentIndex = ref(0)
const showArrows = ref(false)

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: v-bind(height);
  min-height: 200px;
  overflow: hidden;
  background: #000;
}

.carousel-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-slide {
  width: 100%;
  height: 100%;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Navigazione */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  font-size: 24px;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.nav-btn:hover {
  background: #ff5b6b;
}

.prev { left: 10px; }
.next { right: 10px; }

/* Pallini */
.carousel-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 10;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: #ff5b6b;
  transform: scale(1.2);
}
</style>
