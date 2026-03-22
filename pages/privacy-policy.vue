<script setup>
useHead({
  title: 'Privacy Policy | Road Runner Moto',
  meta: [
    { name: 'description', content: 'Informativa sulla privacy di Road Runner Moto. Scopri come trattiamo i tuoi dati personali in conformità al GDPR.' }
  ]
})

const openConsentManager = () => {
  if (window.silktideCookieBannerManager) {
    window.silktideCookieBannerManager.toggleModal(true);
  }
}
</script>

<template>
  <div class="legal-page">
    <!-- Header Decorativo con Gradiente -->
    <div class="legal-hero">
      <div class="container">
        <span class="legal-badge">Trasparenza & Sicurezza</span>
        <h1 class="legal-title">Privacy Policy</h1>
        <p class="legal-subtitle">Informativa sul trattamento dei dati personali ai sensi del GDPR.</p>
      </div>
      <div class="hero-glow"></div>
    </div>

    <div class="container legal-container">
      <div class="legal-layout">
        <!-- Sidebar Indice (Desktop) -->
        <aside class="legal-sidebar">
          <div class="index-card">
            <h3>Indice</h3>
            <ul>
              <li><a href="#titolare">1. Titolare</a></li>
              <li><a href="#dati">2. Dati Raccolti</a></li>
              <li><a href="#finalita">3. Finalità</a></li>
              <li><a href="#basi">4. Trasferimenti</a></li>
              <li><a href="#conservazione">5. Conservazione</a></li>
              <li><a href="#diritti">6. I tuoi Diritti</a></li>
            </ul>
          </div>
        </aside>

        <!-- Contenuto Principale -->
        <main class="legal-content">
          <div class="update-info">
            <span>Ultimo aggiornamento: 22 Marzo 2026</span>
          </div>

          <section id="titolare" class="legal-section">
            <div class="section-number">01</div>
            <h2>Titolare del Trattamento</h2>
            <div class="section-body">
              <p>Il Titolare del Trattamento dei dati è <strong>ROAD RUNNER DI TARTAGLIONE PASQUALE</strong>, con sede legale in VIA SAN FRANCESCO 13 - 81020 - CAPODRISE (CE). P.IVA: 04335610616. Email: <a href="mailto:inforoadrunner@libero.it">inforoadrunner@libero.it</a>.</p>
            </div>
          </section>

          <section id="dati" class="legal-section">
            <div class="section-number">02</div>
            <h2>Tipologia di dati raccolti</h2>
            <div class="section-body">
              <p>Attraverso questo sito web raccogliamo i seguenti dati personali:</p>
              <div class="data-grid">
                <div class="data-item">
                  <strong>Dati identificativi</strong>
                  <p>Nome, Cognome, Indirizzo (per valutazioni permuta).</p>
                </div>
                <div class="data-item">
                  <strong>Dati di contatto</strong>
                  <p>Email, numero di telefono (WhatsApp incluso).</p>
                </div>
                <div class="data-item">
                  <strong>Dati del veicolo</strong>
                  <p>Marca, modello, anno, km, condizioni e immagini.</p>
                </div>
                <div class="data-item">
                  <strong>Dati di navigazione</strong>
                  <p>Indirizzo IP, tipo di browser, dati di log anonimizzati.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="finalita" class="legal-section">
            <div class="section-number">03</div>
            <h2>Finalità e Basi Giuridiche</h2>
            <div class="section-body">
              <p>I dati vengono trattati per le seguenti finalità, basate su specifiche basi giuridiche:</p>
              <ul class="feature-list">
                <li><strong>Gestione Richieste & Preventivi:</strong> Esecuzione di misure precontrattuali su richiesta dell'interessato.</li>
                <li><strong>Valutazione Permuta:</strong> Necessaria per la formulazione di un'offerta commerciale tecnica.</li>
                <li><strong>Assistenza WhatsApp:</strong> Il contatto tramite WhatsApp (Meta Platforms, Inc.) avviene su iniziativa dell'utente. I dati sono trattati per fornire il supporto richiesto.</li>
                <li><strong>Obblighi Fiscali:</strong> Adempimento di obblighi di legge (es. fatturazione, registri vendita veicoli).</li>
                <li><strong>Analisi Statistica:</strong> Legittimo interesse del titolare (tramite cookie tecnici o analitici anonimizzati).</li>
              </ul>
            </div>
          </section>

          <section id="basi" class="legal-section">
            <div class="section-number">04</div>
            <h2>Trasferimenti extra-UE</h2>
            <div class="section-body">
              <p>Per l'erogazione di alcuni servizi (es. Google Analytics, Google Maps, WhatsApp), i dati potrebbero essere trasferiti verso server situati negli Stati Uniti.</p>
              <div class="info-box">
                <p>Tali trasferimenti sono garantiti dall'adesione dei fornitori al <strong>Data Privacy Framework (DPF)</strong> o dalla sottoscrizione di <strong>Clausole Contrattuali Standard (SCC)</strong> approvate dalla Commissione Europea.</p>
              </div>
            </div>
          </section>

          <section id="conservazione" class="legal-section">
            <div class="section-number">05</div>
            <h2>Tempi di conservazione</h2>
            <div class="section-body">
              <p>I dati personali saranno conservati secondo i seguenti criteri:</p>
              <ul class="feature-list">
                <li><strong>Dati di contatto/richieste:</strong> fino a 24 mesi dalla conclusione della gestione della richiesta, salvo instaurazione di un rapporto contrattuale.</li>
                <li><strong>Dati fiscali/contrattuali:</strong> per 10 anni come previsto dalla normativa civile e fiscale italiana.</li>
                <li><strong>Dati di navigazione:</strong> rimossi entro 12 mesi, salvo necessità di accertamento di reati.</li>
              </ul>
            </div>
          </section>

          <section id="diritti" class="legal-section">
            <div class="section-number">06</div>
            <h2>I tuoi Diritti</h2>
            <div class="section-body">
              <p>Ai sensi del GDPR, hai il diritto di accedere, rettificare, cancellare o limitare il trattamento dei tuoi dati.</p>
              
              <div class="legal-actions">
                <div class="contact-card">
                  <p>Per esercitare tali diritti, scrivi a:</p>
                  <a href="mailto:inforoadrunner@libero.it" class="btn-email">inforoadrunner@libero.it</a>
                </div>

                <div class="consent-card">
                  <p>Vuoi modificare le tue preferenze sui cookie?</p>
                  <button @click="openConsentManager" class="btn-consent">Gestisci Consenso</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legal-page {
  background: #030303;
  color: #fff;
  min-height: 100vh;
}

