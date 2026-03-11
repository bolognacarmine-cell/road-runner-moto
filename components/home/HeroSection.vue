<<<<<<< HEAD
<template>
  <section class="hero">
    <!-- Video di sfondo -->
    <video
      class="hero-video"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    >
      <source src="/hero-video.mp4" type="video/mp4" />
    </video>

    <!-- Overlay scuro sopra il video -->
    <div class="hero-overlay" />

    <!-- Contenuto testuale -->
    <div class="container hero-content">
      <span class="hero-badge">Concessionaria moto e scooter a Capodrise</span>
      <h1 class="hero-title">
        La tua concessionaria di riferimento
        <span class="hero-dynamic">per moto e scooter</span>
      </h1>
      <p class="hero-subtitle">
        Vendita plurimarche, assistenza qualificata e ricambi originali
      </p>
      <div class="hero-actions">
        <a href="#moto" class="btn-primary-custom">Scopri i veicoli</a>
        <a href="tel:+393391581997" class="btn-secondary-custom">Chiama ora</a>
      </div>
    </div>
  </section>
</template>

=======
>>>>>>> f586e87 (Aggiunto pannello admin e integrazione MongoDB/Cloudinary)
<script setup>
import { onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Props per dinamismo
defineProps({
  badge: { type: String, default: 'Concessionaria a Capodrise' },
  title: { type: String, default: 'Il tuo mondo in moto' },
  subtitle: { type: String, default: 'Vendita, assistenza e ricambi originali.' }
})

gsap.registerPlugin(ScrollTrigger)

onMounted(async () => {
  await nextTick()
  const ctx = gsap.context(() => {
    // Animazione di comparsa fluida ed elegante
    gsap.to('.hero-text-wrapper', {
      y: 0,
      opacity: 1,
      duration: 1.5,
      delay: 0.5,
      ease: 'power4.out'
    })

    // Stagger dei contenuti interni per profondità
    gsap.to('.hero-badge, .hero-title, .hero-subtitle, .hero-actions', {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      delay: 0.8,
      ease: 'power2.out'
    })

    gsap.to('.scroll-indicator', { 
      opacity: 0.6, 
      y: 0,
      duration: 1.2, 
      delay: 1.5 
    })

    // Parallasse discreto sullo scroll
    gsap.to('.hero-text-wrapper', {
      y: -30,
      opacity: 0.5,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    })
  })
  onUnmounted(() => ctx.revert())
})
</script>

<template>
  <section class="hero">
    <!-- Video di sfondo -->
    <video
      class="hero-video"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    >
      <source src="/hero-video.mp4" type="video/mp4" />
    </video>

    <!-- Overlay scuro molto leggero -->
    <div class="hero-overlay" />

    <!-- Contenuto testuale al fondo -->
    <div class="hero-container">
      <div class="container hero-content-wrapper">
        <div class="hero-content">
          <div class="hero-text-wrapper">
            <span class="hero-badge">{{ badge }}</span>
            <h1 class="hero-title">
              {{ title }}
            </h1>
            <p class="hero-subtitle">
              {{ subtitle }}
            </p>
            <div class="hero-actions">
              <a href="#moto" class="btn-primary-custom">Vedi moto</a>
              <a href="tel:+393391581997" class="btn-secondary-custom">Contattaci</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <div class="arrows">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
<<<<<<< HEAD
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000;
=======
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #000;
  padding: 0;
  margin: 0;
>>>>>>> f586e87 (Aggiunto pannello admin e integrazione MongoDB/Cloudinary)
}

/* Video a tutto schermo */
.hero-video {
  position: absolute;
<<<<<<< HEAD
  inset: 0;
=======
  top: 0;
  left: 0;
>>>>>>> f586e87 (Aggiunto pannello admin e integrazione MongoDB/Cloudinary)
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

<<<<<<< HEAD
/* Overlay scuro con gradiente per leggibilita del testo */
=======
/* Overlay scuro molto leggero per dare spazio al video */
>>>>>>> f586e87 (Aggiunto pannello admin e integrazione MongoDB/Cloudinary)
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
<<<<<<< HEAD
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.7)),
    radial-gradient(circle at top, rgba(215, 24, 42, 0.12), transparent 40%);
}

/* Contenuto testuale sopra il video */
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 920px;
  padding: 90px 20px 80px;
=======
  background: linear-gradient(to bottom, 
    rgba(0, 0, 0, 0.2) 0%, 
    rgba(0, 0, 0, 0.05) 40%, 
    rgba(0, 0, 0, 0.4) 100%
  );
}

.hero-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 40%);
}

/* Contenitore principale per posizionamento al fondo */
.hero-container {
  position: absolute;
  top: auto; /* Forza l'ancoraggio al fondo */
  bottom: 50px; /* Distanza dal fondo */
  left: 0;
  right: 0;
  width: 100%;
  z-index: 5;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.hero-content-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  pointer-events: auto; /* Riabilita i click sul contenuto reale (bottoni) */
}

