
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (process.client) {
  gsap.registerPlugin(ScrollTrigger)
}

const form = ref({
  nome: '',
  email: '',
  telefono: '',
  citta: '',
  marca: '',
  modello: '',
  versione: '',
  anno: '',
  km: '',
  cilindrata: '',
  alimentazione: '',
  targa: '',
  colore: '',
  proprietari: '',
  stato: '',
  incidentato: 'no',
  tagliandi: 'no',
  revisione: 'no',
  accessori: '',
  descrizione: '',
  difetti: '',
  prezzoDesiderato: '',
  motoInteresse: '',
  privacy: false
})

const submitted = ref(false)
const showForm = ref(false)
const loading = ref(false)
const imagesBase64 = ref({})

const toggleForm = () => {
  showForm.value = true
  nextTick(() => {
    const el = document.querySelector('.trade-form-container')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      gsap.fromTo(el, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
    }
  })
}

const handleFileUpload = (event, type) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    imagesBase64.value[type] = e.target.result
  }
  reader.readAsDataURL(file)
}

const submitForm = async () => {
  loading.value = true
  try {
    const payload = {
      ...form.value,
      imagesBase64: Object.values(imagesBase64.value)
    }

    const res = await $fetch('/api/trade-ins', {
      method: 'POST',
      body: payload
    })

    if (res.success) {
      submitted.value = true
      nextTick(() => {
        gsap.from('.success-message', {
          scale: 0.9,
          opacity: 0,
          duration: 0.5,
          ease: 'back.out(1.7)'
        })
      })
    }
  } catch (err) {
    console.error('Errore invio permuta:', err)
    alert('Si è verificato un errore durante l\'invio. Riprova più tardi.')
  } finally {
    loading.value = false
  }
}

