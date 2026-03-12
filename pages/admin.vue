<template>
  <div class="admin-container">
    <!-- Login Section -->
    <div v-if="!isAuthenticated" class="login-wall">
      <div class="login-card">
        <img src="/logo-road-runner.jpg" alt="Logo" class="login-logo" />
        <h2>Accesso Clienti</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <input 
              type="text" 
              v-model="usernameInput" 
              placeholder="Username" 
              required 
            />
          </div>
          <div class="form-group">
            <input 
              type="password" 
              v-model="passwordInput" 
              placeholder="Password" 
              required 
            />
          </div>
          <button type="submit" class="btn-primary-custom">Accedi</button>
          <p v-if="loginError" class="error-msg">Credenziali errate</p>
        </form>
      </div>
    </div>

    <!-- Admin Dashboard -->
    <div v-else class="admin-dashboard">
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <img src="/logo-road-runner.jpg" alt="Logo" class="sidebar-logo" />
          <span>Road Runner Admin</span>
        </div>
        <nav class="sidebar-nav">
          <button 
            :class="{ active: currentTab === 'list' }" 
            @click="currentTab = 'list'"
          >
            <span class="icon">🏍️</span> Gestisci Veicoli
          </button>
          <button 
            :class="{ active: currentTab === 'add' }" 
            @click="openAddForm"
          >
            <span class="icon">➕</span> Aggiungi Nuovo
          </button>
        </nav>
        <button @click="logout" class="btn-logout">Esci</button>
      </aside>

      <main class="admin-content">
        <!-- List View -->
        <section v-if="currentTab === 'list'" class="content-section">
          <div class="section-header">
            <h2>I Tuoi Veicoli</h2>
            <p>Gestisci il tuo parco moto online</p>
          </div>

          <div v-if="loading" class="loading-state">Caricamento veicoli...</div>
          
          <div v-else-if="motos.length === 0" class="empty-state">
            <p>Non ci sono veicoli caricati.</p>
            <button @click="currentTab = 'add'" class="btn-primary-custom">Carica la prima moto</button>
          </div>

          <div v-else class="motos-grid">
            <div v-for="m in motos" :key="m._id" class="moto-card-admin">
              <div class="moto-img-admin">
                <MotoCarousel :images="m.immagini" :altText="`${m.marca} ${m.modello}`" />
              </div>
              <div class="moto-info-admin">
                <h3>{{ m.marca }} {{ m.modello }}</h3>
                <p class="description-preview">{{ m.descrizione || 'Nessuna descrizione' }}</p>
                <p class="price">€ {{ m.prezzo }}</p>
                <div class="actions-admin">
                  <button @click="editMoto(m)" class="btn-edit">Modifica</button>
                  <button @click="confirmDelete(m)" class="btn-delete">Elimina</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Form View (Add/Edit) -->
        <section v-if="currentTab === 'add' || currentTab === 'edit'" class="content-section">
          <div class="section-header">
            <h2>{{ currentTab === 'add' ? 'Carica Nuova Moto' : 'Modifica Veicolo' }}</h2>
            <button @click="currentTab = 'list'" class="btn-back">← Torna alla lista</button>
          </div>

          <form @submit.prevent="handleSubmit" class="moto-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Marca</label>
                <input type="text" v-model="motoForm.marca" required placeholder="Es: Ducati" />
              </div>
              <div class="form-group">
                <label>Modello</label>
                <input type="text" v-model="motoForm.modello" required placeholder="Es: Monster 821" />
              </div>
              <div class="form-group">
                <label>Prezzo (€)</label>
                <input type="number" v-model="motoForm.prezzo" required />
              </div>
              <div class="form-group">
                <label>Anno</label>
                <input type="number" v-model="motoForm.annoImmatricolazione" />
              </div>
              <div class="form-group">
                <label>Chilometri</label>
                <input type="number" v-model="motoForm.chilometri" />
              </div>
              <div class="form-group">
                <label>Cilindrata (cc)</label>
                <input type="number" v-model="motoForm.cilindrata" />
              </div>
              <div class="form-group full-width">
                <label>Tipo</label>
                <select v-model="motoForm.tipo" required>
                  <option value="moto">Moto</option>
                  <option value="scooter">Scooter</option>
                </select>
              </div>
              <div class="form-group full-width">
                <label>Descrizione</label>
                <textarea v-model="motoForm.descrizione" placeholder="Descrivi lo stato del veicolo..."></textarea>
              </div>
              
              <div class="form-group full-width">
                <label>Immagini</label>
                <input type="file" @change="handleImageUpload" multiple accept="image/*" class="file-input" />
                <div v-if="imagePreviews.length" class="image-previews">
                  <div v-for="(preview, index) in imagePreviews" :key="index" class="image-preview-item">
                    <img :src="preview" />
                    <button @click="removeImage(index)" type="button" class="remove-btn">×</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" :disabled="submitting" class="btn-primary-custom">
                {{ submitting ? 'Salvataggio...' : (currentTab === 'add' ? 'Pubblica Veicolo' : 'Salva Modifiche') }}
              </button>
              <p v-if="formMessage" :class="['msg', isSuccess ? 'success' : 'error']">{{ formMessage }}</p>
            </div>
          </form>
        </section>
      </main>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <h3>Conferma Eliminazione</h3>
        <p>Sei sicuro di voler eliminare definitivamente <strong>{{ motoToDelete?.marca }} {{ motoToDelete?.modello }}</strong>?</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn-cancel">Annulla</button>
          <button @click="deleteMoto" class="btn-delete-confirm">Sì, Elimina</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import MotoCarousel from '~/components/moto/MotoCarousel.vue'

