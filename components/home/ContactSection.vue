<script setup>
</script>

<template>
<section id="contatti" class="contact-section">
  <div class="container">
    <div class="contact-grid">
      <div class="contact-info">
        <span class="section-kicker">Dove Siamo</span>
        <h2 class="section-title">Vieni a Trovarci</h2>
        <p class="section-description">Siamo a Capodrise, pronti ad accoglierti nel nostro showroom. Scopri la nostra gamma di moto e scooter e ricevi consulenza dedicata.</p>
        
        <div class="info-items">
          <div class="info-item">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div class="info-content">
              <h4>Indirizzo</h4>
              <p>Via San Francesco 13, Capodrise (CE)</p>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <div class="info-content">
              <h4>Telefono</h4>
              <p>0823 516087 / 339 158 1997</p>
            </div>
          </div>
          <div class="info-item">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div class="info-content">
              <h4>Email</h4>
              <p>inforoadrunner@libero.it</p>
            </div>
          </div>
        </div>
      </div>

      <div class="contact-card">
        <h3 class="card-title">Pronto a Partire?</h3>
        <p class="card-text">Scrivici o chiamaci per informazioni su modelli, prezzi e disponibilità.</p>
        <div class="card-actions">
          <a href="https://wa.me/393391581997" target="_blank" rel="noopener noreferrer" class="btn-primary-custom">
            Invia un Messaggio WhatsApp
          </a>
          <a href="https://maps.google.com/?q=Via+San+Francesco+13,+Capodrise" target="_blank" rel="noopener noreferrer" class="btn-secondary-custom">
            Ottieni Indicazioni Stradali
          </a>
        </div>
        <div class="opening-hours">
          <h5>Orari di Apertura</h5>
          <div class="hours-grid">
            <span>Lun - Ven:</span>
            <span>09:00 - 13:00, 15:30 - 19:30</span>
            <span>Sabato:</span>
            <span>09:00 - 13:00</span>
            <span>Domenica:</span>
            <span>Chiuso</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<style scoped>
.contact-section {
  padding: 60px 0;
  background: var(--bg);
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }
}

.section-kicker {
  color: var(--primary);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.875rem;
  margin-bottom: 12px;
  display: block;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  line-height: 1.1;
  margin-bottom: 24px;
}

.section-description {
  color: var(--muted);
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 48px;
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.info-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.info-icon {
  width: 48px;
  height: 48px;
  background: rgba(225, 29, 72, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
}

.info-content h4 {
  font-size: 1.125rem;
  margin-bottom: 4px;
  color: white;
}

.info-content p {
  color: var(--muted);
}

.contact-card {
  background: var(--panel);
  padding: 60px;
  border-radius: 40px;
  border: 1px solid var(--line);
}

.card-title {
  font-size: 2rem;
  margin-bottom: 16px;
}

.card-text {
  color: var(--muted);
  margin-bottom: 32px;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.opening-hours h5 {
  font-size: 1rem;
  margin-bottom: 16px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.hours-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 24px;
  font-size: 0.9375rem;
  color: var(--muted);
}

@media (max-width: 640px) {
  .contact-card {
    padding: 40px 24px;
  }
}
</style>