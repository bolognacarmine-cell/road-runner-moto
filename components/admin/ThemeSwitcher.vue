<script setup>
import { useSiteSettings } from '~/stores/useSiteSettings'

const settings = useSiteSettings()
const loading = ref(false)
const success = ref(false)

const themes = [
  { id: 'rosso', label: 'Rosso Corsa', primary: '#dc2626', secondary: '#ef4444' },
  { id: 'arancione', label: 'Arancione KTM', primary: '#ea580c', secondary: '#f97316' },
  { id: 'verde', label: 'Verde Ninja', primary: '#16a34a', secondary: '#22c55e' },
  { id: 'blu', label: 'Blu Yamaha', primary: '#2563eb', secondary: '#3b82f6' },
  { id: 'giallo', label: 'Giallo Modena', primary: '#d97706', secondary: '#f59e0b' },
  { id: 'viola', label: 'Viola Biker', primary: '#7c3aed', secondary: '#8b5cf6' }
]

const selectTheme = (id) => {
  settings.setTheme(id)
}

const saveTheme = async () => {
  loading.value = true
  success.value = false
  try {
    await settings.saveTheme(
      settings.themeColor,
      settings.backgroundColor,
      settings.textColor
    )
    success.value = true
    setTimeout(() => { success.value = false }, 3000)
  } catch (e) {
    alert('Errore durante il salvataggio')
  } finally {
    loading.value = false
  }
}

// Reset alle impostazioni di fabbrica (Dark Mode di base)
const resetToDefault = () => {
  settings.backgroundColor = '#030303'
  settings.textColor = '#fdfdfd'
  settings.setTheme(settings.themeColor, '#030303', '#fdfdfd')
}
</script>

<template>
  <div class="theme-switcher-container">
    <div class="theme-switcher-card">
      <div class="card-header">
        <div class="icon">🎨</div>
        <h3>Colori Accento</h3>
      </div>
      
      <p class="desc">Scegli il colore principale che caratterizza i pulsanti e gli elementi attivi.</p>

      <div class="themes-grid">
        <div 
          v-for="t in themes" 
          :key="t.id"
          class="theme-option"
          :class="{ active: settings.themeColor === t.id }"
          @click="selectTheme(t.id)"
        >
          <div class="color-preview">
            <div class="dot p" :style="{ background: t.primary }"></div>
            <div class="dot s" :style="{ background: t.secondary }"></div>
          </div>
          <span class="label">{{ t.label }}</span>
          <div class="check" v-if="settings.themeColor === t.id">✓</div>
        </div>
      </div>
    </div>

    <div class="theme-switcher-card mt-6">
      <div class="card-header">
        <div class="icon">🖼️</div>
        <h3>Sfondo e Testi</h3>
      </div>
      
      <p class="desc">Personalizza i colori di base del sito (sfondo globale e colore del testo).</p>

      <div class="custom-colors-grid">
        <div class="color-picker-group">
          <label>Colore Sfondo</label>
          <div class="picker-wrapper">
            <input type="color" v-model="settings.backgroundColor" @input="settings.setTheme(settings.themeColor, settings.backgroundColor, settings.textColor)" />
            <input type="text" v-model="settings.backgroundColor" placeholder="#000000" />
          </div>
        </div>
        
        <div class="color-picker-group">
          <label>Colore Testo</label>
          <div class="picker-wrapper">
            <input type="color" v-model="settings.textColor" @input="settings.setTheme(settings.themeColor, settings.backgroundColor, settings.textColor)" />
            <input type="text" v-model="settings.textColor" placeholder="#FFFFFF" />
          </div>
        </div>
      </div>

      <button @click="resetToDefault" class="btn-reset">Ripristina Default</button>
    </div>

    <div class="actions mt-6">
      <button 
        @click="saveTheme" 
        class="btn-save" 
        :disabled="loading"
      >
        {{ loading ? 'Salvataggio...' : 'Salva Configurazione Globale' }}
      </button>
      <transition name="fade">
        <span v-if="success" class="success-msg">Design salvato e applicato!</span>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.theme-switcher-container {
  max-width: 600px;
}

.theme-switcher-card {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 32px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.icon { font-size: 1.5rem; }
h3 { margin: 0; font-size: 1.25rem; font-weight: 800; }

.desc {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 24px;
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.theme-option {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;
  transition: all 0.3s ease;
}

.theme-option:hover {
  background: #222;
  border-color: rgba(255, 255, 255, 0.1);
}

.theme-option.active {
  background: #222;
  border-color: var(--primary);
  box-shadow: 0 0 20px rgba(225, 29, 72, 0.1);
}

.color-preview {
  display: flex;
  gap: -8px;
}

.dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #1a1a1a;
}

.dot.s { margin-left: -10px; }

.label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #f8fafc;
}

.check {
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 900;
}

/* Custom Colors */
.custom-colors-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.color-picker-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-picker-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
}

.picker-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #1a1a1a;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

input[type="color"] {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: none;
  cursor: pointer;
}

input[type="text"] {
  background: none;
  border: none;
  color: #fff;
  font-family: monospace;
  font-size: 0.9rem;
  width: 100%;
}

.btn-reset {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-save {
  background: var(--primary);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 10px 20px rgba(225, 29, 72, 0.3);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-msg {
  color: #10b981;
  font-weight: 700;
  font-size: 0.9rem;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 600px) {
  .custom-colors-grid { grid-template-columns: 1fr; }
}
</style>
