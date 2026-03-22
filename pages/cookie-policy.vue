<script setup>
useHead({
  title: 'Cookie Policy | Road Runner Moto',
  meta: [
    { name: 'description', content: 'Informativa sui cookie di Road Runner Moto. Gestione del consenso e tipologie di cookie utilizzati.' },
    { name: 'robots', content: 'noindex, follow' }
  ]
})
</script>

<template>
  <div class="legal-page">
    <!-- Header Decorativo con Gradiente -->
    <div class="legal-hero">
      <div class="container">
        <span class="legal-badge">Cookie & Preferenze</span>
        <h1 class="legal-title">Cookie Policy</h1>
        <p class="legal-subtitle">Gestione del consenso e dettagli sulle tecnologie di tracciamento.</p>
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
              <li><a href="#cosa-sono">1. Cosa sono i Cookie</a></li>
              <li><a href="#tipologia">2. Tipologie Utilizzate</a></li>
              <li><a href="#gestione">3. Gestione Consenso</a></li>
              <li><a href="#disabilitare">4. Come Disabilitare</a></li>
              <li><a href="#titolare">5. Titolare</a></li>
            </ul>
          </div>
        </aside>

        <!-- Contenuto Principale -->
        <main class="legal-content">
          <div class="update-info">
            <span>Ultimo aggiornamento: 22 Marzo 2026</span>
          </div>

          <section id="cosa-sono" class="legal-section">
            <div class="section-number">01</div>
            <h2>Cosa sono i cookie</h2>
            <div class="section-body">
              <p>I cookie sono piccoli file di testo che i siti visitati dall'utente inviano al suo terminale, dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla successiva visita del medesimo utente.</p>
            </div>
          </section>

          <section id="tipologia" class="legal-section">
            <div class="section-number">02</div>
            <h2>Tipologia di cookie utilizzati</h2>
            <div class="section-body">
              <p>In conformità alle Linee Guida Garante Privacy 2021, utilizziamo cookie granulari:</p>
              
              <div class="table-container">
                <table class="legal-table">
                  <thead>
                    <tr>
                      <th>Nome Cookie</th>
                      <th>Fornitore</th>
                      <th>Finalità</th>
                      <th>Durata</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>cookie-consent</td>
                      <td>Proprio</td>
                      <td>Preferenze consenso</td>
                      <td>1 anno</td>
                    </tr>
                    <tr>
                      <td>_ga, _gid</td>
                      <td>Google Analytics</td>
                      <td>Analitici (Anonimi)</td>
                      <td>2 anni / 24h</td>
                    </tr>
                    <tr>
                      <td>NID, CONSENT</td>
                      <td>Google</td>
                      <td>Preferenze (previo consenso)</td>
                      <td>6 mesi</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="cookie-types-grid">
                <div class="cookie-type-card">
                  <strong>Cookie Tecnici</strong>
                  <p>Strettamente necessari per il funzionamento del sito (login, sicurezza).</p>
                </div>
                <div class="cookie-type-card">
                  <strong>Cookie Analitici</strong>
                  <p>Utilizzati per statistiche aggregate con IP Masking attivo.</p>
                </div>
                <div class="cookie-type-card">
                  <strong>Terze Parti</strong>
                  <p>Installati solo dopo il tuo consenso esplicito per mappe o video.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="gestione" class="legal-section">
            <div class="section-number">03</div>
            <h2>Gestione del consenso</h2>
            <div class="section-body">
              <p>Tramite il banner presente al primo accesso, puoi scegliere quali categorie accettare. Puoi resettare le tue scelte in ogni momento tramite il pulsante delle preferenze o cancellando i cookie del browser.</p>
            </div>
          </section>

          <section id="disabilitare" class="legal-section">
            <div class="section-number">04</div>
            <h2>Come disabilitare i cookie dal browser</h2>
            <div class="section-body">
              <p>Puoi configurare il tuo browser per rifiutare i cookie seguendo le guide ufficiali:</p>
              <div class="browser-links">
                <a href="#" class="browser-link">Google Chrome</a>
                <a href="#" class="browser-link">Mozilla Firefox</a>
                <a href="#" class="browser-link">Apple Safari</a>
                <a href="#" class="browser-link">Microsoft Edge</a>
              </div>
            </div>
          </section>

          <section id="titolare" class="legal-section">
            <div class="section-number">05</div>
            <h2>Titolare del Trattamento</h2>
            <div class="section-body">
              <p>Il Titolare del Trattamento è <strong>ROAD RUNNER DI TARTAGLIONE PASQUALE</strong>.</p>
              <div class="fiscal-card">
                <div class="fiscal-item">
                  <span>Sede Legale</span>
                  <strong>Via San Francesco 13, Capodrise (CE)</strong>
                </div>
                <div class="fiscal-item">
                  <span>P.IVA</span>
                  <strong>04335610616</strong>
                </div>
                <div class="fiscal-item">
                  <span>Email</span>
                  <strong>inforoadrunner@libero.it</strong>
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

/* Table */
.table-container {
  overflow-x: auto;
  margin: 32px 0;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.legal-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.02);
}

.legal-table th, .legal-table td {
  padding: 20px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.legal-table th {
  background: rgba(255, 255, 255, 0.03);
  color: var(--primary-2);
  font-weight: 800;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Grids */
.cookie-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.cookie-type-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 20px;
  transition: transform 0.3s ease;
}

.cookie-type-card:hover {
  transform: translateY(-5px);
  border-color: rgba(225, 29, 72, 0.2);
}

.cookie-type-card strong {
  display: block;
  margin-bottom: 8px;
  color: #fff;
  font-size: 1.1rem;
}

.browser-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.browser-link {
  background: rgba(255, 255, 255, 0.03);
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.browser-link:hover {
  background: var(--primary-2);
  color: #fff;
  border-color: var(--primary-2);
}

.fiscal-card {
  background: var(--panel);
  padding: 40px;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 40px;
  display: grid;
  gap: 32px;
}

.fiscal-item span {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}

.fiscal-item strong {
  font-size: 1.25rem;
  color: #fff;
}
</style>
