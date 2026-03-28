
<script setup>
import { onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

let ctx

onMounted(async () => {
  await nextTick()
  ctx = gsap.context(() => {
    // Reveal Titolo e Sottotitolo
    gsap.fromTo('.about-header > *', 
      { y: 40, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top 80%',
        },
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
        clearProps: 'all'
      }
    )

    // Reveal Paragrafi Testo con Stagger
    gsap.fromTo('.about-text p', 
      { y: 30, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.about-text',
          start: 'top 85%',
        },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        clearProps: 'all'
      }
    )

    // Animazione Visual Layered (Effetto Parallasse)
    const visualElements = document.querySelectorAll('.visual-layer')
    visualElements.forEach((el, i) => {
      gsap.fromTo(el, 
        { y: 60 * (i + 1), opacity: 0, scale: 0.9 },
        {
          scrollTrigger: {
            trigger: '.about-visual-container',
            start: 'top 75%',
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          delay: i * 0.2,
          ease: 'expo.out',
          clearProps: 'all'
        }
      )
    })

    // Parallasse continuo al movimento dello scroll
    gsap.to('.layer-main', {
      y: 30,
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })

    // Hover sulle icone valori
    gsap.fromTo('.value-card', 
      { scale: 0.9, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.about-values',
          start: 'top 90%',
        },
        scale: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        clearProps: 'all'
      }
    )
  })
})
</script>

<template>
  <section id="chi-siamo" class="about-section">
    <div class="container about-container">
      <div class="about-grid">
        
        <!-- Parte Testuale -->
        <div class="about-content">
          <div class="about-header">
            <p class="section-kicker">La nostra storia</p>
            <h2 class="about-title">ROAD RUNNER: Dove la passione diventa strada</h2>
            <p class="about-subtitle">Dall'officina al sogno, l'esperienza di Pasquale al tuo servizio.</p>
          </div>
          
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
            <div class="value-card">
              <span class="value-icon">🛠️</span>
              <div class="value-info">
                <strong>Esperienza Reale</strong>
                <p>Nati come meccanici, conosciamo ogni segreto delle moto che vendiamo.</p>
              </div>
            </div>
            <div class="value-card">
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

        <!-- Parte Visuale (Layered Animation) -->
        <div class="about-visual-container">
          <div class="visual-wrapper">
            <!-- Immagine principale -->
            <div class="visual-layer layer-main">
              <img 
                :src="'/about-story.jpg'" 
                alt="La nostra storia - ROAD RUNNER" 
                class="founder-img"
                loading="lazy"
                @error="(e) => e.target.src = 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=1000'"
              />
            </div>
            <!-- Badge esperienza -->
            <div class="visual-layer layer-badge">
              <div class="experience-badge-content">
                <span class="years">20+</span>
                <span class="label">Anni di Passione</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  padding: 60px 0;
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
  grid-template-columns: 1.1fr 0.9fr;
  gap: 100px;
  align-items: center;
}

/* Visual Layered Styles */
.about-visual-container {
  position: relative;
  height: clamp(400px, 60vw, 600px);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.visual-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 500px; /* Limita larghezza su desktop */
}

.visual-layer {
  position: absolute;
  border-radius: 24px;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.layer-main {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
  background: #111;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
  padding: 8px;
  aspect-ratio: 1 / 1;
}

.layer-main img, 
.layer-main .founder-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  border-radius: 16px;
  display: block;
}

.layer-badge {
  bottom: 5%;
  right: -2%;
  z-index: 10;
  transform-origin: bottom right;
}

.experience-badge-content {
  background: var(--primary-2);
  padding: 24px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 20px 40px rgba(225, 29, 72, 0.4);
  transform: rotate(5deg);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.experience-badge-content .years {
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1;
  color: #fff;
}

.experience-badge-content .label {
  font-size: clamp(0.6rem, 2vw, 0.8rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
}

/* Breakpoints Responsivi */
@media (max-width: 1024px) {
  .about-grid {
    gap: 60px;
  }
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .about-visual-container {
    height: 450px;
    margin-top: 20px;
  }

  .about-values {
    justify-content: center;
  }

  .value-card {
    text-align: left;
  }

  .about-actions {
    justify-content: center;
  }

  .layer-main {
    width: 85%;
    height: 85%;
  }

  .experience-badge-content {
    padding: 16px;
    transform: rotate(3deg) scale(0.85);
  }
}

@media (max-width: 480px) {
  .about-section {
    padding: 40px 0;
  }

  .about-visual-container {
    height: 350px;
  }

  .layer-main {
    width: 90%;
    height: 90%;
    padding: 6px;
  }

  .layer-badge {
    bottom: 2%;
    right: 2%;
  }

  .experience-badge-content {
    padding: 12px;
    transform: rotate(2deg) scale(0.75);
    border-radius: 14px;
  }
  
  .experience-badge-content .years {
    font-size: 1.8rem;
  }
}

/* Ottimizzazione per iOS Safari (viewport-fit: cover) */
@supports (-webkit-touch-callout: none) {
  .about-section {
    padding-bottom: calc(40px + env(safe-area-inset-bottom));
  }
}

/* Content Styles Refinement */
.value-card {
  display: flex;
  gap: 20px;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.4s ease;
}

.value-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(225, 29, 72, 0.3);
  transform: translateY(-5px);
}

@media (max-width: 1200px) {
  .about-grid { gap: 60px; }
  .layer-badge { right: 0; }
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

@media (max-width: 1024px) {
  .about-grid { grid-template-columns: 1fr; }
  .about-visual-container { height: 500px; order: -1; }
  .layer-main { padding: 30px; }
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
