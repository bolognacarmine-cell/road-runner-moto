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
    desc: 'Affida la tua moto a mani esperte: eseguiamo tagliandi, riparazioni, controlli completi e diagnosi professionali su moto e scooter. Un servizio preciso e trasparente, pensato per mantenere il tuo veicolo sempre efficiente e pronto a partire.',
    icon: '🔧'
  },
  {
    title: 'Finanziamenti',
    desc: 'Piani di pagamento personalizzati e flessibili per l\'acquisto della tua moto, nuova o usata.',
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
            <a href="https://wa.me/393391581997" target="_blank" class="btn-whatsapp-support">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.31 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.41 1.26 4.85l-1.33 4.86 4.98-1.31c1.4.74 2.99 1.17 4.67 1.17 5.52 0 10-4.48 10-10s-4.48-10-10-10zm5.79 14.16c-.25.7-1.46 1.34-2.01 1.43-.5.08-1.15.15-3.32-.74-2.78-1.14-4.57-3.97-4.71-4.16-.14-.19-1.13-1.5-1.13-2.86s.71-2.03.96-2.3c.25-.27.54-.34.72-.34.18 0 .36.01.52.02.17.01.4.04.62.55.23.54.79 1.93.86 2.07.07.14.12.3.02.49-.1.19-.15.3-.3.47-.15.17-.31.38-.44.51-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11.7.63 1.29.83 1.6.96.31.13.49.11.67-.1.18-.21.79-.91.99-1.22.21-.31.42-.26.71-.15.29.11 1.83.86 2.15 1.02.32.16.53.24.6.38.08.13.08.77-.17 1.47z"/></svg>
              <span>WhatsApp</span>
            </a>
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

.btn-primary-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0 32px;
  border-radius: var(--radius);
  font-weight: 700;
  font-size: 1rem;
}

.btn-whatsapp-support {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 52px;
  padding: 0 32px;
  border-radius: var(--radius);
  font-weight: 700;
  font-size: 1rem;
  background: #25D366;
  color: white;
  transition: all var(--transition);
  box-shadow: 0 10px 20px -5px rgba(37, 211, 102, 0.4);
  text-align: center;
}

.btn-whatsapp-support span {
  display: inline-block;
  line-height: 1;
}

.btn-whatsapp-support svg {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

@media (hover: hover) {
  .btn-whatsapp-support:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px -5px rgba(37, 211, 102, 0.5);
    filter: brightness(1.1);
  }
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
  .support-card {
    text-align: center;
    padding: 32px;
  }
  .support-icon-box {
    margin-left: auto;
    margin-right: auto;
  }
  .cta-btns {
    flex-direction: column;
    width: 100%;
  }
  .btn-primary-custom, .btn-whatsapp-support {
    width: 100%;
    justify-content: center;
  }
  .support-card {
    padding: 32px;
  }
}
</style>
