<script setup>
</script>

<template>
<section class="cta-band">
  <div class="container">
    <div 
      class="cta-band-shell" 
      :style="{ backgroundImage: `linear-gradient(135deg, rgba(5, 5, 5, 0.8), rgba(5, 5, 5, 0.4)), url('/cta-bg.jpg')` }"
    >
      <div class="cta-content">
        <p class="section-kicker">Road Runner Moto</p>
        <h2>Competenze e passione <br class="desktop-only" /> al tuo servizio</h2>
        <p class="cta-desc">Vieni in concessionaria per scoprire moto, scooter e accessori originali. Il nostro team è pronto a guidarti nella scelta migliore.</p>
      </div>
      
      <div class="cta-actions">
        <NuxtLink to="/#preventivo" class="btn-primary-custom">
          Richiedi Preventivo
        </NuxtLink>
        <div class="secondary-actions">
          <a href="tel:0823516087" class="btn-secondary-custom">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            0823 516087
          </a>
          <a href="https://wa.me/393391581997" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-custom">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3.5Z"></path></svg>
            WhatsApp
          </a>
        </div>
        <NuxtLink to="/blog" class="btn-blog-custom">
          Esplora il Blog
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon-right"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</section>
</template>

<style scoped>
.cta-band {
  padding: 30px 0 60px;
  background: #030303;
}

.cta-band-shell {
  position: relative;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 48px;
  align-items: center;
  padding: 64px;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background-color: #0a0a0a;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.cta-content {
  position: relative;
  z-index: 1;
}

.section-kicker {
  display: inline-block;
  color: var(--primary-2);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.875rem;
  margin-bottom: 20px;
  background: rgba(225, 29, 72, 0.1);
  padding: 6px 16px;
  border-radius: 100px;
  border: 1px solid rgba(225, 29, 72, 0.2);
}

.cta-band-shell h2 {
  margin: 0 0 24px;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 950;
  line-height: 1;
  letter-spacing: -0.03em;
  color: white;
}

.cta-desc {
  color: #94a3b8;
  margin: 0;
  font-size: 1.125rem;
  max-width: 540px;
  line-height: 1.6;
}

.cta-actions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.secondary-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.btn-primary-custom,
.btn-secondary-custom,
.btn-whatsapp-custom,
.btn-blog-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  padding: 16px 32px;
  border-radius: 16px;
  font-weight: 800;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  gap: 12px;
  position: relative;
  overflow: hidden;
}

/* Shine effect base */
.btn-primary-custom::after,
.btn-whatsapp-custom::after,
.btn-blog-custom::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

.btn-primary-custom:hover::after,
.btn-whatsapp-custom:hover::after,
.btn-blog-custom:hover::after {
  left: 100%;
}

.btn-primary-custom {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 10px 20px -10px rgba(225, 29, 72, 0.5);
}

.btn-primary-custom:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 20px 40px -15px rgba(225, 29, 72, 0.6);
  filter: brightness(1.1);
}

.btn-whatsapp-custom {
  color: #fff;
  background: linear-gradient(135deg, #25D366, #128C7E);
  box-shadow: 0 10px 30px -10px rgba(37, 211, 102, 0.3);
}

.btn-whatsapp-custom:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 20px 40px -15px rgba(37, 211, 102, 0.4);
  filter: brightness(1.1);
}

.btn-secondary-custom {
  color: #fff;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.btn-secondary-custom:hover {
  transform: translateY(-5px) scale(1.03);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.5);
}

.btn-blog-custom {
  border: 1px solid var(--primary);
  color: var(--primary-2);
  background: transparent;
}

.btn-blog-custom:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 20px 40px -15px rgba(225, 29, 72, 0.4);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn-secondary-custom:hover .btn-icon,
.btn-whatsapp-custom:hover .btn-icon {
  transform: rotate(-10deg) scale(1.1);
}

.btn-icon-right {
  transition: transform 0.3s ease;
}

.btn-blog-custom:hover .btn-icon-right {
  transform: translateX(6px);
}

.desktop-only {
  display: none;
}

@media (min-width: 1024px) {
  .desktop-only {
    display: block;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .cta-band-shell {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 60px 32px;
    gap: 40px;
  }
  
  .cta-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .cta-desc {
    margin: 0 auto;
  }
  
  .cta-actions {
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .cta-band-shell {
    padding: 48px 20px;
    border-radius: 32px;
  }
  
  .cta-band-shell h2 {
    font-size: 2.25rem;
  }
  
  .btn-primary-custom,
  .btn-secondary-custom,
  .btn-whatsapp-custom,
  .btn-blog-custom {
    padding: 16px 24px;
    font-size: 0.9375rem;
  }
}
</style>