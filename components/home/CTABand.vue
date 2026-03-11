<script setup>
</script>

<template>
<section class="cta-band">
  <div class="container cta-band-shell">
    <div>
      <p class="section-kicker">Road Runner Moto</p>
      <h2>Competenza e passione al tuo servizio</h2>
      <p>Vieni in concessionaria per scoprire moto, scooter e accessori.</p>
    </div>
    <div class="cta-actions">
      <a href="tel:0823516087" class="btn-secondary-custom">0823 516087</a>
      <a href="https://wa.me/393391581997" target="_blank" rel="noopener noreferrer" class="btn-primary-custom">WhatsApp</a>
    </div>
  </div>
</section>
</template>
<style scoped>
.cta-band {
  padding: 10px 16px 88px;
  background: #050505;
  color: #f5f5f5;
}

.cta-band-shell {
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 24px;
  align-items: center;
  padding: 30px;
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,.08);
  background:
    linear-gradient(135deg, rgba(215,24,42,.14), rgba(255,91,107,.06)),
    linear-gradient(180deg, #151515, #0d0d0d);
}

.cta-band-shell h2 {
  margin: 0 0 12px;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
}

.cta-band-shell p {
  color: #bdbdbd;
  margin: 0 0 16px;
  font-size: 1rem;
}

.cta-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.btn-primary-custom,
.btn-secondary-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 14px 22px;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}

.btn-primary-custom {
  color: #fff;
  background: linear-gradient(135deg, #d7182a, #ff5b6b);
  box-shadow: 0 10px 26px rgba(215,24,42,.26);
}
.btn-primary-custom:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(215,24,42,.35);
}

.btn-secondary-custom {
  color: #fff;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.18);
}
.btn-secondary-custom:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,.08);
}

/* Responsive */
@media (max-width: 900px) {
  .cta-band-shell {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .cta-actions {
    justify-content: center;
  }
}
</style>