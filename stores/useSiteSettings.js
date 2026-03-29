import { defineStore } from 'pinia'

export const useSiteSettings = defineStore('siteSettings', {
  state: () => ({
    themeColor: 'rosso', // 'rosso' o 'arancione'
    primary: '#dc2626',
    primary2: '#b91c1c'
  }),
  
  actions: {
    setTheme(color) {
      this.themeColor = color
      
      const palette = {
        rosso: { p: '#dc2626', s: '#ef4444' },
        arancione: { p: '#ea580c', s: '#f97316' },
        verde: { p: '#16a34a', s: '#22c55e' },
        blu: { p: '#2563eb', s: '#3b82f6' },
        giallo: { p: '#d97706', s: '#f59e0b' },
        viola: { p: '#7c3aed', s: '#8b5cf6' }
      }

      const selected = palette[color] || palette.rosso
      this.primary = selected.p
      this.primary2 = selected.s
      
      // Applica globalmente modificando le variabili root
      if (process.client) {
        const root = document.documentElement
        root.style.setProperty('--primary', this.primary)
        root.style.setProperty('--primary-2', this.primary2)
        root.style.setProperty('--accent', this.primary)
      }
    },
    
    async fetchSettings() {
      try {
        const data = await $fetch('/api/site-settings')
        if (data && data.themeColor) {
          this.setTheme(data.themeColor)
        }
      } catch (e) {
        console.error('Errore fetch settings:', e)
      }
    },
    
    async saveTheme(color) {
      try {
        await $fetch('/api/admin/site-settings', {
          method: 'PATCH',
          body: { themeColor: color }
        })
        this.setTheme(color)
      } catch (e) {
        console.error('Errore salvataggio tema:', e)
        throw e
      }
    }
  }
})
