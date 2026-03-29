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
      <!-- Mobile Header (Visible only on < 768px) -->
      <header class="admin-mobile-header">
        <div class="header-inner">
          <img src="/logo-road-runner.jpg" alt="Logo" class="sidebar-logo-mini" />
          <span class="header-title">Admin Panel</span>
          <button @click="isSidebarOpen = !isSidebarOpen" class="hamburger-admin" :class="{ active: isSidebarOpen }">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <!-- Sidebar Overlay -->
      <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="sidebar-overlay"></div>

      <aside class="admin-sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
        <div class="sidebar-header">
          <img src="/logo-road-runner.jpg" alt="Logo" class="sidebar-logo" />
          <span>Road Runner Admin</span>
        </div>
        <nav class="sidebar-nav">
          <button 
            :class="{ active: currentTab === 'list' }" 
            @click="currentTab = 'list'; isSidebarOpen = false"
          >
            <span class="icon">🏍️</span> Gestisci Veicoli
          </button>
          <button 
            :class="{ active: currentTab === 'add' }" 
            @click="openAddForm(); isSidebarOpen = false"
          >
            <span class="icon">➕</span> Aggiungi Nuovo
          </button>
          <button 
            :class="{ active: currentTab === 'leads' }" 
            @click="currentTab = 'leads'; fetchLeads(); isSidebarOpen = false"
          >
            <span class="icon">📩</span> Preventivi 
            <span v-if="leads.length" class="badge-count">{{ leads.length }}</span>
          </button>
          <button 
            :class="{ active: currentTab === 'tradeIns' }" 
            @click="currentTab = 'tradeIns'; fetchTradeIns(); isSidebarOpen = false"
          >
            <span class="icon">🔄</span> Permute 
            <span v-if="tradeIns.length" class="badge-count">{{ tradeIns.length }}</span>
          </button>
          <button 
            :class="{ active: currentTab === 'portal' }" 
            @click="currentTab = 'portal'; fetchPortalUsers(); isSidebarOpen = false"
          >
            <span class="icon">👤</span> Gestione Portale
          </button>
          <button 
            :class="{ active: currentTab === 'deadlines' }" 
            @click="currentTab = 'deadlines'; fetchPortalUsers(); isSidebarOpen = false"
          >
            <span class="icon">🔔</span> Alert Scadenze
            <span v-if="upcomingDeadlines && upcomingDeadlines.length" class="badge-count" :class="{ 'blink-badge': hasUrgentDeadlines }">
              {{ upcomingDeadlines.length }}
            </span>
          </button>
          <button 
            :class="{ active: currentTab === 'blog' }" 
            @click="currentTab = 'blog'; fetchBlogPosts(); isSidebarOpen = false"
          >
            <span class="icon">📰</span> Blog
          </button>
          <button 
            :class="{ active: currentTab === 'helmets' || currentTab === 'addHelmet' || currentTab === 'editHelmet' }" 
            @click="currentTab = 'helmets'; fetchHelmets(); isSidebarOpen = false"
          >
            <span class="icon">🪖</span> Gestione Caschi
          </button>
          <button 
            :class="{ active: currentTab === 'theme' }" 
            @click="currentTab = 'theme'; isSidebarOpen = false"
          >
            <span class="icon">🎨</span> Colori Template
          </button>
        </nav>
        <button @click="logout(); isSidebarOpen = false" class="btn-logout">Esci</button>
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
                <div class="moto-tags">
                  <span class="tag">{{ m.tipo }}</span>
                  <span v-if="m.categoria" class="tag category">{{ m.categoria }}</span>
                  <span class="tag status" :class="m.nuovaUsata">
                    {{ m.nuovaUsata === 'nuova' ? 'Nuova' : (m.nuovaUsata === 'promozione' ? 'Promozione' : 'Usata') }}
                  </span>
                  <span v-if="m.venduta" class="tag sold">VENDUTA</span>
                  <span class="tag visibility" :class="m.isVisible !== false ? 'visible' : 'hidden'">
                    {{ m.isVisible !== false ? '👁️ Visibile' : '🚫 Nascosto' }}
                  </span>
                </div>
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
              <div class="form-group">
                <label>Tipo</label>
                <select v-model="motoForm.tipo" required>
                  <option value="moto">Moto</option>
                  <option value="scooter">Scooter</option>
                </select>
              </div>
              <div class="form-group">
                <label>Stato</label>
                <select v-model="motoForm.nuovaUsata" required>
                  <option value="nuova">Nuova</option>
                  <option value="usata">Usata</option>
                  <option value="promozione">Promozione</option>
                </select>
              </div>
              <div class="form-group">
                <label>Stato Vendita</label>
                <select v-model="motoForm.venduta">
                  <option :value="false">Disponibile</option>
                  <option :value="true">Venduta</option>
                </select>
              </div>
              <div class="form-group">
                <label>Visibilità sul sito</label>
                <select v-model="motoForm.isVisible">
                  <option :value="true">Pubblico (Visibile)</option>
                  <option :value="false">Privato (Nascosto)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Categoria</label>
                <select v-model="motoForm.categoria" required>
                  <option v-for="cat in ['Naked', 'Sportive/Supersport', 'Adventure/Touring', 'Enduro/Off-road', 'Custom/Cruiser/Chopper', 'Scooter', 'Hypermotard', 'Motard', 'Crossover']" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>
              <div class="form-group full-width">
                <label>Descrizione</label>
                <textarea v-model="motoForm.descrizione" placeholder="Descrivi lo stato del veicolo..."></textarea>
              </div>
              
              <div class="form-group full-width">
                <label>Immagini</label>
                <input type="file" @change="handleImageUpload" multiple accept="image/*" class="file-input" />
                <div v-if="unifiedImages.length" class="image-previews">
                  <div v-for="(img, index) in unifiedImages" :key="index" class="image-preview-item">
                    <img :src="img.preview" />
                    <div class="image-controls">
                      <button @click="moveImage(index, -1)" type="button" class="move-btn" :disabled="index === 0" title="Sposta a sinistra">←</button>
                      <button @click="moveImage(index, 1)" type="button" class="move-btn" :disabled="index === unifiedImages.length - 1" title="Sposta a destra">→</button>
                      <button @click="removeImage(index)" type="button" class="remove-btn" title="Rimuovi">×</button>
                    </div>
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

        <!-- Helmets List View -->
        <section v-if="currentTab === 'helmets'" class="content-section">
          <div class="section-header">
            <div>
              <h2>Gestione Caschi Protettivi</h2>
              <p>Inserisci e modifica i caschi disponibili in negozio</p>
            </div>
            <button @click="openAddHelmetForm" class="btn-primary-custom">+ Aggiungi Casco</button>
          </div>

          <div v-if="loading" class="loading-state">Caricamento caschi...</div>
          
          <div v-else-if="helmets.length === 0" class="empty-state">
            <p>Nessun casco presente nel database.</p>
            <button @click="openAddHelmetForm" class="btn-primary-custom">Aggiungi il primo casco</button>
          </div>

          <div v-else class="motos-grid">
            <div v-for="h in helmets" :key="h._id" class="moto-card-admin">
              <div class="moto-img-admin">
                <MotoCarousel :images="h.immagini" :altText="h.nome" />
              </div>
              <div class="moto-info-admin">
                <h3>{{ h.marca }} {{ h.modello }}</h3>
                <div class="moto-tags">
                  <span class="tag">{{ h.categoria }}</span>
                  <span class="tag status" :class="h.disponibilita">{{ h.disponibilita }}</span>
                  <span class="tag badge-type" :class="h.badge">{{ h.badge }}</span>
                  <span class="tag visibility" :class="h.isVisible !== false ? 'visible' : 'hidden'">
                    {{ h.isVisible !== false ? '👁️ Visibile' : '🚫 Nascosto' }}
                  </span>
                </div>
                <p class="price">€ {{ h.prezzoScontato || h.prezzoOriginale }}</p>
                <div class="actions-admin">
                  <button @click="editHelmet(h)" class="btn-edit">Modifica</button>
                  <button @click="deleteHelmet(h._id)" class="btn-delete">Elimina</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Helmet Form View (Add/Edit) -->
        <section v-if="currentTab === 'addHelmet' || currentTab === 'editHelmet'" class="content-section">
          <div class="section-header">
            <h2>{{ currentTab === 'addHelmet' ? 'Nuovo Casco' : 'Modifica Casco' }}</h2>
            <button @click="currentTab = 'helmets'" class="btn-back">← Torna ai caschi</button>
          </div>

          <form @submit.prevent="handleHelmetSubmit" class="moto-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Nome Prodotto</label>
                <input type="text" v-model="helmetForm.nome" required />
              </div>
              <div class="form-group">
                <label>Marca</label>
                <input type="text" v-model="helmetForm.marca" required />
              </div>
              <div class="form-group">
                <label>Modello</label>
                <input type="text" v-model="helmetForm.modello" required />
              </div>
              <div class="form-group">
                <label>Categoria</label>
                <select v-model="helmetForm.categoria">
                  <option value="Integrale">Integrale</option>
                  <option value="Modular">Modulare</option>
                  <option value="Jet">Jet</option>
                  <option value="Cross">Cross / Enduro</option>
                </select>
              </div>
              <div class="form-group">
                <label>Prezzo Originale (€)</label>
                <input type="number" v-model="helmetForm.prezzoOriginale" required />
              </div>
              <div class="form-group">
                <label>Prezzo Scontato (€)</label>
                <input type="number" v-model="helmetForm.prezzoScontato" />
              </div>
              <div class="form-group">
                <label>Sconto (%)</label>
                <input type="number" v-model="helmetForm.scontoPercentuale" />
              </div>
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="helmetForm.promozioneAttiva" />
                  Promozione Attiva
                </label>
              </div>
              <div class="form-group">
                <label>Testo Promozionale</label>
                <input type="text" v-model="helmetForm.testoPromozionale" placeholder="Es: Sconto 20% solo per oggi" />
              </div>
              <div class="form-group">
                <label>Badge</label>
                <select v-model="helmetForm.badge">
                  <option value="novita">Novità</option>
                  <option value="promo">Promo</option>
                  <option value="offerta">In Offerta</option>
                  <option value="bestseller">Best Seller</option>
                </select>
              </div>
              <div class="form-group">
                <label>Colore Principale</label>
                <input type="text" v-model="helmetForm.colore" />
              </div>
              <div class="form-group">
                <label>Varianti Colore</label>
                <input type="text" v-model="helmetForm.variantiColore" placeholder="Es: Nero, Bianco, Rosso" />
              </div>
              <div class="form-group">
                <label>Taglie (es: S, M, L)</label>
                <input type="text" v-model="helmetForm.taglie" />
              </div>
              <div class="form-group">
                <label>Disponibilità</label>
                <select v-model="helmetForm.disponibilita">
                  <option value="disponibile">Disponibile</option>
                  <option value="ordinabile">Su Ordinazione</option>
                  <option value="esaurito">Esaurito</option>
                </select>
              </div>
              <div class="form-group">
                <label>Visibilità</label>
                <select v-model="helmetForm.isVisible">
                  <option :value="true">Pubblicato</option>
                  <option :value="false">Bozza (Nascosto)</option>
                </select>
              </div>
              <div class="form-group full-width">
                <label>Descrizione Breve</label>
                <input type="text" v-model="helmetForm.descrizioneBreve" />
              </div>
              <div class="form-group full-width">
                <label>Descrizione Completa</label>
                <textarea v-model="helmetForm.descrizioneCompleta" rows="4"></textarea>
              </div>
              <div class="form-group full-width">
                <label>Galleria Immagini</label>
                <input type="file" @change="handleHelmetImageUpload" multiple accept="image/*" class="file-input" />
                <div v-if="unifiedHelmetImages.length" class="image-previews">
                  <div v-for="(img, index) in unifiedHelmetImages" :key="index" class="image-preview-item">
                    <img :src="img.preview" />
                    <div class="image-controls">
                      <button @click="moveHelmetImage(index, -1)" type="button" class="move-btn" :disabled="index === 0">←</button>
                      <button @click="moveHelmetImage(index, 1)" type="button" class="move-btn" :disabled="index === unifiedHelmetImages.length - 1">→</button>
                      <button @click="removeHelmetImage(index)" type="button" class="remove-btn">×</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" :disabled="submitting" class="btn-primary-custom">
                {{ submitting ? 'Salvataggio...' : (currentTab === 'addHelmet' ? 'Crea Casco' : 'Salva Modifiche') }}
              </button>
              <p v-if="formMessage" :class="['msg', isSuccess ? 'success' : 'error']">{{ formMessage }}</p>
            </div>
          </form>
        </section>

        <!-- Leads View -->
        <section v-if="currentTab === 'leads'" class="content-section">
          <div class="section-header">
            <div>
              <h2>Richieste Preventivo</h2>
              <p>Gestisci i contatti dai potenziali clienti</p>
            </div>
            <button @click="currentTab = 'list'" class="btn-back">← Torna alla lista</button>
          </div>

          <div v-if="loading" class="loading-state">Caricamento richieste...</div>
          
          <div v-else-if="leads.length === 0" class="empty-state">
            <p>Non ci sono ancora richieste di preventivo.</p>
          </div>

          <div v-else class="leads-list">
            <div v-for="l in leads" :key="l._id" class="lead-card">
              <div class="lead-header">
                <span class="lead-date">
                  <ClientOnly>{{ new Date(l.createdAt).toLocaleDateString('it-IT') }}</ClientOnly>
                </span>
                <span class="lead-status" :class="l.status">{{ l.status }}</span>
              </div>
              <div class="lead-body">
                <div class="lead-info">
                  <h4>{{ l.nome }}</h4>
                  <p>📧 {{ l.email }}</p>
                  <p>📞 {{ l.telefono }}</p>
                  <p>📍 {{ l.citta || 'N/D' }}</p>
                </div>
                <div class="lead-moto">
                  <strong>Interesse:</strong>
                  <p>{{ l.marca }} {{ l.modello }} ({{ l.nuovaUsata }})</p>
                  <p>Tipo: {{ l.tipo }}</p>
                </div>
                <div class="lead-payment">
                  <strong>Acquisto:</strong>
                  <p>{{ l.metodoAcquisto }}</p>
                  <p v-if="l.valutazionePermuta === 'si'">🔄 Permuta: {{ l.permutaModello }} ({{ l.permutaAnno }})</p>
                </div>
                <div class="lead-actions-side">
                  <button @click="deleteLead(l._id)" class="btn-delete-small">Elimina</button>
                </div>
              </div>
              <div v-if="l.messaggio" class="lead-message">
                <strong>Messaggio:</strong>
                <p>{{ l.messaggio }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Trade-Ins View -->
        <section v-if="currentTab === 'tradeIns'" class="content-section">
          <div class="section-header">
            <div>
              <h2>Richieste Permuta</h2>
              <p>Gestisci le valutazioni dell'usato inviate dai clienti</p>
            </div>
            <button @click="currentTab = 'list'" class="btn-back">← Torna alla lista</button>
          </div>

          <div v-if="loading" class="loading-state">Caricamento richieste...</div>
          
          <div v-else-if="tradeIns.length === 0" class="empty-state">
            <p>Non ci sono ancora richieste di permuta.</p>
          </div>

          <div v-else class="leads-list">
            <div v-for="t in tradeIns" :key="t._id" class="lead-card trade-in-card">
              <div class="lead-header">
                <span class="lead-date">
                  <ClientOnly>{{ new Date(t.createdAt).toLocaleDateString('it-IT') }}</ClientOnly>
                </span>
                <span class="lead-status" :class="t.status">{{ t.status }}</span>
              </div>
              <div class="lead-body">
                <div class="lead-info">
                  <h4>{{ t.nome }}</h4>
                  <p>📧 {{ t.email }}</p>
                  <p>📞 {{ t.telefono }}</p>
                  <p>📍 {{ t.citta }}</p>
                </div>
                <div class="lead-moto">
                  <strong>Veicolo da permutare:</strong>
                  <p>{{ t.marca }} {{ t.modello }} {{ t.versione }}</p>
                  <p>Anno: {{ t.anno }} | Km: {{ t.km }}</p>
                  <p>Cilindrata: {{ t.cilindrata }} cc | Targa: {{ t.targa }}</p>
                </div>
                <div class="lead-payment">
                  <strong>Stato & Richiesta:</strong>
                  <p>Stato: {{ t.stato }}</p>
                  <p>Prezzo desiderato: <strong>€ {{ t.prezzoDesiderato }}</strong></p>
                  <p v-if="t.motoInteresse">Interesse per: <em>{{ t.motoInteresse }}</em></p>
                </div>
                <div class="lead-actions-side">
                  <button @click="deleteTradeIn(t._id)" class="btn-delete-small">Elimina</button>
                </div>
              </div>
              <div class="lead-details-grid">
                <div class="detail-item">
                  <strong>Incidentata:</strong> {{ t.incidentato }}
                </div>
                <div class="detail-item">
                  <strong>Tagliandata:</strong> {{ t.tagliandi }}
                </div>
                <div class="detail-item">
                  <strong>Revisionata:</strong> {{ t.revisione }}
                </div>
                <div class="detail-item">
                  <strong>Proprietari:</strong> {{ t.proprietari }}
                </div>
              </div>
              <div v-if="t.descrizione" class="lead-message">
                <strong>Descrizione:</strong>
                <p>{{ t.descrizione }}</p>
              </div>
              <div v-if="t.difetti" class="lead-message warning-msg">
                <strong>Difetti segnalati:</strong>
                <p>{{ t.difetti }}</p>
              </div>
              <div v-if="t.images && t.images.length" class="lead-images">
                <strong>Foto allegate:</strong>
                <div class="images-preview-grid">
                  <a v-for="(img, idx) in t.images" :key="idx" :href="img" target="_blank">
                    <img :src="img" alt="Foto permuta" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Portal Management View -->
        <section v-if="currentTab === 'portal'" class="content-section">
          <div class="section-header">
            <div>
              <h2>Gestione Portale Clienti</h2>
              <p>Crea e gestisci gli accessi privati per i tuoi clienti</p>
            </div>
            <button @click="currentTab = 'list'" class="btn-back">← Torna alla lista</button>
          </div>

          <div v-if="loading" class="loading-state">Caricamento...</div>

          <div v-else class="portal-admin-grid">
            <div class="portal-users-list">
              <div v-for="u in portalUsers" :key="u._id" class="user-card-admin">
                <div class="user-main-info">
                  <strong>{{ u.nome }} {{ u.cognome }}</strong>
                  <span>Targa: <code>{{ u.targa }}</code></span>
                </div>
                <div class="user-actions">
                  <button @click="openManageMoto(u)" class="btn-edit-small">Veicolo</button>
                  <button @click="openMaintenance(u)" class="btn-edit-small">Manutenzione</button>
                  <button @click="deletePortalUser(u._id)" class="btn-edit-small btn-delete-red">Elimina</button>
                </div>
              </div>
              <div v-if="portalUsers.length === 0" class="empty-state-small">
                Nessun cliente registrato nel portale.
              </div>
            </div>

            <div class="portal-add-user">
              <h3>Registra Nuovo Cliente</h3>
              <form @submit.prevent="handleCreatePortalUser" class="mini-form">
                <input v-model="newUser.nome" placeholder="Nome" required />
                <input v-model="newUser.cognome" placeholder="Cognome" required />
                <input v-model="newUser.targa" placeholder="Targa (es: AA123BB)" required />
                <input v-model="newUser.password" placeholder="Password Temporanea" required />
                <button type="submit" class="btn-primary-custom full">Crea Account Portale</button>
              </form>
            </div>
          </div>
        </section>

        <!-- Deadlines Alert View -->
        <section v-if="currentTab === 'deadlines'" class="content-section">
          <div class="section-header">
            <div>
              <h2>Alert Scadenze 🔔</h2>
              <p>Veicoli con scadenze imminenti o superate</p>
            </div>
            <button @click="currentTab = 'list'" class="btn-back">← Torna alla lista</button>
          </div>

          <div v-if="loading" class="loading-state">Analisi scadenze in corso...</div>

          <div v-else-if="upcomingDeadlines.length === 0" class="empty-state">
            <p>Nessuna scadenza imminente (entro 30 giorni) o superata.</p>
          </div>

          <div v-else class="deadlines-list">
            <div v-for="d in upcomingDeadlines" :key="d.targa" class="deadline-card" :class="{ 'expired': d.isExpired }">
              <div class="deadline-info">
                <div class="vehicle-details">
                  <strong>{{ d.marca }} {{ d.modello }}</strong>
                  <code>{{ d.targa }}</code>
                </div>
                <div class="owner-details">
                  <span>Cliente: {{ d.nome }} {{ d.cognome }}</span>
                </div>
              </div>
              
              <div class="deadlines-items">
                <div v-if="d.revisioneStatus" class="deadline-item" :class="d.revisioneStatus.type">
                  <span class="label">Revisione:</span>
                  <span class="date">{{ formatDate(d.scadenzaRevisione) }}</span>
                  <span class="days">({{ d.revisioneStatus.message }})</span>
                </div>
                <div v-if="d.assicurazioneStatus" class="deadline-item" :class="d.assicurazioneStatus.type">
                  <span class="label">Assicurazione:</span>
                  <span class="date">{{ formatDate(d.scadenzaAssicurazione) }}</span>
                  <span class="days">({{ d.assicurazioneStatus.message }})</span>
                </div>
                <div v-if="d.bolloStatus" class="deadline-item" :class="d.bolloStatus.type">
                  <span class="label">Bollo:</span>
                  <span class="date">{{ formatDate(d.scadenzaBollo) }}</span>
                  <span class="days">({{ d.bolloStatus.message }})</span>
                </div>
              </div>

              <div class="deadline-actions">
                <a :href="generateWhatsAppLink(d)" target="_blank" class="btn-whatsapp-small">
                  Avvisa su WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- Blog List View -->
        <section v-if="currentTab === 'blog'" class="content-section">
          <div class="section-header">
            <div>
              <h2>Blog & News</h2>
              <p>Gestisci gli articoli del sito</p>
            </div>
            <div class="flex gap-4">
              <button @click="resetBlogForm(); currentTab = 'add-blog'" class="btn-primary-custom">Scrivi Articolo</button>
              <button @click="currentTab = 'list'" class="btn-back">← Torna alla lista</button>
            </div>
          </div>

          <div v-if="loading" class="loading-state">Caricamento articoli...</div>
          
          <div v-else class="blog-admin-list">
            <div v-for="p in blogPosts" :key="p._id" class="blog-item-admin">
              <img :src="p.imageCover || '/logo-road-runner.jpg'" class="blog-thumb" />
              <div class="blog-info">
                <h3>{{ p.title }}</h3>
                <span class="blog-meta">{{ p.category }} • {{ new Date(p.date).toLocaleDateString() }}</span>
              </div>
              <div class="blog-actions">
                <button @click="editBlog(p)" class="btn-edit-small">Modifica</button>
                <button @click="deleteBlog(p._id)" class="btn-edit-small btn-delete-red">Elimina</button>
              </div>
            </div>
            <div v-if="blogPosts.length === 0" class="empty-state">Nessun articolo presente.</div>
          </div>
        </section>

        <!-- Blog Add/Edit View -->
        <section v-if="currentTab === 'add-blog'" class="content-section">
          <div class="section-header">
            <h2>{{ editingBlogId ? 'Modifica Articolo' : 'Nuovo Articolo' }}</h2>
            <button @click="currentTab = 'blog'" class="btn-back">← Torna al blog</button>
          </div>

          <form @submit.prevent="handleBlogSubmit" class="moto-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Titolo</label>
                <input v-model="blogForm.title" placeholder="Titolo articolo" required />
              </div>
              <div class="form-group">
                <label>Slug (URL)</label>
                <input v-model="blogForm.slug" placeholder="es: novita-honda-2026" required />
              </div>
              <div class="form-group">
                <label>Categoria</label>
                <select v-model="blogForm.category">
                  <option v-for="c in ['Novità Moto', 'Manutenzione', 'Consigli Guida', 'Offerte', 'Eventi']" :key="c">{{ c }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>URL Immagine Copertina</label>
                <input v-model="blogForm.imageCover" placeholder="https://cloudinary..." />
              </div>
              <div class="form-group full-width">
                <label>Estratto (breve descrizione)</label>
                <textarea v-model="blogForm.excerpt" placeholder="Breve sintesi per l'elenco..."></textarea>
              </div>
              <div class="form-group full-width">
                <label>Collega Moto (Seleziona veicoli correlati)</label>
                <div class="related-motos-selector">
                  <div v-for="m in motos" :key="m._id" class="moto-check">
                    <input 
                      type="checkbox" 
                      :id="`rel-${m._id}`" 
                      :value="m._id" 
                      v-model="blogForm.relatedMotos" 
                    />
                    <label :for="`rel-${m._id}`">{{ m.marca }} {{ m.modello }}</label>
                  </div>
                </div>
              </div>
              <div class="form-group full-width">
                <label>Contenuto (Markdown)</label>
                <textarea v-model="blogForm.content" placeholder="Scrivi il tuo articolo qui..." class="content-editor" required></textarea>
              </div>
            </div>
            <div class="form-actions mt-6">
              <button type="submit" class="btn-primary-custom" :disabled="submitting">
                {{ submitting ? 'Salvataggio...' : 'Salva Articolo' }}
              </button>
            </div>
          </form>
        </section>

        <!-- Theme Color View -->
        <section v-if="currentTab === 'theme'" class="content-section">
          <div class="section-header">
            <div>
              <h2>Personalizzazione Sito</h2>
              <p>Cambia l'aspetto visivo della tua concessionaria</p>
            </div>
            <button @click="currentTab = 'list'" class="btn-back">← Torna alla lista</button>
          </div>
          
          <div class="theme-content">
            <ThemeSwitcher />
          </div>
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

    <!-- Portal: Manage Moto Modal -->
    <div v-if="showPortalMotoModal" class="modal-overlay">
      <div class="modal large">
        <h3>Gestisci Veicolo Utente</h3>
        <p>Targa: <code>{{ selectedUserForAction?.targa }}</code></p>
        
        <form @submit.prevent="savePortalVehicle" class="mini-form mt-4">
          <div class="form-grid">
            <div class="form-group">
              <label>Marca</label>
              <input v-model="portalMotoForm.marca" placeholder="Es: Honda" required />
            </div>
            <div class="form-group">
              <label>Modello</label>
              <input v-model="portalMotoForm.modello" placeholder="Es: SH 150" required />
            </div>
            <div class="form-group">
              <label>Data Acquisto</label>
              <input type="date" v-model="portalMotoForm.dataAcquisto" />
            </div>
            <div class="form-group">
              <label>Km Iniziali</label>
              <input type="number" v-model="portalMotoForm.kmIniziali" />
            </div>
            <div class="form-group">
              <label>Km Attuali</label>
              <input type="number" v-model="portalMotoForm.kmAttuali" />
            </div>
            <div class="form-group">
              <label>Prossima Manutenzione (Km o Data)</label>
              <input v-model="portalMotoForm.prossimaManutenzione" placeholder="Es: 10.000 km o 12/2026" />
            </div>
            <div class="form-group">
              <label>Scadenza Revisione</label>
              <input type="date" v-model="portalMotoForm.scadenzaRevisione" />
            </div>
            <div class="form-group">
              <label>Scadenza Assicurazione</label>
              <input type="date" v-model="portalMotoForm.scadenzaAssicurazione" />
            </div>
            <div class="form-group">
              <label>Scadenza Bollo</label>
              <input type="date" v-model="portalMotoForm.scadenzaBollo" />
            </div>
            <div class="form-group full-width">
              <label>Avvisi / Suggerimenti</label>
              <textarea v-model="portalMotoForm.avvisi" placeholder="Es: Controllare pressione gomme ogni mese"></textarea>
            </div>
            <div class="form-group full-width">
              <label>URL Foto (opzionale)</label>
              <input v-model="portalMotoForm.photoUrl" placeholder="https://..." />
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="showPortalMotoModal = false" class="btn-cancel">Annulla</button>
            <button type="submit" class="btn-primary-custom">Salva Veicolo</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Portal: Maintenance History Modal -->
    <div v-if="showMaintenanceModal" class="modal-overlay">
      <div class="modal large max-h-[90vh] flex flex-col">
        <h3>Storico Interventi</h3>
        <p>Targa: <code>{{ selectedUserForAction?.targa }}</code></p>

        <div class="existing-history mt-4 overflow-y-auto flex-grow bg-black/30 rounded-xl p-4">
          <div v-for="rec in maintenanceHistory" :key="rec._id" class="maintenance-record-item mb-4 pb-4 border-b border-white/5">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-xs text-muted block">{{ rec.data }} - {{ rec.km }} km</span>
                <strong class="text-sm block">{{ rec.descrizione }}</strong>
                <p v-if="rec.partiSostituite" class="text-xs text-muted mt-1 italic">Parti: {{ rec.partiSostituite }}</p>
                <p v-if="rec.costo" class="text-xs text-primary mt-1">€ {{ rec.costo }}</p>
              </div>
              <button @click="deleteMaintenance(rec._id)" class="btn-delete-icon">×</button>
            </div>
          </div>
          <div v-if="maintenanceHistory.length === 0" class="empty-docs">Nessun intervento registrato.</div>
        </div>

        <div class="add-maintenance-form mt-6 pt-6 border-t border-white/10">
          <h4>Aggiungi Intervento</h4>
          <div class="grid grid-cols-2 gap-3 mt-3">
            <input type="date" v-model="maintenanceForm.data" class="mini-input" />
            <input type="number" v-model="maintenanceForm.km" placeholder="Km intervento" class="mini-input" />
            <input v-model="maintenanceForm.descrizione" placeholder="Descrizione (es: Tagliando)" class="mini-input col-span-2" />
            <input v-model="maintenanceForm.partiSostituite" placeholder="Parti sostituite" class="mini-input col-span-2" />
            <input type="number" v-model="maintenanceForm.costo" placeholder="Costo (€)" class="mini-input" />
            <button @click="addMaintenanceRecord" class="btn-primary-custom">Aggiungi</button>
          </div>
        </div>

        <div class="modal-actions mt-4">
          <button @click="showMaintenanceModal = false" class="btn-cancel full">Chiudi</button>
        </div>
      </div>
    </div>

    <!-- Portal: Manage Docs Modal removed -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import MotoCarousel from '~/components/moto/MotoCarousel.vue'
import ThemeSwitcher from '~/components/admin/ThemeSwitcher.vue'
import { useSiteSettings } from '~/stores/useSiteSettings'

definePageMeta({
  layout: 'admin-layout'
})

// --- Theme State ---
const settings = useSiteSettings()

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
const isSidebarOpen = ref(false) // Toggle per mobile
const motos = ref([])
const leads = ref([])
const tradeIns = ref([])
const blogPosts = ref([])
const portalUsers = ref([])

const fetchTradeIns = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/admin/trade-ins')
    if (res.success) {
      tradeIns.value = res.tradeIns
    }
  } catch (err) {
    console.error('Errore fetch permute:', err)
  } finally {
    loading.value = false
  }
}
const portalVehicles = ref([]) // Nuovo: per tracciare i dati dei veicoli dei clienti

