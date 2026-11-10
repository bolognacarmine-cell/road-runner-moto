<script setup>
useHead({
  title: 'Richieste degli Interessati (GDPR) | Road Runner Moto',
  meta: [
    { name: 'description', content: 'Esercita i tuoi diritti GDPR (accesso, rettifica, cancellazione, limitazione, portabilità, opposizione) verso Road Runner Moto. Richiesta online con risposta automatica.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Richieste degli Interessati (GDPR) | Road Runner Moto' },
    { property: 'og:description', content: 'Modulo per esercitare i diritti GDPR verso Road Runner Moto con conferma automatica.' },
    { property: 'og:image', content: 'https://road-runner.it/logo-road-runner.jpg' },
    { property: 'og:url', content: 'https://road-runner.it/richieste-privacy' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Richieste degli Interessati (GDPR) | Road Runner Moto' },
    { name: 'twitter:description', content: 'Esercita i tuoi diritti GDPR verso Road Runner Moto.' },
    { name: 'twitter:image', content: 'https://road-runner.it/logo-road-runner.jpg' }
  ],
  link: [
    { rel: 'canonical', href: 'https://road-runner.it/richieste-privacy' }
  ]
})

const TIPI = [
  { value: 'accesso', label: 'Accesso ai dati (art. 15)', desc: 'Vuoi sapere quali dati ti riguardano e come li trattiamo.' },
  { value: 'rettifica', label: 'Rettifica (art. 16)', desc: 'I tuoi dati sono inesatti o incompleti.' },
  { value: 'cancellazione', label: 'Cancellazione / Oblio (art. 17)', desc: 'Vuoi che rimuoviamo i tuoi dati personali.' },
  { value: 'limitazione', label: 'Limitazione del trattamento (art. 18)', desc: 'Vuoi limitare in modo temporaneo l\'uso dei tuoi dati.' },
  { value: 'portabilita', label: 'Portabilità (art. 20)', desc: 'Vuoi ricevere i tuoi dati in formato strutturato.' },
  { value: 'opposizione', label: 'Opposizione (art. 21)', desc: 'Ti opponi al trattamento basato sul nostro legittimo interesse.' }
]

const form = reactive({
  nome: '',
  email: '',
  telefono: '',
  tipo: 'accesso',
  messaggio: '',
  consenso: false
})

const loading = ref(false)
const error = ref('')
const success = ref(null) // { reference, deadline, autoResponse }

const formatDate = (iso) => new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })

const submit = async () => {
  error.value = ''
  success.value = null

  if (!form.nome.trim() || !form.email.trim() || form.messaggio.trim().length < 10) {
    error.value = 'Compila tutti i campi obbligatori.'
    return
  }
  if (!form.consenso) {
    error.value = 'Devi acconsentire al trattamento dei dati per inviare la richiesta.'
    return
  }

  loading.value = true
  try {
    const res = await $fetch('/api/privacy-requests', {
      method: 'POST',
      body: {
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        tipo: form.tipo,
        messaggio: form.messaggio.trim(),
        consenso: true
      }
    })
    success.value = res
    // conserva il riferimento in sessione per comodità
    if (import.meta.client && res.reference) {
      sessionStorage.setItem('rr_privacy_reference', res.reference)
    }
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Errore durante l\'invio. Riprova più tardi.'
  } finally {
    loading.value = false
  }
}

// --- verifica stato ------------------------------------------------------
const checkRef = ref('')
const checkLoading = ref(false)
const checkError = ref('')
const checkResult = ref(null)

const checkStatus = async () => {
  checkError.value = ''
  checkResult.value = null
  const ref = checkRef.value.trim().toLowerCase()
  if (!/^[a-f0-9]{32}$/.test(ref)) {
    checkError.value = 'Il riferimento è un codice esadecimale di 32 caratteri.'
    return
  }
  checkLoading.value = true
  try {
    const res = await $fetch(`/api/privacy-requests/${ref}`)
    checkResult.value = res
  } catch (e) {
    checkError.value = e?.statusCode === 404
      ? 'Nessuna richiesta trovata con questo riferimento.'
      : 'Errore durante la verifica. Riprova più tardi.'
  } finally {
    checkLoading.value = false
  }
}

onMounted(() => {
  if (import.meta.client) {
    const saved = sessionStorage.getItem('rr_privacy_reference')
    if (saved) checkRef.value = saved
  }
})

const STATUS_LABELS = {
  received: 'Ricevuta',
  in_lavorazione: 'In lavorazione',
  risolta: 'Risolta',
  rifiutata: 'Rifiutata'
}
</script>

