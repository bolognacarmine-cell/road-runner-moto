import helmet from 'helmet'

export default defineEventHandler((event) => {
  // Configurazione Helmet per Nuxt/Nitro
  // Poiché Nitro usa H3, applichiamo helmet tramite l'oggetto response nativo se necessario,
  // ma Nitro supporta anche l'integrazione di middleware standard Connect-style.
  
  const res = event.node.res
  const req = event.node.req

  // Applichiamo Helmet
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "*.google-analytics.com", "*.googletagmanager.com", "https://cdn.silktide.com"],
        "img-src": ["'self'", "data:", "https:", "*.google-analytics.com"],
        "connect-src": ["'self'", "https://*.google-analytics.com", "https://*.analytics.google.com", "https://*.googletagmanager.com"],
      },
    },
    crossOriginEmbedderPolicy: false, // Spesso causa problemi con caricamento immagini esterne se non configurato
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  })(req, res, () => {})
})
