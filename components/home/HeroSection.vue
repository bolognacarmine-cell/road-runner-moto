<script setup>
import { onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Props per dinamismo
defineProps({
  badge: { type: String, default: 'Concessionaria a Capodrise' },
  title: { type: String, default: 'Il tuo mondo in moto' },
  subtitle: { type: String, default: 'Vendita, finanziamenti e assistenza specializzata.' }
})

gsap.registerPlugin(ScrollTrigger)

let ctx

onMounted(async () => {
  await nextTick()
  ctx = gsap.context(() => {
    // Animazione di comparsa fluida ed elegante
    const textWrapper = document.querySelector('.hero-text-wrapper')
    if (textWrapper) {
      gsap.fromTo(textWrapper, 
        { opacity: 0, y: 30 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          delay: 0.5,
          ease: 'power4.out'
        }
      )
    }

    // Stagger dei contenuti interni per profondità
    const internalContent = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-actions')
    if (internalContent.length > 0) {
      gsap.fromTo(internalContent,
        { opacity: 0, y: 20 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          delay: 0.8,
          ease: 'power2.out'
        }
      )
    }

    const scrollIndicator = document.querySelector('.scroll-indicator')
    if (scrollIndicator) {
      gsap.fromTo(scrollIndicator, 
        { opacity: 0, y: 20 },
        { 
          opacity: 0.6, 
          y: 0,
          duration: 1.2, 
          delay: 1.5,
          clearProps: 'transform'
        }
      )
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
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <section class="hero">
    <!-- Video di sfondo con overlay gradiente -->
    <div class="hero-video-wrapper">
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
      <div class="hero-overlay" />
    </div>

    <!-- Contenuto testuale -->
    <div class="container hero-container">
      <div class="hero-content">
        <div class="hero-text-wrapper">
          <div class="hero-badge-wrapper">
            <span class="hero-badge">{{ badge }}</span>
          </div>
          <h1 class="hero-title">
            {{ title }}
          </h1>
          <p class="hero-subtitle">
            {{ subtitle }}
          </p>
          <div class="hero-actions">
            <NuxtLink to="/#moto" class="btn-primary-custom">
              Esplora Catalogo
            </NuxtLink>
            <NuxtLink to="/#assistenza" class="btn-secondary-custom">
              I Nostri Servizi
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
      <div class="mouse">
        <div class="wheel"></div>
      </div>
      <span>Scorri per scoprire</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: #000;
}

@media (max-width: 768px) {
  .hero {
    padding: 100px 0; /* Più spazio per il contenuto su mobile */
  }
}

.hero-video-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.6) contrast(1.1);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(3, 3, 3, 0.4) 0%,
    rgba(3, 3, 3, 0.2) 50%,
    rgba(3, 3, 3, 0.8) 100%
  );
}

.hero-container {
  position: relative;
  z-index: 2;
  padding-top: var(--header-h);
}

.hero-text-wrapper {
  max-width: 800px;
  /* Rimossa opacity per evitare card invisibili se GSAP non carica */
}

.hero-badge-wrapper {
  margin-bottom: 24px;
}

.hero-badge {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(225, 29, 72, 0.1);
  border: 1px solid rgba(225, 29, 72, 0.3);
  border-radius: 100px;
  color: var(--primary-2);
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}

.hero-title {
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 24px;
  color: white;
  text-wrap: balance;
}

.hero-subtitle {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 48px;
  max-width: 600px;
  line-height: 1.4;
}

.hero-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0.6;
}

.scroll-indicator span {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.5);
}

.mouse {
  width: 26px;
  height: 42px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  position: relative;
}

.wheel {
  width: 4px;
  height: 8px;
  background: white;
  border-radius: 2px;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  animation: scroll-wheel 2s infinite;
}

@keyframes scroll-wheel {
  0% { transform: translate(-50%, 0); opacity: 1; }
  100% { transform: translate(-50%, 15px); opacity: 0; }
}

@media (max-width: 768px) {
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  .hero-actions > * {
    width: 100%;
  }
}
</style>