const newUser = ref({
  nome: '',
  cognome: '',
  targa: '',
  password: ''
})
const blogForm = ref({
  title: '',
  slug: '',
  category: 'Novità Moto',
  imageCover: '',
  content: '',
  excerpt: '',
  relatedMotos: []
})
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
  categoria: 'Naked',
  nuovaUsata: 'nuova',
  venduta: false,
  isVisible: true,
  immagini: []
})

const helmetForm = ref({
  nome: '',
  marca: '',
  modello: '',
  descrizioneBreve: '',
  descrizioneCompleta: '',
  prezzoOriginale: 0,
  prezzoScontato: 0,
  scontoPercentuale: 0,
  promozioneAttiva: false,
  testoPromozionale: '',
  colore: '',
  variantiColore: '',
  taglie: '',
  categoria: 'Integrale',
  disponibilita: 'disponibile',
  isVisible: true,
  badge: 'novita',
  immagini: []
})

const initialForm = { ...motoForm.value }
const initialHelmetForm = { ...helmetForm.value }
const unifiedImages = ref([]) // Lista unificata di immagini per riordinamento [{type: 'url'|'file', value: string|File, preview: string}]
const unifiedHelmetImages = ref([]) 
const editingId = ref(null)
const editingHelmetId = ref(null)

