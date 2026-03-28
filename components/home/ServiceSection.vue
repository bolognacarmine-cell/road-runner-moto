
<script setup>
import { onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

const services = [
  {
    title: 'Vendita Veicoli',
    desc: 'Ampia scelta di moto e scooter nuovi e usati dei migliori brand, garantiti e certificati.',
    icon: '🏍️',
    type: 'sales',
    link: '/#contatti',
    linkText: 'Richiedi Info'
  },
  {
    title: 'Finanziamenti Compass',
    desc: 'Scegli la semplicità di un pagamento a rate. Grazie alla partnership con Compass, puoi dilazionare l’acquisto della tua moto o degli accessori in comode rate mensili personalizzabili, rendendo la spesa più leggera.',
    icon: '💳',
    type: 'finance',
    link: '/finanziamenti',
    linkText: 'Scopri i finanziamenti',
    benefits: [
      'Acquisti subito, paghi a rate leggere.',
      'Procedura semplice e veloce direttamente in concessionaria.',
      'Piano di rimborso personalizzato in base alle tue esigenze.'
    ]
  },
  {
    title: 'Officina Specializzata',
    desc: 'Affida la tua moto a mani esperte: eseguiamo tagliandi, riparazioni, controlli completi e diagnosi professionali. Un servizio preciso e trasparente per mantenere il tuo veicolo sempre efficiente.',
    icon: '🔧',
    type: 'service',
    link: '/#contatti',
    linkText: 'Richiedi Info'
  }
]

let ctx
onMounted(async () => {
  await nextTick()
  ctx = gsap.context(() => {
    gsap.fromTo('.service-card', 
      { opacity: 0, y: 40 },
      {
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 80%',
        },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        clearProps: 'all'
      }
    )

    gsap.fromTo('.support-cta-box',
      { opacity: 0, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: '.support-cta-box',
          start: 'top 85%',
        },
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'expo.out',
        clearProps: 'all'
      }
    )
  })
})
</script>

<template>
  <section id="assistenza" class="combined-services-section">
    <div class="container">
      <div class="services-header">
        <p class="section-kicker">Service & Support</p>
        <h2 class="section-title">Soluzioni complete per ogni motociclista</h2>
        <p class="section-subtitle">
          Dall'acquisto alla manutenzione, ti accompagniamo in ogni chilometro del tuo viaggio.
        </p>
      </div>

      <div class="services-grid">
        <div v-for="s in services" :key="s.title" class="service-card">
          <div class="card-top">
            <div class="service-icon-box">{{ s.icon }}</div>
            <div class="service-tag">{{ s.type.toUpperCase() }}</div>
          </div>
          <div class="card-body">
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
            
            <ul v-if="s.benefits" class="service-benefits">
              <li v-for="benefit in s.benefits" :key="benefit">
                <span class="check">✓</span> {{ benefit }}
              </li>
            </ul>
          </div>
          <div class="card-footer">
            <NuxtLink v-if="s.link.startsWith('/')" :to="s.link" class="service-link" :target="s.link.endsWith('.jpg') ? '_blank' : undefined">
              {{ s.linkText }} →
            </NuxtLink>
            <a v-else :href="s.link" class="service-link" target="_blank">
              {{ s.linkText }} →
            </a>
          </div>
        </div>
      </div>

      <!-- CTA Unificato -->
      <div class="support-cta-box">
        <div class="cta-content">
          <div class="cta-text">
            <h3>Hai bisogno di assistenza o finanziamenti?</h3>
            <p>Il nostro team è a tua disposizione per preventivi su misura e consulenze veloci.</p>
          </div>
          <div class="cta-actions">
            <a href="tel:0823516087" class="btn-primary-custom">Chiama Officina</a>
            <a href="https://wa.me/393391581997" target="_blank" class="btn-whatsapp">WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.combined-services-section {
  padding: 60px 0;
  background: #050505;
  position: relative;
}

.services-header {
  max-width: 700px;
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
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 950;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 80px;
}

.service-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  padding: 40px;
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(225, 29, 72, 0.3);
  transform: translateY(-10px);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.service-icon-box {
  font-size: 2.5rem;
  width: 64px;
  height: 64px;
  background: rgba(225, 29, 72, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.service-tag {
  font-size: 0.7rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.1em;
}

.card-body h3 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 16px;
}

.card-body p {
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  font-size: 1rem;
}

.service-benefits {
  list-style: none;
  padding: 0;
  margin: 24px 0 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-benefits li {
  display: flex;
  gap: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.4;
}

.service-benefits .check {
  color: var(--primary-2);
  font-weight: bold;
}

.card-footer {
  margin-top: 32px;
}

.service-link {
  color: var(--primary-2);
  text-decoration: none;
  font-weight: 800;
  font-size: 0.9rem;
}

/* CTA Box */
.support-cta-box {
  background: var(--panel);
  border-radius: 40px;
  padding: 60px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.cta-content {
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
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
}

.cta-actions {
  display: flex;
  gap: 16px;
}

.btn-whatsapp {
  padding: 14px 32px;
  border-radius: 100px;
  background: linear-gradient(135deg, #25D366, #128C7E);
  color: #fff;
  text-decoration: none;
  font-weight: 800;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-whatsapp::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.btn-whatsapp:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 15px 30px rgba(37, 211, 102, 0.4);
  filter: brightness(1.1);
}

.btn-whatsapp:hover::after {
  left: 100%;
}

.btn-primary-custom {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;
}

.btn-primary-custom:hover {
  transform: translateY(-5px) scale(1.03);
}

@media (max-width: 1100px) {
  .services-grid { grid-template-columns: repeat(2, 1fr); }
  .cta-content { flex-direction: column; text-align: center; }
}

@media (max-width: 768px) {
  .services-grid { grid-template-columns: 1fr; }
  .service-card { padding: 30px; }
}
</style>