/* Contenuto testuale ultra-discreto */
.hero-content {
  text-align: center;
  max-width: 700px;
  will-change: transform, opacity;
  overflow: hidden; /* Fondamentale per l'effetto reveal */
  padding: 10px;
}

.hero-text-wrapper {
  padding: 24px 40px;
  border-radius: 24px;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0; /* Nascondi inizialmente per evitare flicker */
  transform: translateY(20px); /* Posizione iniziale per l'animazione */
}

.hero-badge, .hero-title, .hero-subtitle, .hero-actions {
  opacity: 0; /* Nascondi i figli per l'animazione stagger */
>>>>>>> f586e87 (Aggiunto pannello admin e integrazione MongoDB/Cloudinary)
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
<<<<<<< HEAD
  margin-bottom: 18px;
  padding: 10px 20px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 0.95rem;
  color: #fff;
  backdrop-filter: blur(6px);
  letter-spacing: 0.03em;
}

.hero-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(2.7rem, 6vw, 5.4rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: #fff;
  text-transform: uppercase;
  margin-bottom: 18px;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.hero-dynamic {
  display: block;
  background: linear-gradient(90deg, #ff5b6b, #d7182a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
  font-size: clamp(2.7rem, 6vw, 5.4rem);
  transform-origin: left center;
  will-change: transform, opacity;
  filter: drop-shadow(0 4px 20px rgba(215, 24, 42, 0.3));
}

.hero-subtitle {
  color: #e8e8e8;
  max-width: 760px;
  margin: 0 auto 30px;
  font-size: 1.15rem;
  line-height: 1.7;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
=======
  margin-bottom: 12px;
  padding: 4px 16px;
  border-radius: 100px;
  background: rgba(215, 24, 42, 0.1);
  border: 1px solid rgba(215, 24, 42, 0.2);
  font-size: 0.7rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.hero-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(1.6rem, 4vw, 2.6rem); /* Dimensione ridotta */
  font-weight: 300;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #fff;
  text-transform: none;
  margin-bottom: 8px;
}

.hero-dynamic {
  display: inline; /* In riga */
  font-weight: 700;
  color: var(--primary);
  background: none;
  -webkit-text-fill-color: initial;
  filter: none;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.7);
  max-width: 450px;
  margin: 0 0 20px;
  font-size: 0.95rem;
  line-height: 1.5;
  font-weight: 400;
>>>>>>> f586e87 (Aggiunto pannello admin e integrazione MongoDB/Cloudinary)
}

.hero-actions {
  display: flex;
<<<<<<< HEAD
  gap: 14px;
=======
  gap: 12px;
>>>>>>> f586e87 (Aggiunto pannello admin e integrazione MongoDB/Cloudinary)
  justify-content: center;
  flex-wrap: wrap;
}

<<<<<<< HEAD
/* Responsive */
@media (max-width: 900px) {
  .hero {
    min-height: 86vh;
  }
  .hero-content {
    padding: 80px 16px 68px;
  }
}
=======
.btn-primary-custom, .btn-secondary-custom {
  min-height: 38px;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Scroll Indicator Styles */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  right: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 3;
  opacity: 0; /* Nascondi inizialmente */
  transform: translateY(20px);
}

.mouse {
  width: 26px;
  height: 42px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  position: relative;
}

.wheel {
  width: 4px;
  height: 8px;
  background: #fff;
  border-radius: 2px;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  animation: scroll-wheel 1.5s infinite;
}

.arrows span {
  display: block;
  width: 10px;
  height: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  border-right: 2px solid rgba(255, 255, 255, 0.5);
  transform: rotate(45deg);
  margin: -4px;
  animation: scroll-arrows 1.5s infinite;
}

.arrows span:nth-child(2) { animation-delay: 0.2s; }
.arrows span:nth-child(3) { animation-delay: 0.4s; }

@keyframes scroll-wheel {
  0% { opacity: 0; transform: translate(-50%, 0); }
  30% { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, 15px); }
}

@keyframes scroll-arrows {
  0% { opacity: 0; transform: rotate(45deg) translate(-5px, -5px); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: rotate(45deg) translate(5px, 5px); }
}

/* Responsive */
@media (max-width: 900px) {
  .hero {
    min-height: 90vh;
  }
  .hero-content {
    padding: 0 16px;
  }
  .scroll-indicator {
    bottom: 20px;
  }
  .hero-actions {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
  .btn-primary-custom, .btn-secondary-custom {
    width: 100%;
  }
}
>>>>>>> f586e87 (Aggiunto pannello admin e integrazione MongoDB/Cloudinary)
</style>