let ctx
onMounted(async () => {
  await nextTick()
  ctx = gsap.context(() => {
    gsap.fromTo('.trade-header > *', 
      { y: 30, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.trade-section',
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

    gsap.fromTo('.benefit-item', 
      { y: 20, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.benefits-row',
          start: 'top 85%',
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
      }
    )

    gsap.fromTo('.trade-cta-wrapper', 
      { y: 30, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.trade-cta-wrapper',
          start: 'top 85%',
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        clearProps: 'all'
      }
    )
  })
})
</script>

<template>
  <section id="permute" class="trade-section">
    <div class="container">
      <!-- Header Sezione -->
      <div class="trade-header">
        <p class="section-kicker">Valuta il tuo usato</p>
        <h2 class="section-title">Accettiamo anche permute</h2>
        <p class="section-subtitle">
          Hai una moto o uno scooter da permutare? Inviaci i dati del tuo veicolo e ti contatteremo con una valutazione preliminare. 
          Valutiamo il tuo usato con serietà e trasparenza, anche in caso di acquisto di un altro veicolo presente in stock.
        </p>
      </div>

      <!-- Vantaggi -->
      <div class="benefits-row">
        <div class="benefit-item">
          <div class="benefit-icon">⏱️</div>
          <div class="benefit-info">
            <strong>Valutazione Rapida</strong>
            <p>Ricevi una stima indicativa in tempi brevi.</p>
          </div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">🔄</div>
          <div class="benefit-info">
            <strong>Permuta Flessibile</strong>
            <p>Valida su moto nuove e usate in stock.</p>
          </div>
        </div>
        <div class="benefit-item">
          <div class="benefit-icon">👨‍🔧</div>
          <div class="benefit-info">
            <strong>Supporto Dedicato</strong>
            <p>Il nostro team ti segue passo dopo passo.</p>
          </div>
        </div>
      </div>

      <!-- Pulsante per mostrare il form -->
      <div v-if="!showForm && !submitted" class="trade-cta-wrapper">
        <button @click="toggleForm" class="btn-start-trade">
          Inizia Valutazione Permuta
          <span class="icon">📝</span>
        </button>
        <p class="cta-hint">Compila il form con i dati della tua moto per ricevere una quotazione.</p>
      </div>

      <!-- Container Form -->
      <div v-if="showForm || submitted" class="trade-form-container">
        <div v-if="!submitted" class="form-wrapper">
          <form @submit.prevent="submitForm" class="trade-form">
            
            <!-- Gruppo: Dati Personali -->
            <div class="form-group-section">
              <h3 class="group-title">Dati Personali</h3>
              <div class="form-grid">
                <div class="input-box">
                  <label>Nome e Cognome *</label>
                  <input v-model="form.nome" type="text" placeholder="Es: Mario Rossi" required />
                </div>
                <div class="input-box">
                  <label>Email *</label>
                  <input v-model="form.email" type="email" placeholder="mario.rossi@email.it" required />
                </div>
                <div class="input-box">
                  <label>Telefono *</label>
                  <input v-model="form.telefono" type="tel" placeholder="Es: 333 1234567" required />
                </div>
                <div class="input-box">
                  <label>Città *</label>
                  <input v-model="form.citta" type="text" placeholder="Es: Capodrise" required />
                </div>
              </div>
            </div>

            <!-- Gruppo: Dati Veicolo -->
            <div class="form-group-section">
              <h3 class="group-title">Dati del Veicolo</h3>
              <div class="form-grid">
                <div class="input-box">
                  <label>Marca *</label>
                  <input v-model="form.marca" type="text" placeholder="Es: Honda" required />
                </div>
                <div class="input-box">
                  <label>Modello *</label>
                  <input v-model="form.modello" type="text" placeholder="Es: Hornet 600" required />
                </div>
                <div class="input-box">
                  <label>Versione / Allestimento</label>
                  <input v-model="form.versione" type="text" placeholder="Es: ABS / SP" />
                </div>
                <div class="input-box">
                  <label>Anno Immatricolazione *</label>
                  <input v-model="form.anno" type="number" placeholder="Es: 2022" required />
                </div>
                <div class="input-box">
                  <label>Chilometraggio *</label>
                  <input v-model="form.km" type="number" placeholder="Es: 15000" required />
                </div>
                <div class="input-box">
                  <label>Cilindrata (cc) *</label>
                  <input v-model="form.cilindrata" type="number" placeholder="Es: 600" required />
                </div>
                <div class="input-box">
                  <label>Alimentazione</label>
                  <select v-model="form.alimentazione">
                    <option value="">Seleziona</option>
                    <option value="benzina">Benzina</option>
                    <option value="elettrica">Elettrica</option>
                  </select>
                </div>
                <div class="input-box">
                  <label>Targa</label>
                  <input v-model="form.targa" type="text" placeholder="Es: AA12345" />
                </div>
                <div class="input-box">
                  <label>Colore</label>
                  <input v-model="form.colore" type="text" placeholder="Es: Rosso" />
                </div>
                <div class="input-box">
                  <label>N. Proprietari Precedenti</label>
                  <input v-model="form.proprietari" type="number" placeholder="Es: 1" />
                </div>
              </div>
            </div>

            <!-- Gruppo: Condizioni e Stato -->
            <div class="form-group-section">
              <h3 class="group-title">Condizioni e Stato</h3>
              <div class="form-grid">
                <div class="input-box full-width">
                  <label>Stato del veicolo (ottimo, buono, da sistemare)</label>
                  <input v-model="form.stato" type="text" placeholder="Descrivi brevemente lo stato generale" />
                </div>
                <div class="radio-group">
                  <label>Veicolo incidentato?</label>
                  <div class="radio-options">
                    <label><input type="radio" v-model="form.incidentato" value="si" /> Sì</label>
                    <label><input type="radio" v-model="form.incidentato" value="no" /> No</label>
                  </div>
                </div>
                <div class="radio-group">
                  <label>Tagliandi eseguiti regolarmente?</label>
                  <div class="radio-options">
                    <label><input type="radio" v-model="form.tagliandi" value="si" /> Sì</label>
                    <label><input type="radio" v-model="form.tagliandi" value="no" /> No</label>
                  </div>
                </div>
                <div class="radio-group">
                  <label>Revisione valida?</label>
                  <div class="radio-options">
                    <label><input type="radio" v-model="form.revisione" value="si" /> Sì</label>
                    <label><input type="radio" v-model="form.revisione" value="no" /> No</label>
                  </div>
                </div>
                <div class="input-box full-width">
                  <label>Accessori presenti</label>
                  <input v-model="form.accessori" type="text" placeholder="Es: Bauletto, Scarico sportivo, etc." />
                </div>
                <div class="input-box full-width">
                  <label>Descrizione dettagliata della moto *</label>
                  <textarea 
                    v-model="form.descrizione" 
                    placeholder="Inserisci qui tutte le informazioni utili sulla moto: condizioni generali, stato di carrozzeria e meccanica, tagliandi, accessori, modifiche, gomme, freni, eventuali difetti o interventi eseguiti."
                    required
                  ></textarea>
                </div>
                <div class="input-box full-width">
                  <label>Eventuali lavori da fare o difetti da segnalare</label>
                  <textarea v-model="form.difetti" placeholder="Segnala graffi, usura gomme o interventi meccanici necessari"></textarea>
                </div>
                <div class="input-box">
                  <label>Prezzo desiderato (€)</label>
                  <input v-model="form.prezzoDesiderato" type="number" placeholder="Es: 5500" />
                </div>
                <div class="input-box">
                  <label>Moto di interesse (se presente)</label>
                  <input v-model="form.motoInteresse" type="text" placeholder="Quale moto vorresti acquistare?" />
                </div>
              </div>
            </div>

            <!-- Gruppo: Foto -->
            <div class="form-group-section">
              <h3 class="group-title">Foto del Veicolo</h3>
              <p class="upload-note">Carica almeno le foto: frontale, laterale, posteriore e cruscotto.</p>
              <div class="upload-grid">
                <div class="upload-item">
                  <span>Frontale</span>
                  <input type="file" @change="e => handleFileUpload(e, 'frontale')" accept="image/*" />
                </div>
                <div class="upload-item">
                  <span>Laterale</span>
                  <input type="file" @change="e => handleFileUpload(e, 'laterale')" accept="image/*" />
                </div>
                <div class="upload-item">
                  <span>Posteriore</span>
                  <input type="file" @change="e => handleFileUpload(e, 'posteriore')" accept="image/*" />
                </div>
                <div class="upload-item">
                  <span>Cruscotto / KM</span>
                  <input type="file" @change="e => handleFileUpload(e, 'cruscotto')" accept="image/*" />
                </div>
              </div>
            </div>

            <!-- Privacy e Invio -->
            <div class="form-footer">
              <label class="privacy-checkbox">
                <input type="checkbox" v-model="form.privacy" required />
                <span>Acconsento al trattamento dei dati personali secondo la <NuxtLink to="/privacy">Privacy Policy</NuxtLink> *</span>
              </label>
              
              <div class="submit-wrapper">
                <button type="submit" class="btn-primary-custom" :disabled="loading">
                  <span v-if="!loading">Richiedi valutazione permuta</span>
                  <span v-else>Invio in corso...</span>
                </button>
                <p class="disclaimer-note">
                  La valutazione online è indicativa. La quotazione finale verrà confermata dopo controllo del veicolo presso la concessionaria.
                </p>
              </div>
            </div>

          </form>
        </div>

        <!-- Messaggio di Successo -->
        <div v-else class="success-message">
          <div class="success-icon">✅</div>
          <h3>Richiesta inviata con successo!</h3>
          <p>Ti contatteremo al più presto per la valutazione preliminare del tuo veicolo.</p>
          <button @click="submitted = false" class="btn-outline-custom">Invia un'altra richiesta</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trade-section {
  padding: 120px 0;
  background: var(--bg);
  position: relative;
}

.trade-header {
  max-width: 850px;
  margin-bottom: 60px;
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
  line-height: 1.1;
}

.section-subtitle {
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}

/* Vantaggi */
.benefits-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 80px;
}

