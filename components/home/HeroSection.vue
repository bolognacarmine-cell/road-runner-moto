<template>
  <section class="hero">
    <!-- Video di sfondo -->
    <video
      class="hero-video"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    >
      <source src="/hero-video.mp4" type="video/mp4" />
    </video>

    <!-- Overlay scuro sopra il video -->
    <div class="hero-overlay" />

    <!-- Contenuto testuale -->
    <div class="container hero-content">
      <span class="hero-badge">Concessionaria moto e scooter a Capodrise</span>
      <h1 class="hero-title">
        La tua concessionaria di riferimento
        <span class="hero-dynamic">per moto e scooter</span>
      </h1>
      <p class="hero-subtitle">
        Vendita plurimarche, assistenza qualificata e ricambi originali
      </p>
      <div class="hero-actions">
        <a href="#moto" class="btn-primary-custom">Scopri i veicoli</a>
        <a href="tel:+393391581997" class="btn-secondary-custom">Chiama ora</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

onMounted(async () => {
  await nextTick()
  const ctx = gsap.context(() => {
    // Animazioni di ingresso
    gsap.from('.hero-badge', { y: 30, opacity: 0, duration: 0.8 })
    gsap.from('.hero-title', { y: 50, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' })
    gsap.from('.hero-dynamic', { x: -100, rotation: -5, opacity: 0, duration: 1, delay: 0.4, ease: 'power3.out' })
    gsap.from('.hero-subtitle, .hero-actions', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      delay: 0.5
    })

    // Parallasse sullo scroll per effetto moto in movimento
    gsap.to('.hero-dynamic', {
      x: 50,
      rotation: 5,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })
  })
  onUnmounted(() => ctx.revert())
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000;
}

/* Video a tutto schermo */
.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* Overlay scuro con gradiente per leggibilita del testo */
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.7)),
    radial-gradient(circle at top, rgba(215, 24, 42, 0.12), transparent 40%);
}

/* Contenuto testuale sopra il video */
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 920px;
  padding: 90px 20px 80px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  padding: 10px 20px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 0.95rem;
  color: #fff;
  backdrop-filter: blur(6px);
  letter-spacing: 0.03em;
}

.hero-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(2.7rem, 6vw, 5.4rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: #fff;
  text-transform: uppercase;
  margin-bottom: 18px;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.hero-dynamic {
  display: block;
  background: linear-gradient(90deg, #ff5b6b, #d7182a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
  font-size: clamp(2.7rem, 6vw, 5.4rem);
  transform-origin: left center;
  will-change: transform, opacity;
  filter: drop-shadow(0 4px 20px rgba(215, 24, 42, 0.3));
}

.hero-subtitle {
  color: #e8e8e8;
  max-width: 760px;
  margin: 0 auto 30px;
  font-size: 1.15rem;
  line-height: 1.7;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.hero-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 900px) {
  .hero {
    min-height: 86vh;
  }
  .hero-content {
    padding: 80px 16px 68px;
  }
}
</style>
