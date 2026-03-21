
<script setup>
import { onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

const lifestyleItems = [
  {
    title: 'Caschi & Accessori',
    desc: 'Dagli integrali racing ai jet urbani, scopri la nostra selezione dei migliori brand per la tua sicurezza.',
    icon: '🪖',
    link: '#accessori'
  },
  {
    title: 'Mondo Biker',
    desc: 'Resta aggiornato su motoraduni, community, codice della strada e consigli per la vita su due ruote.',
    icon: '🏁',
    link: '#mondo-biker'
  }
]

let ctx
onMounted(async () => {
  await nextTick()
  ctx = gsap.context(() => {
    gsap.fromTo('.lifestyle-card', 
      { opacity: 0, scale: 0.9 },
      {
        scrollTrigger: {
          trigger: '.lifestyle-grid',
          start: 'top 80%',
        },
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'back.out(1.2)',
        clearProps: 'all'
      }
    )
  })
})
</script>

<template>
  <section id="lifestyle" class="lifestyle-section">
    <div class="container">
      <div class="lifestyle-header">
        <p class="section-kicker">Lifestyle</p>
        <h2 class="section-title">Vivi la tua passione al massimo</h2>
        <p class="section-subtitle">
          Non vendiamo solo moto, ma tutto ciò che rende unico ogni tuo viaggio.
        </p>
      </div>

      <div class="lifestyle-grid">
        <div v-for="item in lifestyleItems" :key="item.title" class="lifestyle-card">
          <div class="lifestyle-icon">{{ item.icon }}</div>
          <div class="lifestyle-info">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <NuxtLink :to="item.link" class="btn-lifestyle">Esplora Ora</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lifestyle-section {
  padding: 100px 0;
  background: #080808;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.lifestyle-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-kicker {
  color: var(--primary-2);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.9rem;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 950;
  margin: 16px 0;
}

.section-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
}

.lifestyle-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.lifestyle-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 60px 40px;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.4s ease;
}

.lifestyle-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(225, 29, 72, 0.3);
  transform: translateY(-10px);
}

.lifestyle-icon {
  font-size: 4rem;
  margin-bottom: 32px;
}

.lifestyle-info h3 {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 16px;
}

.lifestyle-info p {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 32px;
  font-size: 1.1rem;
}

.btn-lifestyle {
  display: inline-block;
  padding: 12px 32px;
  background: var(--primary);
  color: #fff;
  text-decoration: none;
  border-radius: 100px;
  font-weight: 800;
  transition: all 0.3s ease;
}

.btn-lifestyle:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(225, 29, 72, 0.3);
}

@media (max-width: 768px) {
  .lifestyle-grid { grid-template-columns: 1fr; }
  .lifestyle-card { padding: 40px 24px; }
}
</style>
