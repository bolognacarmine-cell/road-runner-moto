<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

onMounted(() => {
  const ctx = gsap.context(() => {
    gsap.from('.security-card', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      clearProps: 'all',
      scrollTrigger: {
        trigger: '.security-section',
        start: 'top 85%',
      }
    })
  })
})
</script>

<template>
  <section id="sicurezza" class="security-section">
    <div class="container">
      <div class="section-heading">
        <p class="section-kicker">Protezione Avanzata</p>
        <h2 class="section-title">Sicurezza per la tua moto</h2>
        <p class="section-subtitle">
          Offriamo soluzioni di sicurezza all'avanguardia per proteggere il tuo investimento. 
          Scegli tra localizzazione satellitare elettronica e sistemi meccanici integrati per una tranquillità totale.
        </p>
      </div>

      <div class="security-grid">
        <!-- Card 1: PagerSAT -->
        <div class="security-card">
          <div class="card-icon-box">
            <span class="card-icon">🛰️</span>
          </div>
          <div class="card-content">
            <h3 class="card-title">Localizzatore satellitare autogestito</h3>
            <p class="card-tagline">Controlla la tua moto 24/7 direttamente da smartphone.</p>
            <p class="card-description">
              PagerSAT è un localizzatore satellitare GPS autogestito che ti consente di vedere la posizione della tua moto in tempo reale. Invia notifiche istantanee in caso di movimento sospetto o tentativo di furto.
            </p>
            <ul class="benefit-list">
              <li>
                <span class="check-icon">✓</span>
                Localizzazione GPS in tempo reale
              </li>
              <li>
                <span class="check-icon">✓</span>
                Notifiche push per movimenti sospetti
              </li>
              <li>
                <span class="check-icon">✓</span>
                Gestione autonoma senza canoni esterni
              </li>
            </ul>
            <a href="http://www.tecnoalarm.srl" target="_blank" rel="noopener noreferrer" class="btn-security">
              Scopri PagerSAT sul sito Tecno Alarm
              <span class="arrow">→</span>
            </a>
          </div>
        </div>

        <!-- Card 2: EasyBlock -->
        <div class="security-card">
          <div class="card-icon-box">
            <span class="card-icon">🔒</span>
          </div>
          <div class="card-content">
            <h3 class="card-title">EasyBlock – Antifurto blocca ruota</h3>
            <p class="card-tagline">Sempre installato sulla moto, si attiva in pochi secondi.</p>
            <p class="card-description">
              EasyBlock è un antifurto meccanico blocca ruota installato fisso sulla moto che immobilizza la ruota per evitare il furto. Non richiede catene o lucchetti ingombranti da portare con sé.
            </p>
            <ul class="benefit-list">
              <li>
                <span class="check-icon">✓</span>
                Installato fisso sulla moto
              </li>
              <li>
                <span class="check-icon">✓</span>
                Rapido da usare e attivare
              </li>
              <li>
                <span class="check-icon">✓</span>
                Struttura robusta Made in Italy
              </li>
            </ul>
            <a href="https://it.easyblock.com/?utm_source=google&utm_medium=cpc&utm_campaign=%5BS%5D+-+Brand&gad_source=1&gad_campaignid=217516830" target="_blank" rel="noopener noreferrer" class="btn-security">
              Scopri EasyBlock blocca ruota
              <span class="arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.security-section {
  padding: 80px 0;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
}

@media (min-width: 992px) {
  .security-section {
    padding: 120px 0;
  }
}

.section-heading {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 40px;
  padding: 0 20px;
}

@media (min-width: 992px) {
  .section-heading {
    margin-bottom: 60px;
  }
}

.section-kicker {
  color: var(--primary-2, #ff5b6b);
  text-transform: uppercase;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  margin-bottom: 12px;
}

.section-title {
  font-size: clamp(2rem, 8vw, 3.5rem);
  font-weight: 950;
  margin-bottom: 20px;
  color: #fff;
  line-height: 1.1;
}

.section-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}

@media (min-width: 992px) {
  .section-subtitle {
    font-size: 1.15rem;
  }
}

.security-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  padding: 0 20px;
}

@media (min-width: 992px) {
  .security-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
    padding: 0;
  }
}

.security-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
}

@media (min-width: 992px) {
  .security-card {
    border-radius: 32px;
    padding: 48px;
  }
}

.security-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-8px);
}

.card-icon-box {
  width: 72px;
  height: 72px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
}

.card-icon {
  font-size: 2.5rem;
}

.card-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
}

.card-tagline {
  color: var(--primary-2, #ff5b6b);
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 24px;
}

.card-description {
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.7;
  margin-bottom: 32px;
  font-size: 1.05rem;
}

.benefit-list {
  list-style: none;
  padding: 0;
  margin: 0 0 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.benefit-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  font-size: 1rem;
}

.check-icon {
  color: var(--primary-2, #ff5b6b);
  font-weight: 900;
}

.btn-security {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  text-decoration: none;
  font-weight: 800;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-security .arrow {
  transition: transform 0.3s ease;
}

.btn-security:hover {
  color: var(--primary-2, #ff5b6b);
}

.btn-security:hover .arrow {
  transform: translateX(8px);
}

@media (max-width: 576px) {
  .security-card {
    padding: 32px;
  }
  
  .card-title {
    font-size: 1.5rem;
  }
}
</style>