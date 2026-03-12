<script setup>
</script>

<template>
<section id="servizi" class="benefits-section">
  <div class="container">
    <div class="section-heading">
      <p class="section-kicker">Servizi</p>
      <h2>I nostri servizi</h2>
      <p>Una gamma completa per tutti gli appassionati delle due ruote.</p>
    </div>
    <div class="benefits-grid">
      <div class="benefit-card"><h3>Vendita veicoli</h3><p>Ampia scelta di moto e scooter plurimarche.</p></div>
      <div class="benefit-card"><h3>Assistenza qualificata</h3><p>Servizi di manutenzione e assistenza specializzata.</p></div>
      <div class="benefit-card"><h3>Ricambi originali</h3><p>Disponibilità di ricambi originali di qualità.</p></div>
    </div>
  </div>
</section>
</template>
<style scoped>
.benefits-section {
  padding: 80px 0;
  background: var(--bg);
}

.section-heading {
  margin-bottom: 48px;
}

.section-kicker {
  color: var(--primary-2);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.section-heading h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  margin-bottom: 16px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .benefits-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}

.benefit-card {
  padding: 32px;
  background: var(--panel);
  border-radius: var(--radius);
  border: 1px solid var(--line);
  transition: transform var(--transition), border-color var(--transition);
}

@media (hover: hover) {
  .benefit-card:hover {
    transform: translateY(-8px);
    border-color: rgba(255, 255, 255, 0.15);
  }
}

.benefit-card h3 {
  margin-bottom: 16px;
  color: var(--primary-2);
  font-weight: 800;
  font-size: 1.25rem;
}

.benefit-card p {
  color: var(--muted);
  font-size: 1rem;
}
</style>