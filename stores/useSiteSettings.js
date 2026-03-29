import { defineStore } from 'pinia'

export const useSiteSettings = defineStore('siteSettings', {
  state: () => ({
    themeColor: 'rosso', // 'rosso' o 'arancione'
    primary: '#dc2626',
    primary2: '#b91c1c',
    backgroundColor: '#030303',
    textColor: '#fdfdfd'
  }),
  
  actions: {
    setTheme(color, customBg = null, customText = null) {
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
      
      if (customBg) this.backgroundColor = customBg
      if (customText) this.textColor = customText
      
      // Applica globalmente modificando le variabili root
      if (process.client) {
        const root = document.documentElement
        root.style.setProperty('--primary', this.primary)
        root.style.setProperty('--primary-2', this.primary2)
        root.style.setProperty('--accent', this.primary)
        
        if (this.backgroundColor) {
          root.style.setProperty('--bg', this.backgroundColor)
          // Aggiorna anche i pannelli per coerenza
          root.style.setProperty('--panel', this.adjustBrightness(this.backgroundColor, 5))
          root.style.setProperty('--panel-2', this.adjustBrightness(this.backgroundColor, 10))
        }
        if (this.textColor) {
          root.style.setProperty('--text', this.textColor)
        }
      }
    },

    // Helper per regolare la luminosità dei pannelli rispetto allo sfondo
    adjustBrightness(hex, percent) {
      const num = parseInt(hex.replace('#',''), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
      return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
    },
    
    async fetchSettings() {
      try {
        const data = await $fetch('/api/site-settings')
        if (data) {
          this.setTheme(
            data.themeColor || 'rosso', 
            data.backgroundColor || null, 
            data.textColor || null
          )
        }
      } catch (e) {
        console.error('Errore fetch settings:', e)
      }
    },
    
    async saveTheme(color, backgroundColor, textColor) {
      try {
        await $fetch('/api/admin/site-settings', {
          method: 'PATCH',
          body: { 
            themeColor: color,
            backgroundColor,
            textColor
          }
        })
        this.setTheme(color, backgroundColor, textColor)
      } catch (e) {
        console.error('Errore salvataggio tema:', e)
        throw e
      }
    }
  }
})