const helmets = ref([])
const fetchHelmets = async () => {
  try {
    const res = await $fetch('/api/helmets')
    helmets.value = res.helmets || []
  } catch (e) {
    console.error('Errore recupero caschi:', e)
  }
}

const openAddHelmetForm = () => {
  helmetForm.value = { ...initialHelmetForm }
  unifiedHelmetImages.value = []
  editingHelmetId.value = null
  currentTab.value = 'addHelmet'
}

const editHelmet = (h) => {
  helmetForm.value = { ...h }
  unifiedHelmetImages.value = (h.immagini || []).map(url => ({
    type: 'url',
    value: url,
    preview: url
  }))
  editingHelmetId.value = h._id
  currentTab.value = 'editHelmet'
}

const handleHelmetImageUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      unifiedHelmetImages.value.push({
        type: 'file',
        value: file,
        preview: e.target.result
      })
    }
    reader.readAsDataURL(file)
  })
}

const removeHelmetImage = (index) => {
  unifiedHelmetImages.value.splice(index, 1)
}

const moveHelmetImage = (index, direction) => {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= unifiedHelmetImages.value.length) return
  const temp = unifiedHelmetImages.value[index]
  unifiedHelmetImages.value[index] = unifiedHelmetImages.value[newIndex]
  unifiedHelmetImages.value[newIndex] = temp
}

