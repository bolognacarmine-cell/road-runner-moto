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
      if (color === 'arancione') {
        this.primary = '#ea580c'
        this.primary2 = '#f97316'
      } else {
        this.primary = '#dc2626'
        this.primary2 = '#ef4444'
      }
      
      // Applica globalmente modificando le variabili root
      if (process.client) {
        const root = document.documentElement
        root.style.setProperty('--primary', this.primary)
        root.style.setProperty('--primary-2', this.primary2)
        root.style.setProperty('--accent', this.primary) // Spesso usato come sinonimo
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
