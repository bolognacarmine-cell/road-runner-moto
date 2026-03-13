<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
const data = ref({
  vehicle: null,
  maintenance: [],
  documents: [],
  blogPosts: []
})
const loading = ref(true)
const activeTab = ref('profile')

const fetchPortalData = async (targa) => {
  try {
    const res = await $fetch(`/api/portal/data?targa=${targa}`)
    data.value = { ...res, blogPosts: [] }
    // Carica anche articoli di manutenzione dal blog
    fetchMaintenanceArticles()
  } catch (err) {
    console.error('Errore caricamento dati:', err)
  } finally {
    loading.value = false
  }
}

const fetchMaintenanceArticles = async () => {
  try {
    const res = await $fetch('/api/blog/maintenance')
    data.value.blogPosts = res.posts || []
  } catch (e) {
    console.error('Errore caricamento articoli manutenzione:', e)
  }
}
const logout = () => {
  localStorage.removeItem('rr_portal_token')
  localStorage.removeItem('rr_portal_user')
  router.push('/portale/login')
}

onMounted(() => {
  const savedUser = localStorage.getItem('rr_portal_user')
  if (!savedUser) {
    router.push('/portale/login')
    return
  }
  user.value = JSON.parse(savedUser)
  fetchPortalData(user.value.targa)
})

const formatPrice = (p) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(p)
const formatDate = (d) => new Date(d).toLocaleDateString('it-IT')
</script>

