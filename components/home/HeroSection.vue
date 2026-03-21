<template>
  <section class="hero">
    <div class="hero-overlay" />
    <div class="container hero-content">
      <span class="hero-badge">Concessionaria moto e scooter a Capodrise</span>
      <h1 class="hero-title">
        La tua concessionaria di riferimento
        <span class="hero-dynamic">per moto e scooter</span>
      </h1>
      <p class="hero-subtitle">
        Road Runner è la tua concessionaria di riferimento per moto e scooter a Capodrise.
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
  background: linear-gradient(135deg, #111, #222);
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: url('/hero-bg.jpg') center/cover no-repeat;
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: justify; /* titolo giustificato */
  padding: 0 20px;
}

.hero-title {
  font-family: 'Anton', sans-serif; /* font graffiante */
  font-size: clamp(2rem, 6vw, 4rem);
  line-height: 1.1;
  color: #fff;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  overflow: hidden;
}

.hero-dynamic {
  display: inline-block;
  background: linear-gradient(90deg, #ff5b6b, #d7182a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
  font-size: clamp(2rem, 6vw, 4rem);
  transform-origin: left center;
  will-change: transform, opacity;
}

.hero-subtitle {
  margin-top: 16px;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: #eee;
}

.btn-primary-custom {
  background: linear-gradient(135deg, #d7182a, #ff5b6b);
  color: #fff;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  font-weight: 700;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-right: 1rem;
}

.btn-primary-custom:hover {
  transform: translateY(-3px) rotate(-1deg);
  box-shadow: 0 10px 20px rgba(255,91,107,0.4);
}
</style>