const handleHelmetSubmit = async () => {
  submitting.value = true
  formMessage.value = ''
  try {
    const existingUrls = unifiedHelmetImages.value.filter(img => img.type === 'url').map(img => img.value)
    const newFiles = unifiedHelmetImages.value.filter(img => img.type === 'file').map(img => img.value)
    const imagesBase64 = []
    for (const file of newFiles) {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
      imagesBase64.push(base64)
    }

    const method = editingHelmetId.value ? 'PUT' : 'POST'
    const url = editingHelmetId.value ? `/api/helmets/${editingHelmetId.value}` : '/api/helmets'
    
    const body = {
      ...helmetForm.value,
      imagesBase64,
      immagini: existingUrls,
      imageOrder: unifiedHelmetImages.value.map(img => img.type === 'url' ? img.value : 'NEW_IMAGE')
    }

    await $fetch(url, { method, body })
    isSuccess.value = true
    formMessage.value = 'Casco salvato con successo!'
    setTimeout(() => {
      fetchHelmets()
      currentTab.value = 'helmets'
    }, 1500)
  } catch (e) {
    isSuccess.value = false
    formMessage.value = 'Errore durante il salvataggio del casco.'
  } finally {
    submitting.value = false
  }
}

const deleteHelmet = async (id) => {
  if (!confirm('Sei sicuro di voler eliminare questo casco?')) return
  try {
    await $fetch(`/api/helmets/${id}`, { method: 'DELETE' })
    fetchHelmets()
  } catch (e) {
    alert('Errore durante l\'eliminazione')
  }
}

