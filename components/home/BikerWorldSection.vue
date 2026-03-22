
<script setup>
import { onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

const categories = [
  {
    id: 'motoraduni',
    title: 'Motoraduni',
    desc: 'Resta aggiornato sui principali incontri e raduni nazionali e locali. La passione si vive insieme.',
    icon: '🏁',
    link: 'https://www.motoraduni.it/',
    label: 'Vedi Calendario'
  },
  {
    id: 'convenzioni',
    title: 'Partner & Convenzioni',
    desc: 'Scopri le nostre collaborazioni attive e le iniziative dedicate ai clienti ROAD RUNNER.',
    icon: '🤝',
    link: '/#contatti',
    label: 'Scopri di più'
  },
  {
    id: 'guida-sicura',
    title: 'Guida Sicura',
    desc: 'Contenuti e approfondimenti per migliorare la tua tecnica di guida e viaggiare in sicurezza.',
    icon: '🛡️',
    link: 'https://www.motociclismo.it/sicurezza',
    label: 'Leggi Consigli'
  },
  {
    id: 'codice-strada',
    title: 'Codice della Strada',
    desc: 'Aggiornamenti normativi e notizie utili per essere sempre in regola su due ruote.',
    icon: '📜',
    link: 'https://www.aci.it/i-servizi/normative/codice-della-strada.html',
    label: 'Aggiornamenti'
  },
  {
    id: 'vita-biker',
    title: 'Vita da Motociclista',
    desc: 'Consigli pratici per la manutenzione, viaggi epici e la scelta dell\'abbigliamento tecnico.',
    icon: '🛣️',
    link: '/blog',
    label: 'Esplora Blog'
  },
  {
    id: 'community',
    title: 'Eventi & Community',
    desc: 'Unisciti alla nostra community sui social e partecipa agli eventi esclusivi in concessionaria.',
    icon: '👥',
    link: 'https://instagram.com',
    label: 'Seguici'
  }
]

let ctx
onMounted(async () => {
  await nextTick()
  ctx = gsap.context(() => {
    // Header Animation
    gsap.from('.biker-header > *', {
      scrollTrigger: {
        trigger: '.biker-world-section',
        start: 'top 80%',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    })

    // Cards Animation
    gsap.from('.category-card', {
      scrollTrigger: {
        trigger: '.categories-grid',
        start: 'top 85%',
      },
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power2.out'
    })

    // Video Section Animation
    gsap.from('.video-showcase', {
      scrollTrigger: {
        trigger: '.video-showcase',
        start: 'top 85%',
      },
      scale: 0.95,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out'
    })
  })
})
</script>

<template>
  <section id="mondo-biker" class="biker-world-section">
    <div class="container">
      
      <!-- Intestazione Sezione -->
      <div class="biker-header">
        <p class="section-kicker">Oltre la Vendita</p>
        <h2 class="section-title">Mondo Motociclista</h2>
        <p class="section-subtitle">
          Il tuo punto di riferimento per contenuti, aggiornamenti e passione. 
          Uno spazio dedicato a chi vive la moto ogni giorno, tra sicurezza, eventi e community.
        </p>
      </div>

      <!-- Griglia Categorie -->
      <div class="categories-grid">
        <div v-for="cat in categories" :key="cat.id" class="category-card">
          <div class="card-icon-box">{{ cat.icon }}</div>
          <div class="card-content">
            <h3>{{ cat.title }}</h3>
            <p>{{ cat.desc }}</p>
            <a :href="cat.link" target="_blank" class="card-link">
              {{ cat.label }}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Video Showcase Integrato -->
      <div class="video-showcase">
        <div class="video-info">
          <span class="video-tag">In Primo Piano</span>
          <h3>Passione in Movimento</h3>
          <p>Guarda i video più coinvolgenti dal mondo delle due ruote e resta ispirato per il tuo prossimo viaggio.</p>
          <div class="video-stats">
            <div class="stat"><span>🎬</span> Recensioni</div>
            <div class="stat"><span>📸</span> Eventi</div>
            <div class="stat"><span>🛠️</span> Tutorial</div>
          </div>
        </div>
        <div class="video-container">
          <!-- Placeholder per video incorporato (YouTube/Vimeo/Social) -->
          <div class="video-placeholder">
            <div class="play-btn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
            </div>
            <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Video Background" />
          </div>
        </div>
      </div>

      <!-- Social Band -->
      <div class="social-community-band">
        <div class="band-text">
          <h4>Entra nella nostra Community</h4>
          <p>Seguici sui social per non perdere nemmeno un aggiornamento dal mondo ROAD RUNNER.</p>
        </div>
        <div class="band-actions">
          <a href="https://facebook.com" target="_blank" class="social-btn fb">Facebook</a>
          <a href="https://instagram.com" target="_blank" class="social-btn ig">Instagram</a>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.biker-world-section {
  padding: 120px 0;
  background: #050505;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.biker-header {
  max-width: 800px;
  margin-bottom: 80px;
}

.section-kicker {
  color: var(--primary-2);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.section-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 950;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.section-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 100px;
}

.category-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 40px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(225, 29, 72, 0.3);
  transform: translateY(-10px);
}

.card-icon-box {
  font-size: 2.5rem;
  width: 64px;
  height: 64px;
  background: rgba(225, 29, 72, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.card-content h3 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.card-content p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin-bottom: 24px;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-2);
  text-decoration: none;
  font-weight: 800;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: gap 0.3s ease;
}

.card-link svg {
  width: 18px;
  height: 18px;
}

.card-link:hover {
  gap: 14px;
}

/* Video Showcase */
.video-showcase {
  background: var(--panel);
  border-radius: 40px;
  padding: 60px;
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 60px;
  align-items: center;
  margin-bottom: 80px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.video-tag {
  background: var(--primary);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 20px;
  display: inline-block;
}

.video-info h3 {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 20px;
}

.video-info p {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 32px;
}

.video-stats {
  display: flex;
  gap: 24px;
}

.stat {
  font-size: 0.9rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 8px;
}

.video-container {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
}

.video-placeholder {
  position: relative;
  aspect-ratio: 16/9;
  cursor: pointer;
}

.video-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
  transition: scale 0.5s ease;
}

.video-placeholder:hover img {
  scale: 1.05;
}

.play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 0 40px rgba(225, 29, 72, 0.5);
  transition: all 0.3s ease;
}

.play-btn svg {
  width: 32px;
  height: 32px;
  margin-left: 4px;
}

.video-placeholder:hover .play-btn {
  scale: 1.1;
  background: #fff;
  color: var(--primary);
}

/* Social Band */
.social-community-band {
  background: linear-gradient(90deg, var(--primary) 0%, #be123c 100%);
  border-radius: 24px;
  padding: 40px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 32px;
}

.band-text h4 {
  font-size: 1.75rem;
  font-weight: 900;
  margin-bottom: 8px;
}

.band-text p {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.band-actions {
  display: flex;
  gap: 16px;
}

.social-btn {
  padding: 14px 32px;
  border-radius: 100px;
  text-decoration: none;
  font-weight: 800;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.social-btn:hover {
  background: #fff;
  color: var(--primary);
  transform: translateY(-3px);
}

@media (max-width: 1100px) {
  .categories-grid { grid-template-columns: repeat(2, 1fr); }
  .video-showcase { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .categories-grid { grid-template-columns: 1fr; }
  .biker-header { margin-bottom: 60px; }
  .video-showcase { padding: 40px 24px; }
  .social-community-band { padding: 40px 24px; flex-direction: column; text-align: center; }
}
</style>