.benefit-item {
  display: flex;
  gap: 20px;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.benefit-icon {
  font-size: 2rem;
  background: rgba(225, 29, 72, 0.1);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
}

.benefit-info strong {
  display: block;
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 4px;
}

.benefit-info p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Form Container */
.trade-form-container {
  background: var(--panel);
  border-radius: 40px;
  padding: 60px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
}

.group-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 32px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--primary);
  display: inline-block;
}

.form-group-section {
  margin-bottom: 60px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.input-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-box.full-width {
  grid-column: span 2;
}

.input-box label {
  font-size: 0.9rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
}

.input-box input, 
.input-box select, 
.input-box textarea {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 18px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-box textarea {
  min-height: 120px;
  resize: vertical;
}

.input-box input:focus, 
.input-box select:focus, 
.input-box textarea:focus {
  outline: none;
  border-color: var(--primary-2);
  background: rgba(255, 255, 255, 0.07);
}

/* Radio buttons */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-group > label {
  font-size: 0.9rem;
  font-weight: 700;
}

.radio-options {
  display: flex;
  gap: 24px;
}

.radio-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
}

/* Upload Section */
.upload-note {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 24px;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.upload-item {
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.upload-item span {
  font-size: 0.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
}

.upload-item input {
  font-size: 0.7rem;
  width: 100%;
}

/* Form Footer */
.form-footer {
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.privacy-checkbox {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  margin-bottom: 40px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
}

.privacy-checkbox a {
  color: var(--primary-2);
  text-decoration: underline;
}

.submit-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.btn-primary-custom {
  padding: 18px 48px;
  font-size: 1.1rem;
  border-radius: 100px;
}

.btn-primary-custom:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.disclaimer-note {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  max-width: 500px;
  text-align: center;
  line-height: 1.5;
}

/* Success Message */
.success-message {
  text-align: center;
  padding: 40px 0;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 24px;
}

.success-message h3 {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 16px;
}

.success-message p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 40px;
}

.btn-outline-custom {
  padding: 14px 32px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 700;
  transition: all 0.3s;
}

.btn-outline-custom:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #fff;
}

/* Nuova Sezione CTA Permuta */
.trade-cta-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
  background: rgba(225, 29, 72, 0.03);
  border: 1px dashed rgba(225, 29, 72, 0.15);
  border-radius: 40px;
  margin: 40px 0;
  transition: all 0.4s ease;
}

.trade-cta-wrapper:hover {
  background: rgba(225, 29, 72, 0.05);
  border-color: rgba(225, 29, 72, 0.3);
}

.btn-start-trade {
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: white;
  border: none;
  padding: 20px 48px;
  font-size: 1.25rem;
  font-weight: 900;
  border-radius: 100px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 15px 35px -10px rgba(225, 29, 72, 0.5);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-start-trade:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 20px 45px -12px rgba(225, 29, 72, 0.6);
}

.btn-start-trade .icon {
  font-size: 1.5rem;
}

.cta-hint {
  margin-top: 24px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .benefits-row {
    grid-template-columns: 1fr;
  }
  .trade-form-container {
    padding: 40px 30px;
  }
  .upload-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .input-box.full-width {
    grid-column: span 1;
  }
}
</style>