// --- Portal Management Actions ---
const selectedUserForAction = ref(null)
const showPortalMotoModal = ref(false)
const showPortalDocsModal = ref(false)
const portalDocs = ref([])
const portalDocForm = ref({
  title: '',
  type: 'Libretto',
  fileBase64: ''
})
const portalMotoForm = ref({
  marca: '',
  modello: '',
  targa: '',
  dataAcquisto: '',
  kmIniziali: 0,
  kmAttuali: 0,
  prossimaManutenzione: '',
  scadenzaRevisione: '',
  scadenzaAssicurazione: '',
  scadenzaBollo: '',
  avvisi: '',
  photoUrl: ''
})
const maintenanceHistory = ref([])
const maintenanceForm = ref({
  data: '',
  km: 0,
  descrizione: '',
  partiSostituite: '',
  costo: 0
})
const showMaintenanceModal = ref(false)

const openManageMoto = async (user) => {
  selectedUserForAction.value = user
  portalMotoForm.value = { 
    marca: '', 
    modello: '', 
    targa: user.targa, 
    dataAcquisto: '',
    kmIniziali: 0,
    kmAttuali: 0,
    prossimaManutenzione: '',
    scadenzaRevisione: '',
    scadenzaAssicurazione: '',
    scadenzaBollo: '',
    avvisi: '',
    photoUrl: '' 
  }
  
  try {
    const res = await $fetch(`/api/portal/data?targa=${user.targa}`)
    if (res.vehicle) {
      portalMotoForm.value = { ...res.vehicle }
    }
  } catch (e) {
    console.error('Errore recupero veicolo:', e)
  }
  
  showPortalMotoModal.value = true
}

