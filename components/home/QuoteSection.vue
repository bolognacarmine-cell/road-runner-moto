<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import { useRoute } from 'vue-router'

const props = defineProps({
  vehicles: { type: Array, default: () => [] }
})

const route = useRoute()
const step = ref(1)
const totalSteps = 4
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const showForm = ref(false)

const form = ref({
  // Sezione Cliente
  nome: '',
  email: '',
  telefono: '',
  citta: '',
  // Sezione Moto
  vehicleId: '',
  marca: '',
  modello: '',
  anno: '',
  tipo: '',
  nuovaUsata: 'nuova',
  // Sezione Preventivo
  metodoAcquisto: 'contanti',
  valutazionePermuta: 'no',
  permutaMarca: '',
  permutaModello: '',
  permutaAnno: '',
  budget: '',
  // Messaggio e Consensi
  messaggio: '',
  privacy: false,
  offerte: false
})

const progress = computed(() => (step.value / totalSteps) * 100)

onMounted(() => {
  // Assicura uno stato pulito al caricamento della pagina
  isSubmitted.value = false
  showForm.value = false
  step.value = 1

  // Controlla se c'è una moto pre-selezionata via URL o se si atterra sull'ancora
  const preSelectedId = route.query.moto
  const hash = route.hash
  
  if (preSelectedId) {
    // Se c'è un ID moto, aspetta che i veicoli siano caricati
    if (props.vehicles.length) {
      checkPreSelection(preSelectedId)
    }
  } else if (hash === '#preventivo') {
    startQuote()
  }
})

// Osserva quando i veicoli vengono caricati per gestire la pre-selezione iniziale
watch(() => props.vehicles, (newVehicles) => {
  const preSelectedId = route.query.moto
  if (preSelectedId && newVehicles.length && !showForm.value) {
    checkPreSelection(preSelectedId)
  }
}, { immediate: true })

// Osserva cambiamenti nel query param moto (per click sulla stessa pagina)
watch(() => route.query.moto, (newId) => {
  if (newId && props.vehicles.length) {
    checkPreSelection(newId)
  }
}, { deep: true })

// Osserva cambiamenti nell'hash per aprire il form via ancora
watch(() => route.hash, (newHash) => {
  if (newHash === '#preventivo' && !showForm.value) {
    startQuote()
  }
})

const checkPreSelection = (id) => {
  const vehicle = props.vehicles.find(v => v._id === id || v.slug === id)
  if (vehicle) {
    showForm.value = true
    step.value = 1 // Inizia sempre dallo Step 1 (Dati Personali)
    form.value.vehicleId = vehicle._id
    onVehicleSelect() // Pre-compila i dati della moto in background
    
    // Smooth scroll alla sezione preventivo
    nextTick(() => {
      const el = document.getElementById('preventivo')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    })
  }
}

const startQuote = () => {
  showForm.value = true
  step.value = 1
  // Animazione ingresso form
  nextTick(() => {
    const formEl = document.querySelector('.quote-form')
    gsap.fromTo(formEl, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'all' })
  })
}

const nextStep = () => {
  if (step.value < totalSteps) {
    const currentStepEl = document.querySelector('.form-step')
    gsap.to(currentStepEl, { opacity: 0, x: -20, duration: 0.3, onComplete: () => {
      step.value++
      nextTick(() => {
        const nextStepEl = document.querySelector('.form-step')
        gsap.fromTo(nextStepEl, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3, clearProps: 'all' })
      })
    }})
  }
}

const prevStep = () => {
  if (step.value > 1) {
    const currentStepEl = document.querySelector('.form-step')
    gsap.to(currentStepEl, { opacity: 0, x: 20, duration: 0.3, onComplete: () => {
      step.value--
      nextTick(() => {
        const prevStepEl = document.querySelector('.form-step')
        gsap.fromTo(prevStepEl, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, clearProps: 'all' })
      })
    }})
  }
}

const handleSubmit = async () => {
  if (!form.value.privacy) return alert('Devi accettare la privacy policy.')
  
  isSubmitting.value = true
  try {
    await $fetch('/api/leads', {
      method: 'POST',
      body: form.value
    })
    isSubmitted.value = true
    gsap.fromTo('.success-content', 
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out' }
    )
  } catch (err) {
    alert('Errore durante l\'invio. Riprova più tardi.')
  } finally {
    isSubmitting.value = false
  }
}

const onVehicleSelect = () => {
  const vehicle = props.vehicles.find(v => v._id === form.value.vehicleId)
  if (vehicle) {
    form.value.marca = vehicle.marca
    form.value.modello = vehicle.modello
    form.value.anno = vehicle.annoImmatricolazione || ''
    form.value.tipo = vehicle.tipo
    form.value.nuovaUsata = vehicle.nuovaUsata || 'usata'
  }
}

