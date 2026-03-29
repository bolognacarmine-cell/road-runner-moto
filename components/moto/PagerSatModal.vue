<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const closeOnEsc = (e) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', closeOnEsc)
})

onUnmounted(() => {
  window.removeEventListener('keydown', closeOnEsc)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
        <div class="modal-container" role="dialog" aria-modal="true">
          <!-- Header -->
          <header class="modal-header">
            <div class="header-title">
              <div class="icon-pulse">🛡️</div>
              <h3>Techno-alarm PagerSAT</h3>
            </div>
            <button class="close-btn" @click="emit('close')" aria-label="Chiudi">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </header>

          <!-- Content -->
          <div class="modal-body">
            <p class="intro-text">
              Il sistema <strong>Techno-alarm PagerSat</strong> per moto è un antifurto satellitare e localizzatore GPS/GSM avanzato, gestibile tramite SIM, che protegge il veicolo senza canoni abbonamento. Offre localizzazione in tempo reale via Google Maps, sensori di movimento, urto e sollevamento, blocco motore remoto via SMS e sirena, inviando avvisi immediati sul telefono.
            </p>

            <div class="features-list">
              <div class="feature-item">
                <div class="feature-icon">📍</div>
                <div class="feature-text">
                  <strong>Localizzazione Satellitare GPS/GSM:</strong>
                  <p>Permette di tracciare la posizione esatta della moto in tempo reale tramite smartphone, spesso visualizzando lo storico dei percorsi.</p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">🏗️</div>
                <div class="feature-text">
                  <strong>Protezione e Sensori:</strong>
                  <p>Il dispositivo include sensori sensibili a urti, sollevamento e movimento, ideali per prevenire furti di ruote o traino.</p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">📲</div>
                <div class="feature-text">
                  <strong>Gestione in Remoto e Blocco Motore:</strong>
                  <p>Attraverso una SIM dedicata, l'utente può ricevere avvisi di allarme e inviare comandi via SMS per bloccare istantaneamente il motore della moto.</p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">📢</div>
                <div class="feature-text">
                  <strong>Allarme Sonoro:</strong>
                  <p>Include una sirena autoalimentata per scoraggiare i tentativi di furto.</p>
                </div>
              </div>

              <div class="feature-item">
                <div class="feature-icon">🏷️</div>
                <div class="feature-text">
                  <strong>Nessun Canone Abbonamento:</strong>
                  <p>A differenza di altri sistemi, spesso si tratta di soluzioni autogestite che non richiedono abbonamenti mensili a centrali operative.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <footer class="modal-footer">
            <div class="footer-info">
              <p>Vuoi proteggere la tua moto?</p>
              <span>Contattaci per info e installazione</span>
            </div>
            <div class="footer-actions">
              <a href="https://wa.me/393391581997" target="_blank" class="btn-pagersat-wa">
                Contatta su WhatsApp
              </a>
            </div>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: #ffffff;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.5);
  color: #1a1a1a;
}

.modal-header {
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-pulse {
  font-size: 1.5rem;
  background: #e0f2fe;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
}

.header-title h3 {
  font-size: 1.5rem;
  font-weight: 900;
  color: #0f172a;
  margin: 0;
}

.close-btn {
  background: #f1f5f9;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
  transform: rotate(90deg);
}

.modal-body {
  padding: 32px;
  overflow-y: auto;
}

.intro-text {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 32px;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feature-item {
  display: flex;
  gap: 20px;
}

.feature-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
  padding-top: 2px;
}

.feature-text strong {
  display: block;
  font-size: 1.1rem;
  color: #0f172a;
  margin-bottom: 4px;
  font-weight: 800;
}

.feature-text p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

.modal-footer {
  padding: 32px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.footer-info p {
  margin: 0;
  font-weight: 800;
  color: #0f172a;
}

.footer-info span {
  font-size: 0.85rem;
  color: #64748b;
}

.btn-pagersat-wa {
  background: #25d366;
  color: #fff;
  padding: 14px 24px;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 800;
  font-size: 0.95rem;
  transition: all 0.3s;
  box-shadow: 0 10px 20px rgba(37, 211, 102, 0.2);
  white-space: nowrap;
}

.btn-pagersat-wa:hover {
  background: #128c7e;
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(37, 211, 102, 0.3);
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container {
  animation: modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-in {
  from { transform: scale(0.9) translateY(20px); }
  to { transform: scale(1) translateY(0); }
}

@media (max-width: 640px) {
  .modal-container {
    max-height: 95vh;
    border-radius: 24px;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 24px;
  }
  
  .modal-footer {
    flex-direction: column;
    text-align: center;
  }
  
  .btn-pagersat-wa {
    width: 100%;
  }
  
  .header-title h3 {
    font-size: 1.25rem;
  }
}
</style>