<template>
  <div class="portal-dashboard">
    <!-- Top Bar -->
    <header class="dashboard-header">
      <div class="container header-shell">
        <div class="brand-minimal">
          <img src="/logo-road-runner.jpg" alt="Logo" />
          <span>Area Clienti</span>
        </div>
        <div v-if="user" class="user-info">
          <span class="user-name">{{ user.nome }} {{ user.cognome }}</span>
          <button @click="logout" class="btn-logout-small">Esci</button>
        </div>
      </div>
    </header>

    <main class="container dashboard-main">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Caricamento dati del tuo veicolo...</p>
      </div>

      <div v-else-if="data.vehicle" class="dashboard-grid">
        <!-- Sidebar / Navigation -->
        <aside class="dashboard-nav">
          <div class="vehicle-mini-card">
            <img :src="data.vehicle.photoUrl || '/logo-road-runner.jpg'" alt="Moto" />
            <div class="mini-info">
              <h3>{{ data.vehicle.marca }} {{ data.vehicle.modello }}</h3>
              <span class="plate-badge">{{ data.vehicle.targa }}</span>
            </div>
          </div>
          <nav class="nav-links">
            <button :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">
              <span class="icon">🏍️</span> Profilo Moto
            </button>
            <button :class="{ active: activeTab === 'history' }" @click="activeTab = 'history'">
              <span class="icon">🔧</span> Manutenzioni
            </button>
            <button :class="{ active: activeTab === 'booking' }" @click="activeTab = 'booking'">
              <span class="icon">📅</span> Prenota Officina
            </button>
          </nav>
        </aside>

        <!-- Main Content Area -->
        <section class="dashboard-content">
          
          <!-- TAB: PROFILO MOTO -->
          <div v-if="activeTab === 'profile'" class="tab-pane">
            <div class="content-header">
              <h2>Il tuo Veicolo</h2>
              <span v-if="data.vehicle.avvisi" class="warranty-badge warning">{{ data.vehicle.avvisi }}</span>
              <span v-else class="warranty-badge">Dati Aggiornati</span>
            </div>
            
            <div class="info-grid">
              <div class="info-card">
                <label>Dati Iniziali</label>
                <ul>
                  <li><span>Marca:</span> {{ data.vehicle.marca }}</li>
                  <li><span>Modello:</span> {{ data.vehicle.modello }}</li>
                  <li><span>Data Acquisto:</span> {{ data.vehicle.dataAcquisto ? formatDate(data.vehicle.dataAcquisto) : 'N.D.' }}</li>
                  <li><span>Km Iniziali:</span> {{ data.vehicle.kmIniziali || 0 }} km</li>
                </ul>
              </div>
              <div class="info-card">
                <label>Stato Attuale</label>
                <ul>
                  <li><span>Targa:</span> {{ data.vehicle.targa }}</li>
                  <li><span>Km Attuali:</span> <strong>{{ data.vehicle.kmAttuali || 0 }} km</strong></li>
                  <li><span>Prossima Manutenzione:</span> <code class="next-maint">{{ data.vehicle.prossimaManutenzione || 'Da definire' }}</code></li>
                </ul>
              </div>
            </div>

            <div class="reminders-section" v-if="data.vehicle.avvisi">
              <h3>Avvisi e Suggerimenti</h3>
              <div class="reminder-item highlight">
                <span class="rem-icon">⚠️</span>
                <div class="rem-info">
                  <strong>Nota del Meccanico</strong>
                  <p>{{ data.vehicle.avvisi }}</p>
                </div>
              </div>
            </div>

            <!-- Articoli Manutenzione Correlati -->
            <div v-if="data.blogPosts.length > 0" class="portal-blog-section">
              <h3>Consigli di Manutenzione per te</h3>
              <div class="portal-blog-grid">
                <NuxtLink v-for="post in data.blogPosts" :key="post._id" :to="`/blog/${post.slug}`" class="portal-blog-card">
                  <img :src="post.imageCover || '/logo-road-runner.jpg'" alt="Blog" />
                  <div class="p-blog-info">
                    <h4>{{ post.title }}</h4>
                    <span class="p-read-more">Leggi di più →</span>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- TAB: STORICO MANUTENZIONI -->
          <div v-if="activeTab === 'history'" class="tab-pane">
            <div class="content-header">
              <h2>Cronologia Interventi</h2>
            </div>
            
            <div v-if="data.maintenance.length === 0" class="empty-tab">
              <p>Nessun intervento registrato.</p>
            </div>
            
            <div v-else class="maintenance-timeline">
              <div v-for="item in data.maintenance" :key="item._id" class="timeline-item">
                <div class="time-point"></div>
                <div class="timeline-card">
                  <div class="tm-header">
                    <span class="tm-date">{{ formatDate(item.data) }}</span>
                    <span class="tm-cost" v-if="item.costo">{{ formatPrice(item.costo) }}</span>
                  </div>
                  <h4>{{ item.descrizione }}</h4>
                  <div class="tm-details">
                    <p class="km-label">🏁 {{ item.km }} km</p>
                    <p v-if="item.partiSostituite" class="parts-list">📦 Parti: {{ item.partiSostituite }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: DOCUMENTI REMOVED -->

          <!-- TAB: PRENOTAZIONE -->
          <div v-if="activeTab === 'booking'" class="tab-pane">
            <div class="content-header">
              <h2>Prenota in Officina</h2>
            </div>
            <div class="booking-placeholder">
              <p>Seleziona un servizio e una data disponibile.</p>
              <!-- Qui andrebbe un calendario interattivo -->
              <div class="booking-options">
                <button class="btn-option">Tagliando Ordinario</button>
                <button class="btn-option">Cambio Gomme</button>
                <button class="btn-option">Controllo Generale</button>
              </div>
              <button class="btn-primary-custom">Verifica Disponibilità</button>
            </div>
          </div>

        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.portal-dashboard {
  min-height: 100vh;
  background: #050505;
  color: #fff;
}

.dashboard-header {
  height: 80px;
  background: rgba(15, 15, 15, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-shell {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-minimal {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-minimal img {
  height: 40px;
  border-radius: 6px;
}

.brand-minimal span {
  font-weight: 800;
  letter-spacing: 0.05em;
  color: var(--primary-2);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-logout-small {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--line);
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
}

.dashboard-main {
  padding: 40px 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

/* Navigazione */
.dashboard-nav {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.vehicle-mini-card {
  background: var(--panel);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--line);
}

.vehicle-mini-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.mini-info {
  padding: 20px;
}

.mini-info h3 {
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.plate-badge {
  background: var(--primary);
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-links button {
  background: none;
  border: 1px solid transparent;
  color: var(--muted);
  text-align: left;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-links button .icon {
  font-size: 1.2rem;
}

.nav-links button:hover {
  background: rgba(255,255,255,0.03);
  color: #fff;
}

.nav-links button.active {
  background: var(--panel);
  border-color: var(--line);
  color: var(--primary-2);
}

/* Content Area */
.dashboard-content {
  background: var(--panel);
  border-radius: 24px;
  border: 1px solid var(--line);
  padding: 40px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.content-header h2 {
  font-size: 2rem;
  font-weight: 900;
}

.warranty-badge {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
  border: 1px solid #28a745;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 700;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

@media (max-width: 640px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

.info-card label {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--primary-2);
  margin-bottom: 20px;
}

.info-card ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-card ul li {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
  font-size: 0.95rem;
}

.info-card ul li span {
  color: var(--muted);
}

.info-card code {
  color: #ffc107;
  font-family: monospace;
}

/* Timeline */
.maintenance-timeline {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-left: 20px;
  border-left: 2px solid var(--line);
}

.timeline-item {
  position: relative;
}

.time-point {
  position: absolute;
  left: -27px;
  top: 20px;
  width: 12px;
  height: 12px;
  background: var(--primary-2);
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(215, 24, 42, 0.2);
}

.timeline-card {
  background: var(--panel-2);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 24px;
}

.tm-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.tm-date { font-size: 0.85rem; color: var(--muted); }
.tm-cost { font-weight: 800; color: #fff; }

.tm-desc {
  color: var(--muted);
  font-size: 0.9rem;
  margin: 10px 0 20px;
}

.tm-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.btn-text {
  color: var(--primary-2);
  font-weight: 700;
}

/* Docs */
.docs-grid {
  display: grid;
  gap: 16px;
}

.doc-card {
  background: var(--panel-2);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.doc-icon {
  background: #ff5b6b;
  color: #fff;
  padding: 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 900;
}

.doc-info {
  flex: 1;
}

.doc-info h4 { margin-bottom: 4px; }
.doc-info span { font-size: 0.8rem; color: var(--muted); }

.btn-download {
  color: var(--primary-2);
  font-weight: 700;
  font-size: 0.9rem;
}

/* Reminders */
.reminders-section {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid var(--line);
}

.reminders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.reminder-item {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--line);
  padding: 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.rem-icon { font-size: 1.5rem; }
.rem-info strong { display: block; margin-bottom: 4px; }
.rem-info p { font-size: 0.85rem; color: var(--muted); }

/* Portal Blog Styles */
.portal-blog-section {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid var(--line);
}

.portal-blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.portal-blog-card {
  display: flex;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--line);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.portal-blog-card:hover {
  background: rgba(255,255,255,0.05);
  border-color: var(--primary-2);
}

.portal-blog-card img {
  width: 100px;
  height: 100%;
  object-fit: cover;
}

.p-blog-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.p-blog-info h4 {
  font-size: 0.95rem;
  line-height: 1.4;
  margin-bottom: 8px;
}

.p-read-more {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary-2);
  text-transform: uppercase;
}

.loading-state {
  text-align: center;
  padding: 100px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(215, 24, 42, 0.2);
  border-top-color: var(--primary-2);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
