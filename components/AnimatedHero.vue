<script setup>
import { onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'

onMounted(async () => {
  await nextTick()

  const ctx = gsap.context(() => {
    gsap.from('.hero-badge', { y: 20, opacity: 0, duration: 0.7 })
    gsap.from('.hero-title', { y: 40, opacity: 0, duration: 0.9, delay: 0.15 })
    gsap.from('.hero-subtitle, .hero-actions', {
      y: 24,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      delay: 0.35
    })
  })

  onUnmounted(() => ctx.revert())
})
</script>

<template>
  <section class="hero">
    <div class="hero-overlay" />
    <div class="container hero-content">
      <span class="hero-badge">Concessionaria moto e scooter a Capodrise</span>
      <h1 class="hero-title">
        La tua concessionaria di riferimento
        <span>per moto e scooter</span>
      </h1>
      <p class="hero-subtitle">
        Road Runner è la tua concessionaria di riferimento per moto e scooter a Capodrise,
        in Via Retella 65. Vendita plurimarche, assistenza qualificata, ricambi originali.
      </p>
      <div class="hero-actions">
        <a href="#moto" class="btn-primary-custom">Scopri i veicoli</a>
        <a href="tel:+393391581997" class="btn-secondary-custom">Chiama ora</a>
      </div>
    </div>
  </section>
</template>