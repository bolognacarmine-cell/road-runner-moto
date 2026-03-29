<template>
  <div class="finance-page">
    <div class="container main-container">
      <NuxtLink to="/" class="back-link">← Torna alla Home</NuxtLink>
      
      <div class="finance-grid">
        <!-- Parte Testuale -->
        <div class="finance-content">
          <p class="section-kicker">Finanziamenti</p>
          <h1>Acquisti Leggeri con Compass</h1>
          <p class="intro-text">
            Scegli la moto dei tuoi sogni e pagala in comode rate mensili. Grazie alla nostra partnership con <strong>Compass (Gruppo Mediobanca)</strong>, offriamo soluzioni di finanziamento veloci, sicure e su misura per te.
          </p>

          <div class="info-section">
            <h3>Vantaggi Aggiunti</h3>
            <p>Compass offre prestiti finalizzati per moto nuove e usate direttamente in concessionaria. Con rate personalizzabili e una procedura veloce, è la soluzione ideale per fidelizzare i clienti Road Runner Moto.</p>
          </div>

          <div class="info-grid">
            <div class="info-card">
              <h4>Documenti Obbligatori</h4>
              <ul>
                <li>Carta d'identità (o passaporto valido)</li>
                <li>Codice fiscale (o tessera sanitaria)</li>
                <li>Documento di reddito (ultima busta paga, dichiarazione redditi o cedolino pensione)</li>
              </ul>
            </div>

            <div class="info-card">
              <h4>Per Stranieri</h4>
              <ul>
                <li>Permesso di soggiorno regolare</li>
              </ul>
            </div>

            <div class="info-card">
              <h4>Requisiti Base</h4>
              <ul>
                <li>Età compresa tra 18 e 82 anni</li>
                <li>Residenza in Italia</li>
                <li>Capacità di rimborso dimostrabile (anche con garante)</li>
              </ul>
            </div>
          </div>

          <div class="cta-box">
            <p>Vieni a trovarci in sede per un preventivo gratuito e personalizzato.</p>
            <a href="https://wa.me/393391581997" target="_blank" class="btn-primary-custom">Richiedi Info su WhatsApp</a>
          </div>
        </div>

        <!-- Parte Visuale -->
        <div class="finance-visual">
          <div class="image-container">
            <img 
              :src="'/compass.jpg'" 
              alt="Compass - Acquisti Leggeri" 
              class="promo-img"
              loading="lazy"
              @error="(e) => e.target.src = '/compass.jpg'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.finance-page {
  background: #050505;
  color: #fff;
  min-height: 100vh;
  padding-top: 140px; /* Offset per l'header absolute */
  position: relative;
  z-index: 1;
}

.main-container {
  padding-bottom: 80px;
}

.back-link {
  color: var(--primary-2);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  transition: opacity 0.3s;
  display: inline-block;
  margin-bottom: 40px;
}

.back-link:hover {
  opacity: 0.8;
}

.finance-grid {
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 80px;
  align-items: start;
  position: relative;
}

.finance-content {
  min-width: 0;
  position: relative;
  z-index: 2;
}

.section-kicker {
  color: var(--primary-2);
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 0.2em;
  font-size: 0.8rem;
  margin-bottom: 16px;
}

h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 950;
  line-height: 1;
  margin-bottom: 24px;
}

.intro-text {
  font-size: 1.2rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 40px;
}

.info-section {
  background: rgba(255, 255, 255, 0.03);
  padding: 30px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 40px;
}

.info-section h3 {
  color: var(--primary-2);
  margin-bottom: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.info-card {
  background: rgba(255, 255, 255, 0.02);
  padding: 24px;
  border-radius: 20px;
  border-left: 4px solid var(--primary-2);
}

.info-card h4 {
  margin-bottom: 16px;
  font-size: 1.1rem;
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card ul li {
  margin-bottom: 8px;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-card ul li::before {
  content: "•";
  color: var(--primary-2);
  font-weight: bold;
}

.cta-box {
  text-align: center;
  padding: 40px;
  background: linear-gradient(135deg, rgba(225, 29, 72, 0.1) 0%, transparent 100%);
  border-radius: 30px;
  border: 1px solid rgba(225, 29, 72, 0.2);
}

.cta-box p {
  margin-bottom: 24px;
  font-weight: 600;
}

.finance-visual {
  position: sticky;
  top: 140px; /* Offset per l'header */
  z-index: 5;
}

.image-container {
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #111;
  aspect-ratio: 1 / 1;
}

.promo-img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Mostra tutto il logo senza tagli */
  display: block;
  padding: 20px;
}

/* --- Responsive Layout --- */

@media (max-width: 1100px) {
  .finance-page {
    padding-top: 120px;
  }
  
  .finance-grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  
  .finance-visual {
    position: relative;
    top: 0;
    max-width: 450px;
    margin: 0 auto;
    order: -1;
  }
  
  .image-container {
    aspect-ratio: 16 / 9;
  }
}

@media (max-width: 768px) {
  .finance-page {
    padding-top: 110px;
  }
  
  .finance-grid {
    gap: 40px;
  }
  
  h1 {
    font-size: 2.8rem;
  }
  
  .intro-text {
    font-size: 1.1rem;
    margin-bottom: 30px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .finance-page {
    padding-top: 100px;
  }
  
  h1 {
    font-size: 2.2rem;
  }
  
  .finance-visual {
    max-width: 100%;
  }
  
  .image-container {
    border-radius: 20px;
    aspect-ratio: 1 / 1; /* Torna a quadrato su mobile per il logo Compass */
  }
  
  .info-card {
    padding: 20px;
  }
  
  .info-card h4 {
    font-size: 1rem;
  }
  
  .info-card ul li {
    font-size: 0.85rem;
  }
}

/* Ottimizzazione per iOS Safari (viewport-fit: cover) */
@supports (-webkit-touch-callout: none) {
  .finance-page {
    padding-bottom: calc(80px + env(safe-area-inset-bottom));
  }
}
</style>