const openMaintenance = async (user) => {
  selectedUserForAction.value = user
  maintenanceHistory.value = []
  try {
    const res = await $fetch(`/api/portal/data?targa=${user.targa}`)
    maintenanceHistory.value = res.maintenance || []
  } catch (e) {
    console.error('Errore recupero storico:', e)
  }
  showMaintenanceModal.value = true
}

const addMaintenanceRecord = async () => {
  try {
    await $fetch('/api/admin/add-maintenance', {
      method: 'POST',
      body: {
        targa: selectedUserForAction.value.targa,
        ...maintenanceForm.value
      }
    })
    alert('Intervento aggiunto!')
    maintenanceForm.value = { data: '', km: 0, descrizione: '', partiSostituite: '', costo: 0 }
    openMaintenance(selectedUserForAction.value) // Refresh
  } catch (e) {
    alert('Errore salvataggio intervento.')
  }
}

const deleteMaintenance = async (id) => {
  if (!confirm('Eliminare questo intervento dallo storico?')) return
  try {
    await $fetch(`/api/admin/delete-maintenance?id=${id}`, { method: 'DELETE' })
    openMaintenance(selectedUserForAction.value)
  } catch (e) {
    alert('Errore eliminazione.')
  }
}

const openManageDocs = async (user) => {
  selectedUserForAction.value = user
  portalDocs.value = []
  try {
    const res = await $fetch(`/api/portal/data?targa=${user.targa}`)
    portalDocs.value = res.documents || []
  } catch (e) {
    console.error('Errore recupero documenti:', e)
  }
  showPortalDocsModal.value = true
}

const savePortalVehicle = async () => {
  try {
    await $fetch('/api/admin/update-portal-vehicle', {
      method: 'POST',
      body: portalMotoForm.value
    })
    alert('Veicolo aggiornato con successo!')
    showPortalMotoModal.value = false
  } catch (e) {
    console.error('ERRORE SALVATAGGIO VEICOLO:', e)
    const errorMsg = e.data?.message || e.message || 'Errore sconosciuto'
    alert(`Errore durante il salvataggio del veicolo: ${errorMsg}`)
  }
}

const handlePortalDocUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      await $fetch('/api/admin/upload-portal-document', {
        method: 'POST',
        body: {
          targa: selectedUserForAction.value.targa,
          title: portalDocForm.value.title || file.name,
          type: portalDocForm.value.type,
          fileBase64: e.target.result
        }
      })
      alert('Documento caricato!')
      openManageDocs(selectedUserForAction.value) // Refresh
    } catch (err) {
      alert('Errore caricamento documento.')
    }
  }
  reader.readAsDataURL(file)
}

const deletePortalDoc = async (docId) => {
  if (!confirm('Eliminare questo documento?')) return
  try {
    await $fetch(`/api/admin/delete-portal-document?id=${docId}`, { method: 'DELETE' })
    openManageDocs(selectedUserForAction.value) // Refresh
  } catch (e) {
    alert('Errore eliminazione.')
  }
}

const deletePortalUser = async (id) => {
  if (!confirm('Sei sicuro di voler eliminare questo cliente dal portale?')) return
  try {
    await $fetch(`/api/admin/delete-portal-user?id=${id}`, { method: 'DELETE' })
    alert('Cliente rimosso dal portale.')
    fetchPortalUsers() // Refresh list
  } catch (e) {
    alert('Errore durante l\'eliminazione del cliente.')
  }
}

// --- Methods ---
const fetchMotos = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/motos')
    motos.value = res.motos
    // Fetch leads and trade-ins count also
    fetchLeads()
    fetchTradeIns()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const fetchLeads = async () => {
  try {
    const res = await $fetch('/api/leads')
    leads.value = res.leads || []
  } catch (e) {
    console.error('Errore caricamento leads:', e)
  }
}

const deleteLead = async (id) => {
  if (!confirm('Sei sicuro di voler eliminare questo preventivo?')) return
  try {
    await $fetch(`/api/admin/delete-lead?id=${id}`, { method: 'DELETE' })
    fetchLeads()
  } catch (e) {
    alert('Errore durante l\'eliminazione del preventivo.')
  }
}

const deleteTradeIn = async (id) => {
  if (!confirm('Sei sicuro di voler eliminare questa richiesta di permuta?')) return
  try {
    await $fetch(`/api/admin/delete-trade-in?id=${id}`, { method: 'DELETE' })
    fetchTradeIns()
  } catch (e) {
    alert('Errore durante l\'eliminazione della permuta.')
  }
}

const fetchPortalUsers = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/admin/portal-data')
    portalUsers.value = res.users || []
    
    // Recupera anche tutti i veicoli per calcolare le scadenze
    const vehiclesRes = await $fetch('/api/admin/all-portal-vehicles')
    portalVehicles.value = vehiclesRes.vehicles || []
  } catch (e) {
    console.error('Errore caricamento utenti portale:', e)
  } finally {
    loading.value = false
  }
}

const upcomingDeadlines = computed(() => {
  const list = []
  const today = new Date()
  const thirtyDaysLater = new Date()
  thirtyDaysLater.setDate(today.getDate() + 30)

  portalVehicles.value.forEach(v => {
    const user = portalUsers.value.find(u => u.targa.toUpperCase() === v.targa.toUpperCase())
    if (!user) return

    const deadlineInfo = {
      targa: v.targa,
      marca: v.marca,
      modello: v.modello,
      nome: user.nome,
      cognome: user.cognome,
      scadenzaRevisione: v.scadenzaRevisione,
      scadenzaAssicurazione: v.scadenzaAssicurazione,
      scadenzaBollo: v.scadenzaBollo,
      isExpired: false,
      revisioneStatus: null,
      assicurazioneStatus: null,
      bolloStatus: null
    }

    let hasUpcoming = false

    const checkDate = (dateStr, label) => {
      if (!dateStr) return null
      const d = new Date(dateStr)
      const diffTime = d.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays <= 30) {
        hasUpcoming = true
        if (diffDays < 0) deadlineInfo.isExpired = true
        return {
          type: diffDays < 0 ? 'expired' : (diffDays <= 5 ? 'urgent' : 'warning'),
          message: diffDays < 0 ? `Scaduto da ${Math.abs(diffDays)} giorni` : (diffDays === 0 ? 'Scade oggi!' : `Scade tra ${diffDays} giorni`)
        }
      }
      return null
    }

    deadlineInfo.revisioneStatus = checkDate(v.scadenzaRevisione, 'Revisione')
    deadlineInfo.assicurazioneStatus = checkDate(v.scadenzaAssicurazione, 'Assicurazione')
    deadlineInfo.bolloStatus = checkDate(v.scadenzaBollo, 'Bollo')

    if (hasUpcoming) {
      list.push(deadlineInfo)
    }
  })

  return list.sort((a, b) => (a.isExpired === b.isExpired ? 0 : a.isExpired ? -1 : 1))
})

const hasUrgentDeadlines = computed(() => {
  return upcomingDeadlines.value.some(d => 
    d.isExpired || 
    (d.revisioneStatus?.type === 'urgent') || 
    (d.assicurazioneStatus?.type === 'urgent') || 
    (d.bolloStatus?.type === 'urgent')
  )
})

