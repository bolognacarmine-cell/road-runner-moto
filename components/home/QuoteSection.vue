<script setup>
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

const step = ref(1)
const totalSteps = 4
const isSubmitting = ref(false)
const isSubmitted = ref(false)

const form = ref({
  // Sezione Cliente
  nome: '',
  email: '',
  telefono: '',
  citta: '',
  // Sezione Moto
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

const nextStep = () => {
  if (step.value < totalSteps) {
    gsap.to('.form-step', { opacity: 0, x: -20, duration: 0.3, onComplete: () => {
      step.value++
      gsap.fromTo('.form-step', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3 })
    }})
  }
}

const prevStep = () => {
  if (step.value > 1) {
    gsap.to('.form-step', { opacity: 0, x: 20, duration: 0.3, onComplete: () => {
      step.value--
      gsap.fromTo('.form-step', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3 })
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
    gsap.from('.success-content', { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out' })
  } catch (err) {
    alert('Errore durante l\'invio. Riprova più tardi.')
  } finally {
    isSubmitting.value = false
  }
}

const marche = ['Honda', 'Piaggio', 'Kymco', 'Suzuki', 'Yamaha', 'Moto Guzzi', 'Altro']
const tipi = ['Sportiva', 'Naked', 'Touring', 'Scooter', 'Enduro', 'Custom']
</script>

<template>
  <section id="preventivo" class="quote-section">
    <div class="container">
      <div class="quote-card" :class="{ 'is-submitted': isSubmitted }">
        
        <!-- Header del Form -->
        <div v-if="!isSubmitted" class="quote-header">
          <div class="header-content">
            <span class="badge">Richiedi Preventivo</span>
            <h2>Personalizza la tua offerta</h2>
            <p>Compila il form e ricevi una proposta su misura entro 24 ore.</p>
          </div>
          
          <!-- Progress Bar -->
          <div class="progress-container">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            <div class="steps-info">Step {{ step }} di {{ totalSteps }}</div>
          </div>
        </div>

        <!-- Form Multi-step -->
        <form v-if="!isSubmitted" @submit.prevent="handleSubmit" class="quote-form">
          
          <!-- STEP 1: Dati Personali -->
          <div v-if="step === 1" class="form-step">
            <div class="step-title">
              <span class="step-num">01</span>
              <h3>Parlaci di te</h3>
            </div>
            <div class="input-grid">
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
            <div class="input-grid">
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
                  <label><input type="radio" v-model="form.nuovaUsata" value="nuova" /> Nuova</label>
                  <label><input type="radio" v-model="form.nuovaUsata" value="usata" /> Usata</label>
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
            <div class="input-grid">
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
                  <label><input type="radio" v-model="form.valutazionePermuta" value="si" /> Sì</label>
                  <label><input type="radio" v-model="form.valutazionePermuta" value="no" /> No</label>
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

        <!-- Feedback Successo -->
        <div v-else class="success-content">
          <div class="success-icon">✓</div>
          <h3>Richiesta inviata!</h3>
          <p>Grazie per averci scelto. Un nostro consulente ti contatterà entro 24 ore per fornirti il miglior preventivo possibile.</p>
          <button @click="isSubmitted = false; step = 1" class="btn-secondary-custom">Invia un'altra richiesta</button>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.quote-section {
  padding: 100px 0;
  background: var(--bg);
}

.quote-card {
  background: var(--panel);
  border-radius: 24px;
  border: 1px solid var(--line);
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: var(--shadow);
  transition: all 0.5s ease;
}

.quote-card.is-submitted {
  text-align: center;
  max-width: 600px;
}

.quote-header {
  margin-bottom: 40px;
}

.header-content h2 {
  font-size: 2.5rem;
  font-weight: 900;
  margin: 10px 0;
}

.badge {
  color: var(--primary-2);
  text-transform: uppercase;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
}

.progress-container {
  margin-top: 30px;
  height: 6px;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--primary-2));
  border-radius: 10px;
  transition: width 0.4s ease;
}

.steps-info {
  position: absolute;
  right: 0;
  top: -25px;
  font-size: 0.75rem;
  color: var(--muted);
  font-weight: 600;
}

.step-title {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.step-num {
  font-size: 2rem;
  font-weight: 900;
  color: var(--line);
  line-height: 1;
}

.step-title h3 {
  font-size: 1.5rem;
  font-weight: 800;
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 640px) {
  .input-grid {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--muted);
}

input, select, textarea {
  background: var(--panel-2);
  border: 1px solid var(--line);
  padding: 12px 16px;
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

input:focus, select:focus, textarea:focus {
  border-color: var(--primary-2);
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.radio-group .radio-options {
  display: flex;
  gap: 20px;
  margin-top: 5px;
}

.radio-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #fff;
}

.consensi {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--muted);
}

.checkbox-label input {
  margin-top: 4px;
}

.form-nav {
  margin-top: 40px;
  display: flex;
  gap: 20px;
}

.ml-auto { margin-left: auto; }

/* Success State */
.success-icon {
  width: 80px;
  height: 80px;
  background: var(--primary);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 30px;
}

.success-content h3 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.success-content p {
  color: var(--muted);
  margin-bottom: 30px;
  line-height: 1.7;
}
</style>
