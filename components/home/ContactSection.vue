<script setup>
</script>

<template>
<section id="contatti" class="contact-section">
  <div class="container contact-shell">
    <div class="contact-copy">
      <p class="section-kicker">Contatti</p>
      <h2>Vieni a trovarci</h2>
      <p>Road Runner è a Capodrise, in Via Retella 65. Moto nuove, usato selezionato e assistenza qualificata.</p>
    </div>
    <div class="contact-card">
      <h3>Contatti diretti</h3>
      <a href="tel:0823516087">Tel. 0823 516087</a>
      <a href="tel:+393391581997">Cell. +39 339 158 1997</a>
      <a href="mailto:inforoadrunner@libero.it">inforoadrunner@libero.it</a>
      <p>Via Retella 65, Capodrise (CE)</p>
      <div class="contact-buttons">
        <a href="https://wa.me/393391581997" target="_blank" rel="noopener noreferrer" class="btn-primary-custom full">Scrivici su WhatsApp</a>
        <a href="https://maps.google.com/?q=Via+Retella+65,+Capodrise" target="_blank" rel="noopener noreferrer" class="btn-secondary-custom full">Apri su Maps</a>
      </div>
    </div>
  </div>
</section>
</template>
<style scoped>
.contact-section {
  padding: 88px 16px;
  background: #050505;
  color: #f5f5f5;
}

.contact-shell {
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  gap: 24px;
}

.contact-copy p {
  color: #bdbdbd;
  margin-bottom: 12px;
  font-size: 1rem;
}

.contact-copy h2 {
  margin: 0 0 12px;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
}

.section-kicker {
  color: #ff5b6b;
  text-transform: uppercase;
  font-weight: 800;
  font-size: .85rem;
  letter-spacing: .12em;
}

.hours-box p {
  margin: 4px 0;
  color: #bdbdbd;
  font-size: .95rem;
}

.contact-card {
  display: grid;
  gap: 14px;
  padding: 24px;
  border-radius: 18px;
  background: linear-gradient(180deg, #131313, #0b0b0b);
  border: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 18px 50px rgba(0,0,0,.32);
}

.contact-card h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #ff5b6b;
  font-weight: 800;
  font-size: 1.25rem;
}

.contact-card a {
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  display: block;
  font-size: .95rem;
}

.contact-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.contact-buttons a {
  flex: 1 1 auto;
  text-align: center;
  min-height: 48px;
  line-height: 48px;
  border-radius: 12px;
  transition: transform 0.3s ease, background 0.3s ease;
}

.contact-buttons a.btn-primary-custom {
  background: linear-gradient(135deg, #d7182a, #ff5b6b);
}
.contact-buttons a.btn-primary-custom:hover {
  transform: translateY(-3px);
}

.contact-buttons a.btn-secondary-custom {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.18);
}
.contact-buttons a.btn-secondary-custom:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,.08);
}

/* Responsive */
@media (max-width: 900px) {
  .contact-shell {
    grid-template-columns: 1fr;
  }
}
</style>