const marche = ['Honda', 'Piaggio', 'Kymco', 'Suzuki', 'Yamaha', 'Moto Guzzi', 'Altro']
const tipi = ['Sportiva', 'Naked', 'Touring', 'Scooter', 'Enduro', 'Custom', 'Hypermotard', 'Motard', 'Crossover']
</script>

<template>
  <section id="preventivo" class="quote-section">
    <div class="container">
      <div class="quote-card" :class="{ 'is-submitted': isSubmitted }" :key="isSubmitted ? 'success' : (showForm ? 'form' : 'initial')">
        
        <!-- 1. Feedback Successo (Priorità massima) -->
        <div v-if="isSubmitted" class="success-content">
          <div class="success-icon">✓</div>
          <h3>Richiesta inviata!</h3>
          <p>Grazie per averci scelto. Un nostro consulente ti contatterà entro 24 ore per fornirti il miglior preventivo possibile.</p>
          <button @click="isSubmitted = false; showForm = false; step = 1" class="btn-secondary-custom">Invia un'altra richiesta</button>
        </div>

        <!-- 2. Form Multi-step (Se non inviato e se showForm è true) -->
        <form v-else-if="showForm" @submit.prevent="handleSubmit" class="quote-form">
          
          <!-- Progress Bar -->
          <div class="progress-container">
            <div class="progress-bar-bg">
              <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="steps-info">Step {{ step }} di {{ totalSteps }}</div>
          </div>
          
          <!-- STEP 1: Dati Personali -->
          <div v-if="step === 1" class="form-step">
            <div class="step-title">
              <span class="step-num">01</span>
              <h3>Parlaci di te</h3>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label>Nome e Cognome *</label>
                <input v-model="form.nome" type="text" placeholder="Mario Rossi" required />
              </div>
              <div class="form-group">
                <label>Email *</label>
                <input v-model="form.email" type="email" placeholder="mario.rossi@esempio.it" required />
              </div>
              <div class="form-group">
                <label>Telefono *</label>
                <input v-model="form.telefono" type="tel" placeholder="333 1234567" required />
              </div>
              <div class="form-group">
                <label>Città</label>
                <input v-model="form.citta" type="text" placeholder="Caserta" />
              </div>
            </div>
          </div>

          <!-- STEP 2: La Moto -->
          <div v-if="step === 2" class="form-step">
            <div class="step-title">
              <span class="step-num">02</span>
              <h3>La moto dei tuoi sogni</h3>
            </div>
            <div class="form-grid">
              <!-- Selettore Veicolo Dinamico -->
              <div class="form-group full-width" v-if="props.vehicles.length">
                <label>Seleziona un veicolo dal catalogo (Opzionale)</label>
                <select v-model="form.vehicleId" @change="onVehicleSelect">
                  <option value="">-- Seleziona --</option>
                  <option v-for="v in props.vehicles" :key="v._id" :value="v._id">
                    {{ v.marca }} {{ v.modello }} ({{ v.annoImmatricolazione || 'N/D' }})
                  </option>
                </select>
                <p class="help-text">Oppure inserisci i dettagli manualmente sotto.</p>
              </div>

              <div class="form-group">
                <label>Marca</label>
                <select v-model="form.marca">
                  <option value="">Seleziona marca</option>
                  <option v-for="m in marche" :key="m" :value="m">{{ m }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Modello</label>
                <input v-model="form.modello" type="text" placeholder="Es: Hornet 750" />
              </div>
              <div class="form-group">
                <label>Tipo di moto</label>
                <select v-model="form.tipo">
                  <option value="">Seleziona tipo</option>
                  <option v-for="t in tipi" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <div class="form-group radio-group">
                <label>Stato veicolo</label>
                <div class="radio-options">
                  <label class="radio-label"><input type="radio" v-model="form.nuovaUsata" value="nuova" /> Nuova</label>
                  <label class="radio-label"><input type="radio" v-model="form.nuovaUsata" value="usata" /> Usata</label>
                </div>
              </div>
            </div>
          </div>

          <!-- STEP 3: Dettagli Acquisto -->
          <div v-if="step === 3" class="form-step">
            <div class="step-title">
              <span class="step-num">03</span>
              <h3>Metodo di acquisto</h3>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label>Come preferisci pagare?</label>
                <select v-model="form.metodoAcquisto">
                  <option value="contanti">Contanti / Bonifico</option>
                  <option value="finanziamento">Finanziamento</option>
                  <option value="leasing">Leasing</option>
                </select>
              </div>
              <div class="form-group radio-group">
                <label>Hai una permuta?</label>
                <div class="radio-options">
                  <label class="radio-label"><input type="radio" v-model="form.valutazionePermuta" value="si" /> Sì</label>
                  <label class="radio-label"><input type="radio" v-model="form.valutazionePermuta" value="no" /> No</label>
                </div>
              </div>
              <template v-if="form.valutazionePermuta === 'si'">
                <div class="form-group">
                  <label>Tua moto (Marca e Modello)</label>
                  <input v-model="form.permutaModello" type="text" placeholder="Es: Yamaha MT-07" />
                </div>
                <div class="form-group">
                  <label>Anno</label>
                  <input v-model="form.permutaAnno" type="number" placeholder="2020" />
                </div>
              </template>
            </div>
          </div>

          <!-- STEP 4: Messaggio e Invio -->
          <div v-if="step === 4" class="form-step">
            <div class="step-title">
              <span class="step-num">04</span>
              <h3>Ultimi dettagli</h3>
            </div>
            <div class="form-group">
              <label>Il tuo messaggio (opzionale)</label>
              <textarea v-model="form.messaggio" placeholder="Scrivi qui eventuali richieste extra..."></textarea>
            </div>
            <div class="consensi">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.privacy" required />
                <span>Accetto la Privacy Policy (GDPR) *</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.offerte" />
                <span>Voglio ricevere promozioni e offerte speciali</span>
              </label>
            </div>
          </div>

          <!-- Navigazione Form -->
          <div class="form-nav">
            <button v-if="step > 1" type="button" @click="prevStep" class="btn-secondary-custom">Indietro</button>
            <button v-if="step < totalSteps" type="button" @click="nextStep" class="btn-primary-custom ml-auto">Avanti</button>
            <button v-if="step === totalSteps" type="submit" class="btn-primary-custom ml-auto" :disabled="isSubmitting">
              {{ isSubmitting ? 'Invio in corso...' : 'Invia Richiesta' }}
            </button>
          </div>
        </form>

        <!-- 3. Header Iniziale (Default) -->
        <div v-else class="quote-header text-center">
          <div class="header-content">
            <span class="badge">Richiedi Preventivo</span>
            <h2>Personalizza la tua offerta</h2>
            <p>Compila il form e ricevi una proposta su misura entro 24 ore.</p>
            <button @click="startQuote" class="btn-primary-custom mt-12">Richiedi Preventivo</button>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.mt-12 {
  margin-top: 3rem;
}
.quote-section {
  padding: 120px 0;
  background: #050505;
  position: relative;
  z-index: 10; /* Aumentato per evitare sovrapposizioni */
}

.quote-card {
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  padding: 60px;
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8);
  transition: all 0.5s ease;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  overflow: visible;
  z-index: 11;
}

