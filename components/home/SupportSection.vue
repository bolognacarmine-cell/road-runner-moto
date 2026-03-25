<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

onMounted(() => {
  const ctx = gsap.context(() => {
    const cards = document.querySelectorAll('.support-card')
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 50 },
        {
          scrollTrigger: {
            trigger: '.support-grid',
            start: 'top 80%',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out'
        }
      )
    }
  })
})

const services = [
  {
    title: 'Officina Specializzata',
    desc: 'Meccanici esperti per tagliandi, riparazioni e diagnosi computerizzata su ogni tipo di moto.',
    icon: '🔧'
  },
  {
    title: 'Finanziamenti',
    desc: 'Piani di pagamento personalizzati e flessibili per l\'acquisto della tua nuova moto.',
    icon: '💳'
  }
]
</script>

<template>
  <section id="assistenza" class="support-section">
    <div class="container">
      <div class="section-heading text-center">
        <p class="section-kicker">Service</p>
        <h2>Assistenza Post-Vendita</h2>
        <p class="section-desc">Ci prendiamo cura della tua moto con passione e professionalità anche dopo l'acquisto.</p>
      </div>

      <div class="support-grid">
        <div v-for="s in services" :key="s.title" class="support-card">
          <div class="support-icon-box">{{ s.icon }}</div>
          <h3>{{ s.title }}</h3>
          <p>{{ s.desc }}</p>
        </div>
      </div>

      <div class="support-cta">
        <div class="cta-inner">
          <div class="cta-text">
            <h3>Hai bisogno di assistenza immediata?</h3>
            <p>Prenota un appuntamento in officina o richiedi un preventivo per la manutenzione.</p>
          </div>
          <div class="cta-btns">
            <a href="tel:0823516087" class="btn-primary-custom">Chiama Ora</a>
            <a href="https://wa.me/393391581997" target="_blank" class="btn-secondary-custom">WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.support-section {
  padding: 120px 0;
  background: #080808;
  position: relative;
  overflow: hidden;
}

.support-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--line), transparent);
}

.section-heading {
  margin-bottom: 80px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.text-center { text-align: center; }

.section-kicker {
  color: var(--primary-2);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.section-heading h2 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 950;
  margin-bottom: 24px;
  line-height: 1.1;
}

.section-desc {
  color: var(--muted);
  font-size: 1.125rem;
}

.support-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-bottom: 80px;
}

.support-card {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 48px 40px;
  border-radius: 32px;
  transition: all 0.4s ease;
}

.support-card:hover {
  transform: translateY(-10px);
  border-color: var(--primary);
  background: #151515;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.5);
}

.support-icon-box {
  font-size: 2.5rem;
  margin-bottom: 24px;
  width: 70px;
  height: 70px;
  background: rgba(225, 29, 72, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}

.support-card h3 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  color: white;
}

.support-card p {
  color: #94a3b8;
  line-height: 1.6;
}

.support-cta {
  margin-top: 40px;
}

.cta-inner {
  background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 60px;
  border-radius: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.cta-text h3 {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 12px;
}

.cta-text p {
  color: var(--muted);
  font-size: 1.1rem;
}

.cta-btns {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .cta-inner {
    flex-direction: column;
    text-align: center;
    padding: 48px 32px;
  }
  .cta-btns {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .cta-btns {
    flex-direction: column;
  }
  .support-card {
    padding: 32px;
  }
}
</style>