const generateWhatsAppLink = (d) => {
  const phone = '393391581997' // In realtà andrebbe preso dal profilo utente se disponibile, o lasciato vuoto per scelta manuale
  let message = `Ciao ${d.nome}, sono Road Runner Moto. Ti avvisiamo che per il tuo veicolo con targa ${d.targa} si avvicinano le seguenti scadenze:\n`
  
  if (d.revisioneStatus) message += `- Revisione: ${formatDate(d.scadenzaRevisione)}\n`
  if (d.assicurazioneStatus) message += `- Assicurazione: ${formatDate(d.scadenzaAssicurazione)}\n`
  if (d.bolloStatus) message += `- Bollo: ${formatDate(d.scadenzaBollo)}\n`
  
  message += `\nContattaci per un appuntamento o per maggiori informazioni!`
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N.D.'
  return new Date(dateStr).toLocaleDateString('it-IT')
}

const handleCreatePortalUser = async () => {
  try {
    await $fetch('/api/admin/create-portal-user', {
      method: 'POST',
      body: newUser.value
    })
    alert('Cliente registrato con successo!')
    newUser.value = { nome: '', cognome: '', targa: '', password: '' }
    fetchPortalUsers()
  } catch (e) {
    alert('Errore durante la registrazione.')
  }
}

// --- Blog Methods ---
const fetchBlogPosts = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/blog')
    blogPosts.value = res.posts || []
  } catch (e) {
    console.error('Errore caricamento blog:', e)
  } finally {
    loading.value = false
  }
}

const handleBlogSubmit = async () => {
  submitting.value = true
  try {
    const url = editingBlogId.value 
      ? `/api/blog/${editingBlogId.value}` 
      : '/api/blog'
    const method = editingBlogId.value ? 'PUT' : 'POST'
    
    await $fetch(url, {
      method,
      body: blogForm.value
    })
    
    alert(editingBlogId.value ? 'Articolo aggiornato!' : 'Articolo creato!')
    resetBlogForm()
    fetchBlogPosts()
    currentTab.value = 'blog'
  } catch (e) {
    alert('Errore durante il salvataggio dell\'articolo.')
  } finally {
    submitting.value = false
  }
}

const editBlog = (post) => {
  blogForm.value = { ...post }
  editingBlogId.value = post._id
  currentTab.value = 'add-blog'
}

const deleteBlog = async (id) => {
  if (!confirm('Sei sicuro di voler eliminare questo articolo?')) return
  try {
    await $fetch(`/api/blog/${id}`, { method: 'DELETE' })
    fetchBlogPosts()
  } catch (e) {
    alert('Errore durante l\'eliminazione.')
  }
}

const resetBlogForm = () => {
  blogForm.value = {
    title: '',
    slug: '',
    category: 'Novità Moto',
    imageCover: '',
    content: '',
    excerpt: '',
    relatedMotos: []
  }
  editingBlogId.value = null
}

const editingBlogId = ref(null)

  const openAddForm = () => {
  motoForm.value = { ...initialForm }
  unifiedImages.value = []
  editingId.value = null
  currentTab.value = 'add'
}

const editMoto = (m) => {
  motoForm.value = { 
    ...m,
    isVisible: m.isVisible !== undefined ? m.isVisible : true
  }
  // Popola unifiedImages con le URL esistenti
  unifiedImages.value = (m.immagini || []).map(url => ({
    type: 'url',
    value: url,
    preview: url
  }))
  editingId.value = m._id
  currentTab.value = 'edit'
}

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      unifiedImages.value.push({
        type: 'file',
        value: file,
        preview: e.target.result
      })
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  unifiedImages.value.splice(index, 1)
}

const moveImage = (index, direction) => {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= unifiedImages.value.length) return
  
  const temp = unifiedImages.value[index]
  unifiedImages.value[index] = unifiedImages.value[newIndex]
  unifiedImages.value[newIndex] = temp
}

