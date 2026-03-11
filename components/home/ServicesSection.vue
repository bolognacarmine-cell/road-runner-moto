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
  padding: 88px 16px;
  background: #050505;
  color: #f5f5f5;
}

.section-heading {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 40px;
}

.section-heading h2 {
  margin: 0 0 12px;
  font-size: clamp(2rem, 4vw, 3rem);
}

.section-kicker {
  color: #ff5b6b;
  text-transform: uppercase;
  font-weight: 800;
  font-size: .85rem;
  letter-spacing: .12em;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.benefit-card {
  border-radius: 18px;
  padding: 24px;
  background: linear-gradient(180deg, #131313, #0b0b0b);
  border: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 18px 50px rgba(0,0,0,.32);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.benefit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 60px rgba(0,0,0,.45);
}

.benefit-card h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #ff5b6b;
  font-weight: 800;
}

.benefit-card p {
  color: #bdbdbd;
  margin: 0;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 900px) {
  .benefits-grid {
    grid-template-columns: 1fr;
  }
}
</style>