// --- Auth State ---
const config = useRuntimeConfig()
const isAuthenticated = ref(false)
const usernameInput = ref('')
const passwordInput = ref('')
const loginError = ref(false)
const ADMIN_USER = config.public.adminUser || 'roadrunner'
const ADMIN_PASSWORD = config.public.adminPassword || 'runner2026'

const handleLogin = () => {
  if (usernameInput.value === ADMIN_USER && passwordInput.value === ADMIN_PASSWORD) {
    isAuthenticated.value = true
    localStorage.setItem('rr_admin_auth', 'true')
    fetchMotos()
  } else {
    loginError.value = true
  }
}

const logout = () => {
  isAuthenticated.value = false
  localStorage.removeItem('rr_admin_auth')
}

// --- Data State ---
const currentTab = ref('list')
const motos = ref([])
const loading = ref(false)
const submitting = ref(false)
const formMessage = ref('')
const isSuccess = ref(false)

const motoForm = ref({
  marca: '',
  modello: '',
  annoImmatricolazione: null,
  chilometri: null,
  cilindrata: null,
  prezzo: null,
  descrizione: '',
  tipo: 'moto',
  immagini: []
})

const initialForm = { ...motoForm.value }
const selectedFiles = ref([])
const imagePreviews = ref([])
const editingId = ref(null)

// --- Methods ---
const fetchMotos = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/motos')
    motos.value = res.motos
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const openAddForm = () => {
  motoForm.value = { ...initialForm }
  imagePreviews.value = []
  selectedFiles.value = []
  editingId.value = null
  currentTab.value = 'add'
}

const editMoto = (m) => {
  motoForm.value = { ...m }
  imagePreviews.value = [...(m.immagini || [])]
  editingId.value = m._id
  currentTab.value = 'edit'
}

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  
  // Aggiungiamo i file alla lista dei file da caricare
  selectedFiles.value = [...selectedFiles.value, ...files]
  
  // Creiamo le anteprime per i nuovi file
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  // Se l'immagine è già sul server (URL completo), la rimuoviamo da motoForm.immagini
  const imageToRemove = imagePreviews.value[index]
  if (typeof imageToRemove === 'string' && imageToRemove.startsWith('http')) {
    motoForm.value.immagini = motoForm.value.immagini.filter(img => img !== imageToRemove)
  } else {
    // Altrimenti è un file appena selezionato, lo rimuoviamo da selectedFiles
    // Dobbiamo trovare l'indice corretto in selectedFiles
    // Poiché imagePreviews contiene [immagini_esistenti, nuove_immagini]
    const existingCount = motoForm.value.immagini ? motoForm.value.immagini.length : 0
    const fileIndex = index - existingCount
    if (fileIndex >= 0) {
      selectedFiles.value.splice(fileIndex, 1)
    }
  }
  
  // Rimuoviamo l'anteprima in ogni caso
  imagePreviews.value.splice(index, 1)
}

const handleSubmit = async () => {
  submitting.value = true
  formMessage.value = ''
  
  try {
    // 1. Convertiamo i nuovi file selezionati in Base64
    const imagesBase64 = []
    for (const file of selectedFiles.value) {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
      imagesBase64.push(base64)
    }

    const method = editingId.value ? 'PUT' : 'POST'
    const url = editingId.value ? `/api/motos/${editingId.value}` : '/api/motos'
    
    // 2. Prepariamo il body: uniamo le immagini esistenti che sono rimaste con le nuove (Base64)
    const body = {
      ...motoForm.value,
      imagesBase64,
      // Passiamo solo le immagini che l'utente NON ha rimosso
      immagini: motoForm.value.immagini 
    }

    const response = await $fetch(url, {
      method,
      body
    })

    isSuccess.value = true
    formMessage.value = response.message || 'Operazione completata!'
    
    setTimeout(() => {
      fetchMotos()
      currentTab.value = 'list'
    }, 1500)

  } catch (error) {
    console.error('Errore durante il salvataggio:', error)
    isSuccess.value = false
    formMessage.value = 'Errore durante il salvataggio.'
  } finally {
    submitting.value = false
  }
}