@media (max-width: 768px) {
  .quote-card {
    padding: 40px 24px;
    border-radius: 32px;
  }
}

.quote-header {
  text-align: center;
  margin-bottom: 60px;
  opacity: 1 !important;
  visibility: visible !important;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(225, 29, 72, 0.1);
  color: var(--primary-2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.quote-header h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 24px;
}

.quote-header p {
  color: var(--muted);
  font-size: 1.125rem;
  margin-bottom: 8px;
}

.progress-container {
  margin-top: 40px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.progress-bar-bg {
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar {
  height: 100%;
  background: var(--primary);
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.steps-info {
  font-size: 0.875rem;
  color: var(--muted);
  font-weight: 600;
}

.quote-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-bottom: 20px; /* Spazio extra in fondo */
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.step-title {
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.step-num {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary);
  opacity: 0.5;
}

.step-title h3 {
  font-size: 1.5rem;
  font-weight: 800;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
}

.help-text {
  font-size: 0.75rem;
  color: var(--muted);
  margin-top: 4px;
}

.radio-options {
  display: flex;
  gap: 24px;
  margin-top: 8px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: white; /* Cambiato da var(--muted) a white per visibilità */
  transition: all 0.3s ease;
  font-weight: 600;
}

.radio-label:hover {
  color: var(--primary-2);
}

.radio-label input {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
}

.form-group input,
.form-group select,
.form-group textarea {
  background: rgba(255, 255, 255, 0.05); /* Leggermente più chiaro per contrasto */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  color: white !important; /* Forza il colore bianco */
  font-size: 1rem;
  transition: all 0.3s ease;
}

/* Colore delle opzioni dei select per vari browser */
.form-group select option {
  background-color: #111111;
  color: white;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.06);
}

.form-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.15); /* Più visibile */
  position: relative;
  z-index: 20;
}

.btn-primary-custom, .btn-secondary-custom {
  position: relative;
  z-index: 30;
  opacity: 1 !important;
  visibility: visible !important;
}

.ml-auto {
  margin-left: auto;
}

.success-content {
  text-align: center;
  padding: 40px 0;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 24px;
}

.success-content h2 {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.success-content p {
  color: var(--muted);
  font-size: 1.125rem;
  margin-bottom: 32px;
}
</style>
