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
  height: 100vh;
  height: 100dvh; /* Supporto per Safari mobile bottom bar */
  width: 100%;
  overflow: hidden;
  background: #000;
  display: flex;
  align-items: center;
}

.hero-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
  opacity: 0.6;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, 
    rgba(5, 5, 5, 0.4) 0%, 
    rgba(5, 5, 5, 0.2) 50%, 
    rgba(5, 5, 5, 0.8) 100%
  );
  z-index: 1;
}

.hero-container {
  position: relative;
  z-index: 2;
  width: 100%;
  padding-top: 60px;
}

.hero-text-wrapper {
  max-width: 800px;
  opacity: 0;
  transform: translateY(30px);
}

.hero-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(215, 24, 42, 0.15);
  border: 1px solid rgba(215, 24, 42, 0.3);
  color: var(--primary-2);
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  line-height: 1.1;
  font-weight: 900;
  margin-bottom: 24px;
  letter-spacing: -0.03em;
  color: #fff;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--muted);
  margin-bottom: 40px;
  max-width: 600px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

@media (max-width: 480px) {
  .hero-actions {
    flex-direction: column;
  }
  
  .hero-actions .btn-primary-custom,
  .hero-actions .btn-secondary-custom {
    width: 100%;
  }
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  opacity: 0;
}

.mouse {
  width: 26px;
  height: 42px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.wheel {
  width: 4px;
  height: 8px;
  background: var(--primary-2);
  border-radius: 2px;
  animation: scrollWheel 2s infinite;
}

@keyframes scrollWheel {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(15px); opacity: 0; }
}
</style>
