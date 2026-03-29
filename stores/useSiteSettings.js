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
        this.primary2 = '#c2410c'
      } else {
        this.primary = '#dc2626'
        this.primary2 = '#b91c1c'
      }
      
      // Applica al volo per preview (opzionale se usiamo v-bind)
      if (process.client) {
        document.documentElement.style.setProperty('--primary', this.primary)
        document.documentElement.style.setProperty('--primary-2', this.primary2)
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
