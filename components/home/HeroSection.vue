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
    const textWrapper = document.querySelector('.hero-text-wrapper')
    if (textWrapper) {
      gsap.to(textWrapper, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        delay: 0.5,
        ease: 'power4.out'
      })
    }

    // Stagger dei contenuti interni per profondità
    const internalContent = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-actions')
    if (internalContent.length > 0) {
      gsap.to(internalContent, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        delay: 0.8,
        ease: 'power2.out'
      })
    }

    const scrollIndicator = document.querySelector('.scroll-indicator')
    if (scrollIndicator) {
      gsap.to(scrollIndicator, { 
        opacity: 0.6, 
        y: 0,
        duration: 1.2, 
        delay: 1.5 
      })
    }

    // Parallasse discreto sullo scroll
    if (textWrapper && document.querySelector('.hero')) {
      gsap.to(textWrapper, {
        y: -30,
        opacity: 0.5,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      })
    }
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
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #000;
  padding: 0;
  margin: 0;
}

/* Video a tutto schermo */
.hero-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* Overlay scuro molto leggero per dare spazio al video */
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
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
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

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
</style>