// --- Delete Logic ---
const showDeleteModal = ref(false)
const motoToDelete = ref(null)

const confirmDelete = (m) => {
  motoToDelete.value = m
  showDeleteModal.value = true
}

const deleteMoto = async () => {
  if (!motoToDelete.value) return
  
  try {
    await $fetch(`/api/motos/${motoToDelete.value._id}`, { method: 'DELETE' })
    motos.value = motos.value.filter(m => m._id !== motoToDelete.value._id)
    showDeleteModal.value = false
  } catch (e) {
    alert('Errore durante l\'eliminazione')
  }
}

onMounted(() => {
  if (localStorage.getItem('rr_admin_auth') === 'true') {
    isAuthenticated.value = true
    fetchMotos()
  }
})
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  font-family: 'Inter', sans-serif;
}

/* Login Wall */
.login-wall {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-card {
  background: #1a1a1a;
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border: 1px solid #333;
}

.login-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 2px solid var(--primary);
}

.error-msg {
  color: var(--primary);
  margin-top: 10px;
  font-size: 0.9rem;
}

/* Dashboard Layout */
.admin-dashboard {
  display: flex;
  height: 100vh;
}

.admin-sidebar {
  width: 280px;
  background: #111;
  border-right: 1px solid #222;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 40px;
  font-weight: bold;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-nav button {
  background: transparent;
  border: none;
  color: #888;
  padding: 12px 15px;
  text-align: left;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.sidebar-nav button.active,
.sidebar-nav button:hover {
  background: #222;
  color: white;
}

.sidebar-nav button.active {
  color: var(--primary);
}

.btn-logout {
  background: transparent;
  border: 1px solid #333;
  color: #888;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
}

/* Content Area */
.admin-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.section-header h2 {
  font-size: 2rem;
  margin-bottom: 5px;
}

.section-header p {
  color: #888;
}

/* Grid View */
.motos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.moto-card-admin {
  background: #1a1a1a;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #222;
  transition: transform 0.3s;
}

.moto-card-admin:hover {
  transform: translateY(-5px);
}

.moto-img-admin {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-bottom: 1px solid #222;
}

.moto-info-admin {
  padding: 20px;
}

.moto-info-admin h3 {
  margin-bottom: 5px;
}

.description-preview {
  font-size: 0.85rem;
  color: #888;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
}

.moto-info-admin .price {
  color: var(--primary);
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

.actions-admin {
  display: flex;
  gap: 10px;
}

.btn-edit, .btn-delete {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
}

.btn-edit {
  background: #333;
  color: white;
}

.btn-delete {
  background: rgba(215, 24, 42, 0.1);
  color: var(--primary);
}

.btn-edit:hover, .btn-delete:hover {
  opacity: 0.8;
}

/* Form Styles */
.moto-form {
  background: #1a1a1a;
  padding: 30px;
  border-radius: 20px;
  border: 1px solid #222;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.full-width {
  grid-column: span 2;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #888;
  font-size: 0.9rem;
}

.form-group input, 
.form-group select, 
.form-group textarea {
  width: 100%;
  padding: 12px;
  background: #0a0a0a;
  border: 1px solid #333;
  border-radius: 10px;
  color: white;
  font-size: 1rem;
}

.form-group textarea {
  height: 100px;
  resize: vertical;
}

.image-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.image-preview-item {
  position: relative;
  width: 100px;
  height: 100px;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.remove-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #1a1a1a;
  padding: 30px;
  border-radius: 20px;
  max-width: 400px;
  text-align: center;
  border: 1px solid #333;
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.btn-cancel {
  flex: 1;
  background: #333;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
}

.btn-delete-confirm {
  flex: 1;
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
}

.msg {
  margin-top: 15px;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
}

.msg.success { background: rgba(40, 167, 69, 0.1); color: #28a745; }
.msg.error { background: rgba(220, 53, 69, 0.1); color: #dc3545; }

@media (max-width: 768px) {
  .admin-dashboard { flex-direction: column; }
  .admin-sidebar { width: 100%; height: auto; }
  .form-grid { grid-template-columns: 1fr; }
  .full-width { grid-column: span 1; }
}
</style>
