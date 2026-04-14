<script setup>
import { onMounted, onUnmounted, nextTick, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

defineProps({
  badge: { type: String, default: 'Concessionaria a Capodrise' },
  title: { type: String, default: 'Il tuo mondo in moto' },
  subtitle: { type: String, default: 'Vendita, finanziamenti e assistenza specializzata.' }
})

gsap.registerPlugin(ScrollTrigger)

let ctx
const videoLoaded = ref(false)

onMounted(async () => {
  await nextTick()

  const video = document.querySelector('.hero-video')
  if (video) {
    video.play().then(() => {
      videoLoaded.value = true
    }).catch(() => {
      videoLoaded.value = false
    })
  }

  ctx = gsap.context(() => {
    const textWrapper = document.querySelector('.hero-text-wrapper')
    if (textWrapper) {
      gsap.fromTo(textWrapper,
        { opacity: 0, y: 30 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          delay: 0.1, // Ridotto per migliorare LCP/FCP
          ease: 'power4.out'
        }
      )
    }

    const internalContent = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-actions')
    if (internalContent.length > 0) {
      gsap.fromTo(internalContent,
        { opacity: 0, y: 20 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.05, // Ridotto per migliorare LCP/FCP
          delay: 0.2, // Ridotto per migliorare LCP/FCP
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
    <div class="hero-video-wrapper">
      <video
        class="hero-video desktop-only"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        poster="/cta-bg.jpg"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <!-- Fallback statico per mobile per migliorare LCP -->
      <div class="hero-mobile-bg mobile-only" />
      <div class="hero-overlay" />
    </div>

    <div class="container hero-container">
      <div class="hero-content">
        <div class="hero-text-wrapper">
          <div class="hero-badge-wrapper">
            <span class="hero-badge">{{ badge }}</span>
          </div>
          <h1 class="hero-title" fetchpriority="high">
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
    padding: 100px 0;
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
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.6) contrast(1.1);
}

<<<<<<< HEAD
.hero-mobile-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/cta-bg.jpg') center/cover no-repeat;
  filter: brightness(0.5);
}

/* Visibility helpers */
.desktop-only { display: block; }
.mobile-only { display: none; }

@media (max-width: 768px) {
  .desktop-only { display: none; }
  .mobile-only { display: block; }
}

.hero-overlay {
=======
.hero-video:not([src*=".mp4"]) {
   display: none;
 }

 .hero-overlay {
>>>>>>> 1bbc17e (Fix hero video visibility - add z-index to hero-content and poster fallback image for mobile)
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

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-text-wrapper {
  max-width: 800px;
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