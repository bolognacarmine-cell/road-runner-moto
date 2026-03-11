export default defineNuxtConfig({
  // ✅ Compatibilità Nuxt
  compatibilityDate: '2026-03-09',

  // ✅ CSS globale
<<<<<<< HEAD
  css: ['~/assets/css/main.css'],
=======
  css: ['./assets/css/main.css'],
>>>>>>> cbcbbfbc44ce8e2455a9300bcbc47141fe3a8f6f

  // ✅ Configurazione runtime per API e URL pubblico
  runtimeConfig: {
    public: {
      siteUrl: 'https://road-runner-moto.it',
      apiBase: 'https://api.road-runner-moto.it'
    }
  },

<<<<<<< HEAD
  // ✅ Configurazione dell’app (head globale)
=======
  // ✅ Configurazione dell'app (head globale)
>>>>>>> cbcbbfbc44ce8e2455a9300bcbc47141fe3a8f6f
  app: {
    head: {
      titleTemplate: '%s | Road Runner Moto',
      htmlAttrs: { lang: 'it' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#111111' },
        { name: 'description', content: 'Road Runner è concessionaria moto e scooter a Capodrise. Vendita plurimarche, assistenza qualificata, ricambi originali e usato selezionato.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://road-runner-moto.it' },
        { property: 'og:title', content: 'Road Runner Moto | Concessionaria moto e scooter a Capodrise' },
        { property: 'og:description', content: 'Moto e scooter nuovi e usati plurimarche, assistenza qualificata e ricambi originali a Capodrise.' },
        { property: 'og:image', content: 'https://road-runner-moto.it/logo-road-runner.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Road Runner Moto | Moto e scooter a Capodrise' },
        { name: 'twitter:description', content: 'Concessionaria moto e scooter plurimarche con vendita, assistenza e ricambi originali.' },
        { name: 'twitter:image', content: 'https://road-runner-moto.it/logo-road-runner.jpg' }
      ],
      link: [
        { rel: 'canonical', href: 'https://road-runner-moto.it' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // ✅ Build performance e ottimizzazioni
  vite: {
    build: { sourcemap: false },
    optimizeDeps: { include: ['gsap'] }
  },

  // ✅ Moduli opzionali (immagini e sitemap)
  modules: [
    '@nuxt/image',
    '@nuxtjs/sitemap'
  ],

  // ✅ Sitemap per SEO
  sitemap: {
    hostname: 'https://road-runner-moto.it',
    gzip: true,
    routes: [
      '/',
      '/moto',
      '/contatti',
      '/servizi'
    ]
  },

  // ✅ Immagini ottimizzate
  image: {
    domains: ['api.road-runner-moto.it'],
    provider: 'static',
    format: ['webp', 'avif']
  }
<<<<<<< HEAD
})
=======
})
>>>>>>> cbcbbfbc44ce8e2455a9300bcbc47141fe3a8f6f