<template>
  <div class="legal-page">
    <div class="legal-hero">
      <div class="container">
        <span class="legal-badge">Privacy &amp; Diritti</span>
        <h1 class="legal-title">Richieste degli Interessati</h1>
        <p class="legal-subtitle">Esercita i tuoi diritti GDPR (artt. 15-21) verso Road Runner Moto. Ricevi conferma automatica immediata.</p>
      </div>
      <div class="hero-glow"></div>
    </div>

    <div class="container legal-container">
      <section class="legal-section">
        <div class="section-number">01</div>
        <h2>I tuoi diritti</h2>
        <div class="section-body">
          <p>Il Regolamento UE 2016/679 (GDPR) ti riconosce i seguenti diritti. Puoi esercitarli con il modulo qui sotto: la conferma di ricezione è automatica e indica il riferimento della richiesta e la scadenza massima di risposta (30 giorni).</p>
          <div class="diritti-grid">
            <div v-for="d in TIPI" :key="d.value" class="diritto-card">
              <strong>{{ d.label }}</strong>
              <p>{{ d.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="legal-section">
        <div class="section-number">02</div>
        <h2>Invia una richiesta</h2>
        <div class="section-body">
          <div v-if="success" class="rr-success" role="status">
            <h3>Richiesta registrata</h3>
            <p class="rr-reference">Riferimento: <code>{{ success.reference }}</code></p>
            <p><strong>Risposta automatica:</strong> {{ success.autoResponse?.text }}</p>
            <p class="rr-deadline">Scadenza massima: {{ formatDate(success.deadline) }}</p>
            <p class="rr-hint">Conserva il riferimento: ti serve per verificare lo stato della richiesta.</p>
          </div>

          <form v-else class="rr-form" @submit.prevent="submit">
            <div class="rr-row">
              <label class="rr-field">
                <span>Nome e cognome *</span>
                <input v-model="form.nome" type="text" maxlength="100" required autocomplete="name">
              </label>
              <label class="rr-field">
                <span>Email *</span>
                <input v-model="form.email" type="email" maxlength="120" required autocomplete="email">
              </label>
            </div>

            <div class="rr-row">
              <label class="rr-field">
                <span>Telefono (facoltativo)</span>
                <input v-model="form.telefono" type="tel" maxlength="30" autocomplete="tel">
              </label>
              <label class="rr-field">
                <span>Tipo di richiesta *</span>
                <select v-model="form.tipo" required>
                  <option v-for="t in TIPI" :key="t.value" :value="t.value">{{ t.label }}</option>
                </select>
              </label>
            </div>

            <label class="rr-field">
              <span>Messaggio *</span>
              <textarea v-model="form.messaggio" rows="6" maxlength="5000" required
                placeholder="Descrivi la tua richiesta: quali dati ti riguardano e cosa intendi ottenere."></textarea>
            </label>

            <label class="rr-consent">
              <input v-model="form.consenso" type="checkbox" required>
              <span>Acconsento al trattamento dei dati personali per la gestione di questa richiesta, secondo la <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink> *</span>
            </label>

            <p v-if="error" class="rr-error" role="alert">{{ error }}</p>

            <button type="submit" class="rr-submit" :disabled="loading">
              {{ loading ? 'Invio in corso…' : 'Invia richiesta' }}
            </button>
          </form>
        </div>
      </section>

      <section class="legal-section">
        <div class="section-number">03</div>
        <h2>Verifica lo stato</h2>
        <div class="section-body">
          <p>Hai già inviato una richiesta? Inserisci il riferimento ricevuto nella conferma per conoscere lo stato.</p>
          <form class="rr-check" @submit.prevent="checkStatus">
            <input v-model="checkRef" type="text" maxlength="32" placeholder="Riferimento (32 caratteri)">
            <button type="submit" :disabled="checkLoading">{{ checkLoading ? 'Verifica…' : 'Verifica' }}</button>
          </form>
          <p v-if="checkError" class="rr-error" role="alert">{{ checkError }}</p>
          <div v-if="checkResult" class="rr-success" role="status">
            <p><strong>Stato:</strong> {{ STATUS_LABELS[checkResult.status] || checkResult.status }}</p>
            <p><strong>Tipo:</strong> {{ checkResult.tipo }}</p>
            <p><strong>Inviata il:</strong> {{ formatDate(checkResult.createdAt) }}</p>
            <p><strong>Scadenza:</strong> {{ formatDate(checkResult.deadline) }}</p>
            <p v-if="checkResult.autoResponse"><strong>Risposta automatica:</strong> {{ checkResult.autoResponse }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.diritti-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.diritto-card {
  background: var(--surface-2, #1a1a1a);
  border: 1px solid var(--border, #2a2a2a);
  border-radius: 12px;
  padding: 18px;
}

.diritto-card strong {
  display: block;
  margin-bottom: 8px;
  color: var(--accent, #e8b400);
}

.diritto-card p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.rr-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 720px;
}

.rr-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}

.rr-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

.rr-field input,
.rr-field select,
.rr-field textarea {
  background: var(--surface-2, #1a1a1a);
  border: 1px solid var(--border, #2a2a2a);
  border-radius: 8px;
  padding: 12px 14px;
  color: inherit;
  font: inherit;
  font-weight: 400;
}

.rr-field input:focus,
.rr-field select:focus,
.rr-field textarea:focus {
  outline: 2px solid var(--accent, #e8b400);
  outline-offset: 1px;
}

.rr-consent {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 0.85rem;
  line-height: 1.5;
}

.rr-consent input {
  margin-top: 3px;
}

.rr-error {
  color: #ff6b6b;
  margin: 0;
}

.rr-submit,
.rr-check button {
  background: var(--accent, #e8b400);
  color: #111;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-weight: 700;
  cursor: pointer;
}

.rr-submit:disabled,
.rr-check button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.rr-check {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  max-width: 520px;
}

.rr-check input {
  flex: 1;
  background: var(--surface-2, #1a1a1a);
  border: 1px solid var(--border, #2a2a2a);
  border-radius: 8px;
  padding: 12px 14px;
  color: inherit;
  font-family: monospace;
}

.rr-success {
  background: rgba(80, 200, 120, 0.08);
  border: 1px solid rgba(80, 200, 120, 0.35);
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
}

.rr-success h3 {
  margin-top: 0;
}

.rr-reference code {
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 1.05rem;
}

.rr-deadline,
.rr-hint {
  font-size: 0.9rem;
  margin-bottom: 0;
}
</style>
