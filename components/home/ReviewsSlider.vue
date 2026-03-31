
<template>
  <section class="reviews-section" id="reviews">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Cosa dicono di noi</h2>
        <p class="section-subtitle">
          Recensioni 5⭐ Road Runner Moto Capodrise - 
          <strong>Moto usate Capodrise</strong> & <strong>Concessionaria moto Caserta</strong>
        </p>
      </div>

      <div class="reviews-slider-container">
        <div class="reviews-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <div v-for="(review, index) in reviews" :key="index" class="review-slide">
            <ReviewCard 
              :text="review.text" 
              :author="review.author" 
              :avatar="review.avatar" 
            />
          </div>
        </div>

        <div class="slider-controls">
          <button @click="prevSlide" class="nav-btn prev" aria-label="Recensione precedente">‹</button>
          <div class="slider-dots">
            <span 
              v-for="(_, index) in reviews" 
              :key="index" 
              class="dot" 
              :class="{ active: currentIndex === index }"
              @click="goToSlide(index)"
            ></span>
          </div>
          <button @click="nextSlide" class="nav-btn next" aria-label="Recensione successiva">›</button>
        </div>
      </div>

      <div class="google-badge-container">
        <a href="https://www.google.com/search?sca_esv=8d67f07cd29c129e&sxsrf=ANbL-n5NdLrMaFtSNGZy6nYfmWat5rmLWA:1774971793498&q=road+runner+capodrise&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOWi4y2BmUQpnz2REyXkSv4Vs5RNsaxXs354nvXSIII8b6yICbt0R6u2npnnWME7J6GZvTko%3D&uds=ALYpb_lx5Hup9BUa31h6AkHudUb2K0KyRs0Tmz30Bubzs8aEHHo283VhvZz8wiaZfZg0pDik2OpUtQb82A2Lga8YiHl-Nt0ysYmrECXYqn5nbhC9OAeA09vuNA8fGLGkk0eGKledaUuY&sa=X&ved=2ahUKEwixkPOZvcqTAxU-8LsIHd3THBUQ3PALegQIGRAE&biw=1536&bih=711&dpr=1.25" target="_blank" rel="noopener noreferrer" class="google-badge">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Maps_icon_%282020%29.svg" alt="Google Maps" width="24" height="24" />
          <span>Vedi tutte le recensioni su Google</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ReviewCard from './ReviewCard.vue'

const reviews = [
  { text: "Pasquale esperto, moto perfetta!", author: "Marco", avatar: "" },
  { text: "Assistenza top, Honda usata ok!", author: "Luca", avatar: "" },
  { text: "Finanziamento veloce", author: "Anna", avatar: "" },
  { text: "Piaggio nuovo, servizio eccellente", author: "Giovanni", avatar: "" },
  { text: "Consiglio Road Runner!", author: "Fabio", avatar: "" }
]

const currentIndex = ref(0)
let timer = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % reviews.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + reviews.length) % reviews.length
}

const goToSlide = (index) => {
  currentIndex.value = index
}

const startAutoplay = () => {
  timer = setInterval(nextSlide, 5000)
}

const stopAutoplay = () => {
  if (timer) clearInterval(timer)
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
.reviews-section {
  padding: 5rem 0;
  background: #111;
  color: #fff;
  overflow: hidden;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #fff, #d4af37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  color: #888;
  font-size: 1.1rem;
}

.reviews-slider-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.reviews-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.review-slide {
  min-width: 100%;
  padding: 0 1rem;
}

.slider-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.nav-btn {
  background: none;
  border: 1px solid #333;
  color: #fff;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: #d4af37;
  border-color: #d4af37;
  color: #111;
}

.slider-dots {
  display: flex;
  gap: 0.75rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #333;
  cursor: pointer;
  transition: background 0.3s ease;
}

.dot.active {
  background: #d4af37;
}

.google-badge-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.google-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 50px;
  color: #eee;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.google-badge:hover {
  background: #222;
  border-color: #4285F4;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
}
</style>
