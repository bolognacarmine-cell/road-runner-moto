
<script setup>
import { onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

onMounted(async () => {
  await nextTick()
  const ctx = gsap.context(() => {
    // Animazione testo
    gsap.from('.about-content > *', {
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 70%',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    })

    // Animazione immagine
    gsap.from('.about-image-wrapper', {
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 70%',
      },
      x: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out'
    })
  })
})
</script>

<template>
  <section id="chi-samo" class="about-section">
    <div class="container about-container">
      <div class="about-grid">
        
        <!-- Parte Testuale -->
        <div class="about-content">
          <p class="section-kicker">La nostra storia</p>
          <h2 class="about-title">ROAD RUNNER: Dove la passione diventa strada</h2>
          <p class="about-subtitle">Dall'officina al sogno, l'esperienza di Pasquale al tuo servizio.</p>
          
          <div class="about-text">
            <p>
              Tutto ha inizio tra l’odore di olio e il rumore dei motori in una piccola officina di provincia. È qui che <strong>Pasquale</strong>, spinto da una passione viscerale per le due ruote, ha iniziato il suo percorso. Non è stata solo una scuola di meccanica, ma una scuola di vita fatta di <strong>impegno, sacrificio e dedizione assoluta</strong>.
            </p>
            <p>
              Giorno dopo giorno, bullone dopo bullone, Pasquale è diventato quel meccanico di fiducia che ogni motociclista vorrebbe incontrare: colui che non si limita a riparare una moto, ma ne comprende l'anima.
            </p>
            <p>
              Con il tempo, quella competenza tecnica si è evoluta in qualcosa di più grande. Il sogno di Pasquale ha preso forma nella nascita di <strong>ROAD RUNNER</strong>: una realtà professionale dove l'esperienza reale sul campo incontra il mondo della vendita. Oggi, ROAD RUNNER non è solo una concessionaria, ma un punto di riferimento basato su <strong>serietà, competenza e un'attenzione maniacale verso il cliente</strong>.
            </p>
          </div>

          <div class="about-values">
            <div class="value-item">
              <span class="value-icon">🛠️</span>
              <div class="value-info">
                <strong>Esperienza Reale</strong>
                <p>Nati come meccanici, conosciamo ogni segreto delle moto che vendiamo.</p>
              </div>
            </div>
            <div class="value-item">
              <span class="value-icon">🤝</span>
              <div class="value-info">
                <strong>Serietà e Fiducia</strong>
                <p>Costruiamo rapporti duraturi basati sulla trasparenza e l'onestà.</p>
              </div>
            </div>
          </div>

          <div class="about-actions">
            <NuxtLink to="/#moto" class="btn-primary-custom">Scopri le nostre moto</NuxtLink>
            <NuxtLink to="/#contatti" class="btn-outline-custom">Contattaci</NuxtLink>
          </div>
        </div>

        <!-- Parte Visuale -->
        <div class="about-image-wrapper">
          <div class="image-stack">
            <div class="main-image">
              <img src="/logo-road-runner.jpg" alt="ROAD RUNNER Brand" />
            </div>
            <div class="accent-box"></div>
            <div class="experience-badge">
              <span class="years">20+</span>
              <span class="label">Anni di Passione</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  padding: 120px 0;
  background: #050505;
  color: #fff;
  overflow: hidden;
  position: relative;
}

.about-container {
  position: relative;
  z-index: 2;
}

.about-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 80px;
  align-items: center;
}

.section-kicker {
  color: var(--primary-2);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.about-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 950;
  line-height: 1.1;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
}

.about-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 32px;
  font-weight: 500;
}

.about-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
}

.about-text p {
  margin-bottom: 20px;
}

.about-text strong {
  color: #fff;
  font-weight: 700;
}

.about-values {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 48px;
}

.value-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.value-icon {
  font-size: 1.5rem;
  background: rgba(225, 29, 72, 0.1);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid rgba(225, 29, 72, 0.2);
}

.value-info strong {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.value-info p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
}

.about-actions {
  display: flex;
  gap: 20px;
}

.btn-outline-custom {
  padding: 14px 28px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
}

.btn-outline-custom:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #fff;
}

/* Visual Stack */
.about-image-wrapper {
  position: relative;
}

.image-stack {
  position: relative;
  padding: 20px;
}

.main-image {
  position: relative;
  z-index: 2;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  background: #fff;
  aspect-ratio: 4/5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image img {
  width: 80%;
  height: auto;
  object-fit: contain;
}

.accent-box {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100%;
  height: 100%;
  border: 2px solid var(--primary-2);
  border-radius: 24px;
  z-index: 1;
}

.experience-badge {
  position: absolute;
  bottom: 40px;
  left: -30px;
  background: var(--primary-2);
  padding: 24px;
  border-radius: 20px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 15px 30px rgba(225, 29, 72, 0.3);
}

.experience-badge .years {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
}

.experience-badge .label {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 4px;
  text-align: center;
}

@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  .about-image-wrapper {
    order: -1;
    max-width: 500px;
    margin: 0 auto;
  }
  .experience-badge {
    left: 20px;
    bottom: -20px;
  }
}

@media (max-width: 640px) {
  .about-values {
    grid-template-columns: 1fr;
  }
  .about-actions {
    flex-direction: column;
  }
  .btn-primary-custom, .btn-outline-custom {
    text-align: center;
  }
}
</style>
