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
    await settings.saveTheme(settings.themeColor)
    success.value = true
    setTimeout(() => { success.value = false }, 3000)
  } catch (e) {
    alert('Errore durante il salvataggio')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="theme-switcher-card">
    <div class="card-header">
      <div class="icon">🎨</div>
      <h3>Colori Template</h3>
    </div>
    
    <p class="desc">Personalizza il colore principale del sito web per tutti i visitatori.</p>

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

    <div class="actions">
      <button 
        @click="saveTheme" 
        class="btn-save" 
        :disabled="loading"
      >
        {{ loading ? 'Salvataggio...' : 'Salva e Applica' }}
      </button>
      <transition name="fade">
        <span v-if="success" class="success-msg">Impostazioni salvate con successo!</span>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.theme-switcher-card {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 32px;
  max-width: 500px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.icon { font-size: 1.5rem; }
h3 { margin: 0; font-size: 1.25rem; }

.desc {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 32px;
}

.themes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.theme-option {
  background: #1a1a1a;
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.theme-option:hover {
  background: #222;
  transform: translateY(-2px);
}

.theme-option.active {
  background: rgba(255, 255, 255, 0.03);
  border-color: var(--primary);
}

.color-preview {
  display: flex;
  gap: -8px;
}

.dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #111;
}

.dot.s { margin-left: -12px; }

.label {
  font-weight: 700;
  font-size: 0.9rem;
}

.check {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--primary);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-save {
  width: 100%;
  background: var(--primary);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover:not(:disabled) {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-msg {
  color: #10b981;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
