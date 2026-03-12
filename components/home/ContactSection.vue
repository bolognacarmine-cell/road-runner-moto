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
  padding: 80px 0;
  background: var(--bg);
}

.contact-shell {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}

@media (min-width: 1024px) {
  .contact-shell {
    grid-template-columns: 1.1fr 0.9fr;
    gap: 60px;
    align-items: center;
  }
}

.contact-copy h2 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 900;
  margin-bottom: 24px;
}

.contact-copy p {
  color: var(--muted);
  font-size: 1.1rem;
  line-height: 1.7;
}

.section-kicker {
  color: var(--primary-2);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.contact-card {
  padding: 32px;
  background: var(--panel);
  border-radius: var(--radius);
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-card h3 {
  color: var(--primary-2);
  font-weight: 800;
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.contact-card a {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  transition: color var(--transition);
}

.contact-card a:hover {
  color: var(--primary-2);
}

.contact-card p {
  color: var(--muted);
  font-size: 1rem;
}

.contact-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 10px;
}

@media (min-width: 480px) {
  .contact-buttons {
    flex-direction: row;
  }
  
  .contact-buttons .btn-primary-custom,
  .contact-buttons .btn-secondary-custom {
    flex: 1;
  }
}
</style>