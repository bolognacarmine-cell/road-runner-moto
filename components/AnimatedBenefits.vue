<script setup>
import { onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'

onMounted(async () => {
  await nextTick()

  const ctx = gsap.context(() => {
    const cards = document.querySelectorAll('.benefit-card')
    if (cards.length > 0) {
      gsap.from(cards, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        delay: 0.2
      })
    }
  })

  onUnmounted(() => ctx.revert())
})
</script>

<template>
  <section id="servizi" class="benefits-section">
    <div class="container">
      <div class="section-heading">
        <p class="section-kicker">Servizi</p>
        <h2>I nostri servizi</h2>
        <p>Una gamma completa di servizi per tutti gli appassionati delle due ruote.</p>
      </div>
      <div class="benefits-grid">
        <div class="benefit-card">
          <h3>Vendita veicoli</h3>
          <p>Ampia scelta di moto e scooter nuovi e usati plurimarche.</p>
        </div>
        <div class="benefit-card">
          <h3>Assistenza qualificata</h3>
          <p>Servizi di manutenzione e assistenza specializzata per ogni esigenza.</p>
        </div>
        <div class="benefit-card">
          <h3>Ricambi originali</h3>
          <p>Disponibilità di ricambi originali per garantire qualità e affidabilità.</p>
        </div>
      </div>
    </div>
  </section>
</template>