/* Hero Section */
.legal-hero {
  padding: 160px 0 80px;
  background: linear-gradient(to bottom, #0a0a0a, #030303);
  position: relative;
  overflow: hidden;
  text-align: center;
}

.hero-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 0%, rgba(225, 29, 72, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.legal-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(225, 29, 72, 0.1);
  color: var(--primary-2);
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
  border: 1px solid rgba(225, 29, 72, 0.2);
}

.legal-title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 950;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  background: linear-gradient(to bottom, #fff, #888);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.legal-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.5);
  max-width: 600px;
  margin: 0 auto;
}

/* Layout */
.legal-container {
  padding-bottom: 120px;
}

.legal-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 80px;
}

@media (max-width: 1024px) {
  .legal-layout {
    grid-template-columns: 1fr;
  }
  .legal-sidebar {
    display: none;
  }
}

/* Sidebar */
.index-card {
  position: sticky;
  top: 120px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 32px;
}

.index-card h3 {
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 20px;
  color: var(--primary-2);
}

.index-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.index-card a {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.index-card a:hover {
  color: #fff;
  padding-left: 5px;
}

/* Content Sections */
.update-info {
  margin-bottom: 60px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

.legal-section {
  margin-bottom: 80px;
  position: relative;
}

.section-number {
  font-size: 4rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.03);
  position: absolute;
  top: -20px;
  left: -20px;
  z-index: 0;
}

.legal-section h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.section-body {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.8;
  font-size: 1.1rem;
}

.section-body strong {
  color: #fff;
}

/* Grids & Boxes */
.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.data-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 20px;
  transition: transform 0.3s ease;
}

.data-item:hover {
  transform: translateY(-5px);
  border-color: rgba(225, 29, 72, 0.2);
}

.data-item strong {
  display: block;
  margin-bottom: 8px;
  color: var(--primary-2);
}

.data-item p {
  font-size: 0.95rem;
  margin: 0;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-list li {
  padding-left: 28px;
  position: relative;
}

.feature-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--primary-2);
  font-weight: 900;
}

.info-box {
  background: rgba(225, 29, 72, 0.05);
  border-left: 4px solid var(--primary);
  padding: 24px;
  border-radius: 0 16px 16px 0;
  margin-top: 24px;
}

.legal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .legal-actions {
    grid-template-columns: 1fr;
  }
}

.contact-card, .consent-card {
  background: var(--panel);
  padding: 40px;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.btn-consent {
  margin-top: 16px;
  padding: 12px 32px;
  background: var(--primary-2);
  color: #fff;
  border: none;
  border-radius: 100px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-consent:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(225, 29, 72, 0.2);
}

.btn-email {
  display: inline-block;
  margin-top: 16px;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary-2);
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.btn-email:hover {
  opacity: 0.8;
}
</style>