const handleSubmit = async () => {
  submitting.value = true
  formMessage.value = ''
  
  try {
    // 1. Dividiamo le immagini unificate in esistenti e nuove
    const existingUrls = unifiedImages.value
      .filter(img => img.type === 'url')
      .map(img => img.value)
      
    const newFiles = unifiedImages.value
      .filter(img => img.type === 'file')
      .map(img => img.value)

    // 2. Convertiamo i nuovi file selezionati in Base64
    const imagesBase64 = []
    for (const file of newFiles) {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
      imagesBase64.push(base64)
    }

    const method = editingId.value ? 'PUT' : 'POST'
    const url = editingId.value ? `/api/motos/${editingId.value}` : '/api/motos'
    
    // 3. Prepariamo il body
    // Nota: il backend dovrà gestire l'ordine finale.
    // Attualmente il backend concatena esistenti + nuove.
    // Per preservare l'ordine scelto dall'utente, dobbiamo dire al backend l'ordine finale.
    
    const body = {
      ...motoForm.value,
      imagesBase64,
      immagini: existingUrls, // URL esistenti rimasti
      imageOrder: unifiedImages.value.map(img => img.type === 'url' ? img.value : 'NEW_IMAGE')
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
  settings.fetchSettings()
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
  background: white;
  padding: 5px;
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

.admin-mobile-header {
  height: 60px;
  background: #111;
  border-bottom: 1px solid #222;
  z-index: 1001;
  padding: 0 20px;
  display: none;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.sidebar-logo-mini {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.header-title {
  font-weight: 800;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hamburger-admin {
  width: 30px;
  height: 20px;
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger-admin span {
  display: block;
  width: 100%;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s;
}

.hamburger-admin.active span:nth-child(1) { transform: translateY(9px) rotate(45deg); }
.hamburger-admin.active span:nth-child(2) { opacity: 0; }
.hamburger-admin.active span:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: none;
}

.admin-sidebar {
  width: 280px;
  background: #111;
  border-right: 1px solid #222;
  display: flex;
  flex-direction: column;
  padding: 20px;
  transition: transform 0.3s ease;
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
  margin: 0 0 10px;
  font-size: 1.2rem;
}

.moto-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--muted);
}

.tag.category {
  border-color: var(--primary);
  color: var(--primary-2);
}

.tag.status.nuova {
  border-color: #28a745;
  color: #28a745;
}

.tag.status.usata {
  border-color: #ffc107;
  color: #ffc107;
}

.tag.status.promozione {
  border-color: #e11d48;
  color: #e11d48;
  background: rgba(225, 29, 72, 0.1);
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

.btn-logout:hover {
  background: rgba(215, 24, 42, 0.1);
  color: var(--primary-2);
}

.badge-count {
  background: var(--primary);
  color: #fff;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: auto;
}

/* Leads List Styles */
.leads-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.lead-card {
  background: var(--panel-2);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 24px;
}

.lead-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--line);
}

.lead-date {
  font-size: 0.85rem;
  color: var(--muted);
}

.lead-status {
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 4px;
}

.lead-status.nuovo {
  background: rgba(255, 193, 7, 0.15);
  color: #ffc107;
}

.lead-body {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

@media (max-width: 768px) {
  .lead-body {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.lead-info h4 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

/* Trade-In Specific Styles */
.trade-in-card {
  border-left: 4px solid var(--primary-2) !important;
}

.lead-details-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin-top: 16px;
}

.detail-item {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.detail-item strong {
  color: #fff;
}

.warning-msg {
  border-left: 4px solid #facc15 !important;
  background: rgba(250, 204, 21, 0.05) !important;
}

.lead-images {
  margin-top: 20px;
}

.images-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 10px;
}

.images-preview-grid img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s;
}

.images-preview-grid img:hover {
  transform: scale(1.05);
}

.lead-info p, .lead-moto p, .lead-payment p {
  font-size: 0.9rem;
  color: var(--muted);
  margin-bottom: 5px;
}

.lead-message {
  margin-top: 20px;
  padding: 15px;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
}

.lead-message p {
  font-size: 0.9rem;
  color: var(--text);
  font-style: italic;
  margin-top: 5px;
}

/* Portal Admin Styles */
.portal-admin-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
}

@media (max-width: 1024px) {
  .portal-admin-grid {
    grid-template-columns: 1fr;
  }
}

.user-card-admin {
  background: var(--panel-2);
  border: 1px solid var(--line);
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.user-main-info strong {
  display: block;
  font-size: 1.1rem;
}

.user-main-info code {
  color: var(--primary-2);
  font-weight: 800;
}

.btn-edit-small {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--line);
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.3s ease;
}

.btn-edit-small:hover {
  background: var(--primary-2);
  border-color: var(--primary-2);
}

.btn-delete-red {
  color: var(--primary-2);
  border-color: rgba(215, 24, 42, 0.3);
}

.btn-delete-red:hover {
  background: rgba(215, 24, 42, 0.1);
}

.portal-add-user {
  background: var(--panel-2);
  padding: 30px;
  border-radius: 20px;
  border: 1px solid var(--line);
  height: fit-content;
}

.portal-add-user h3 {
  margin-bottom: 20px;
  font-size: 1.25rem;
}

.mini-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mini-form input {
  background: #0a0a0a;
  border: 1px solid #333;
  padding: 12px;
  border-radius: 10px;
  color: #ffffff;
  font-size: 1rem;
  width: 100%;
}

.mini-form input::placeholder {
  color: #666;
}

.mini-form input:focus {
  border-color: var(--primary-2);
  outline: none;
}

/* Blog Admin Styles */
.blog-admin-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.blog-item-admin {
  background: var(--panel-2);
  border: 1px solid var(--line);
  padding: 15px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.blog-thumb {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.blog-info {
  flex: 1;
}

.blog-info h3 {
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.blog-meta {
  font-size: 0.8rem;
  color: var(--muted);
}

.content-editor {
  min-height: 400px;
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.6;
}

.related-motos-selector {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
  background: var(--bg);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid var(--line);
}

.moto-check {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
}

.moto-check input {
  width: auto;
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

.checkbox-group {
  flex-direction: row;
  align-items: center;
  display: flex;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 600;
  color: #fff;
  margin-top: 10px;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--primary);
}

.image-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.image-preview-item {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: space-around;
  padding: 6px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-preview-item:hover .image-controls {
  opacity: 1;
}

.move-btn, .remove-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.move-btn:hover:not(:disabled) {
  background: var(--primary);
}

.move-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.remove-btn:hover {
  background: #ff4444;
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
  width: 90%;
  text-align: center;
  border: 1px solid #333;
}

.modal.large {
  max-width: 550px;
  text-align: left;
}

.modal.large h3 {
  margin-bottom: 10px;
}

.existing-docs {
  max-height: 200px;
  overflow-y: auto;
  background: #0a0a0a;
  border-radius: 10px;
  padding: 10px;
}

.doc-item-admin {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #222;
  font-size: 0.9rem;
}

.doc-item-admin:last-child {
  border-bottom: none;
}

.btn-delete-icon {
  background: rgba(215, 24, 42, 0.1);
  color: var(--primary);
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: grid;
  place-items: center;
  font-weight: bold;
}

.upload-zone {
  background: #111;
  padding: 20px;
  border-radius: 12px;
  border: 2px dashed #333;
}

.upload-zone input[type="text"],
.upload-zone select {
  background: #0a0a0a;
  border: 1px solid #333;
  color: white;
  padding: 8px;
  border-radius: 6px;
  width: 100%;
}

.mini-input {
  background: #0a0a0a;
  border: 1px solid #333;
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 100%;
}

.mini-input:focus {
  border-color: var(--primary-2);
  outline: none;
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
  .admin-dashboard { flex-direction: column; height: auto; min-height: 100vh; }
  .admin-mobile-header { display: block; }
  .sidebar-overlay { display: block; }
  .admin-sidebar { 
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(-100%);
    width: 80%;
    max-width: 300px;
    box-shadow: 20px 0 50px rgba(0,0,0,0.5);
  }
  .admin-sidebar.sidebar-open {
    transform: translateX(0);
  }
  .sidebar-header { display: none; }
  .admin-content { 
    padding: 20px 15px 40px; 
    overflow-y: visible;
  }
  .form-grid { grid-template-columns: 1fr; }
  .full-width { grid-column: span 1; }
  
  .section-header {
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
  .section-header h2 { font-size: 1.4rem; }
  .section-header p { display: none; } /* Nascondi descrizione su mobile per spazio */
}
/* Deadlines Alert Styles */
.deadlines-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.deadline-card {
  background: var(--panel-2);
  border: 1px solid var(--line);
  padding: 24px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  transition: all 0.3s ease;
}

.deadline-card.expired {
  border-color: rgba(225, 29, 72, 0.3);
  background: linear-gradient(90deg, rgba(225, 29, 72, 0.05), transparent);
}

.deadline-info {
  flex: 1;
}

.vehicle-details strong {
  display: block;
  font-size: 1.25rem;
  margin-bottom: 4px;
}

.vehicle-details code {
  color: var(--primary-2);
  font-weight: 800;
  font-size: 1rem;
}

.owner-details {
  margin-top: 8px;
  color: var(--muted);
  font-size: 0.9rem;
}

.deadlines-items {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.deadline-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(255,255,255,0.03);
  font-size: 0.9rem;
}

.deadline-item .label {
  font-weight: 700;
  min-width: 100px;
}

.deadline-item.urgent { 
  border-left: 4px solid #ffc107; 
  color: #ffc107; 
  animation: blink-urgent 1.5s infinite;
}
.deadline-item.warning { border-left: 4px solid #94a3b8; }
.deadline-item.expired { 
  border-left: 4px solid var(--primary); 
  color: var(--primary-2); 
  animation: blink-expired 1s infinite;
}

.badge-count.blink-badge {
  animation: blink-urgent 1s infinite;
  background: var(--primary);
  box-shadow: 0 0 10px var(--primary);
}

@keyframes blink-urgent {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

@keyframes blink-expired {
  0% { background: rgba(225, 29, 72, 0.1); opacity: 1; }
  50% { background: rgba(225, 29, 72, 0.3); opacity: 0.7; }
  100% { background: rgba(225, 29, 72, 0.1); opacity: 1; }
}

.deadline-item .days {
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.btn-whatsapp-small {
  background: #25D366;
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 800;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-whatsapp-small:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
  filter: brightness(1.1);
}

@media (max-width: 1024px) {
  .deadline-card {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* ... existing styles ... */
.lead-actions-side {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.btn-delete-small {
  background: rgba(225, 29, 72, 0.1);
  color: #e11d48;
  border: 1px solid rgba(225, 29, 72, 0.2);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-delete-small:hover {
  background: #e11d48;
  color: white;
}

.btn-back {
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  height: fit-content;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(-3px);
}

.tag.sold {
  background: #ff0000;
  color: white;
  font-weight: bold;
}

.tag.visibility {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tag.visibility.visible {
  color: #22c55e;
}

.tag.visibility.hidden {
  color: #94a3b8;
}
</style>
