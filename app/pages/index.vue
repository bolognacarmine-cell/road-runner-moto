<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://tuodominio.it'
const apiBase = config.public.apiBase || 'https://tuo-backend.onrender.com'

useHead({
  htmlAttrs: { lang: 'it' },
  title: 'Road Runner Moto | Moto e scooter nuovi e usati a Capodrise',
  meta: [
    {
      name: 'description',
      content:
        'Road Runner è concessionaria moto e scooter a Capodrise, in Via Retella 65. Vendita plurimarche, assistenza qualificata, ricambi originali e usato selezionato.'
    },
    { name: 'robots', content: 'index,follow' },
    { name: 'theme-color', content: '#111111' },
    { property: 'og:title', content: 'Road Runner Moto | Concessionaria moto e scooter a Capodrise' },
    {
      property: 'og:description',
      content:
        'Moto e scooter nuovi e usati plurimarche, assistenza qualificata e ricambi originali a Capodrise.'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteUrl },
    { property: 'og:image', content: `${siteUrl}/logo-road-runner.jpg` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Road Runner Moto | Moto e scooter a Capodrise' },
    {
      name: 'twitter:description',
      content:
        'Concessionaria moto e scooter plurimarche con vendita, assistenza e ricambi originali.'
    },
    { name: 'twitter:image', content: `${siteUrl}/logo-road-runner.jpg` }
  ],
  link: [
    { rel: 'canonical', href: siteUrl },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'MotorcycleDealer',
        name: 'Road Runner Moto',
        description:
          'Concessionaria moto e scooter con vendita, assistenza qualificata e ricambi originali',
        url: siteUrl,
        telephone: '+39 339 158 1997',
        email: 'inforoadrunner@libero.it',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Via Retella 65',
          addressLocality: 'Capodrise',
          addressRegion: 'CE',
          postalCode: '81020',
          addressCountry: 'IT'
        },
        openingHours: [
          'Mo 08:30-13:00 16:00-19:15',
          'Tu 08:30-13:00 16:00-19:15',
          'We 08:30-13:00 16:00-19:15',
          'Th 08:30-13:00 16:00-19:15',
          'Fr 08:30-13:00 16:00-19:15',
          'Sa 08:30-13:00'
        ],
        brand: ['Honda', 'Piaggio', 'Kymco']
      })
    }
  ]
})

const mobileMenuOpen = ref(false)

const filters = ref({
  condition: 'all',
  search: '',
  sort: 'price-asc'
})

const { data: motoData, pending, error } = await useFetch(`${apiBase}/veicoli`, {
  key: 'homepage-road-runner',
  transform: (items) => Array.isArray(items) ? items.filter(v => v.tipo === 'moto') : [],
  server: true
})

const motos = computed(() => motoData.value || [])

const filteredMotos = computed(() => {
  return motos.value.filter((moto) => {
    const query = filters.value.search.toLowerCase().trim()

    const condition =
      (moto.condizione || moto.stato || moto.tipologia || '').toString().toLowerCase()

    const matchCondition =
      filters.value.condition === 'all' ||
      (filters.value.condition === 'nuove' && condition.includes('nuov')) ||
      (filters.value.condition === 'usate' && condition.includes('usat'))

    const matchSearch =
      !query ||
      `${moto.marca || ''} ${moto.modello || ''}`.toLowerCase().includes(query)

    return matchCondition && matchSearch
  })
})

const featuredMotos = computed(() => {
  const items = [...filteredMotos.value]

  switch (filters.value.sort) {
    case 'price-desc':
      items.sort((a, b) => (b.prezzo || 0) - (a.prezzo || 0))
      break
    case 'year-desc':
      items.sort((a, b) => (b.annoImmatricolazione || b.anno || 0) - (a.annoImmatricolazione || a.anno || 0))
      break
    default:
      items.sort((a, b) => (a.prezzo || 0) - (b.prezzo || 0))
  }

  return items.slice(0, 6)
})

const formatPrice = (price) => {
  if (!price) return 'Prezzo su richiesta'
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const formatYear = (moto) => moto.annoImmatricolazione || moto.anno || 'N/D'

const formatImage = (moto) => {
  const raw = moto?.immagine || moto?.immagini?.[0]?.url || '/default-moto.jpg'
  return typeof raw === 'string' ? raw.replace('/upload/', '/upload/f_auto,q_auto/') : '/default-moto.jpg'
}

let ctx

onMounted(async () => {
  await nextTick()

  ctx = gsap.context(() => {
    gsap.from('.hero-badge', {
      y: 20,
      opacity: 0,
      duration: 0.7
    })

    gsap.from('.hero-title', {
      y: 40,
      opacity: 0,
      duration: 0.9,
      delay: 0.15
    })

    gsap.from('.hero-subtitle, .hero-actions', {
      y: 24,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      delay: 0.35
    })

    gsap.from('.benefit-card', {
      y: 28,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      delay: 0.2
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div class="page-shell">
    <header class="site-header">
      <div class="container nav-shell">
        <NuxtLink to="/" class="brand" aria-label="Road Runner Moto home">
          <img src="/logo-road-runner.jpg" alt="Road Runner Moto logo" class="brand-logo" />
          <div class="brand-copy">
            <span class="brand-name">ROAD RUNNER</span>
            <span class="brand-tagline">MOTO</span>
          </div>
        </NuxtLink>

        <nav class="main-nav">
          <a href="#moto">Veicoli</a>
          <a href="#servizi">Servizi</a>
          <a href="#marchi">Marchi</a>
          <a href="#contatti">Contatti</a>
          <NuxtLink to="/moto" class="btn-primary-custom">Catalogo</NuxtLink>
        </nav>

        <button
          class="mobile-toggle"
          type="button"
          :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
          aria-label="Apri menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div v-if="mobileMenuOpen" class="mobile-nav">
        <a href="#moto" @click="mobileMenuOpen = false">Veicoli</a>
        <a href="#servizi" @click="mobileMenuOpen = false">Servizi</a>
        <a href="#marchi" @click="mobileMenuOpen = false">Marchi</a>
        <a href="#contatti" @click="mobileMenuOpen = false">Contatti</a>
        <NuxtLink to="/moto" class="btn-primary-custom mobile-cta" @click="mobileMenuOpen = false">
          Catalogo
        </NuxtLink>
      </div>
    </header>

    <section class="hero">
      <div class="hero-overlay" />
      <div class="container hero-content">
        <span class="hero-badge">Concessionaria moto e scooter a Capodrise</span>

        <h1 class="hero-title">
          La tua concessionaria di riferimento
          <span>per moto e scooter</span>
        </h1>

        <p class="hero-subtitle">
          Road Runner è la tua concessionaria di riferimento per moto e scooter a Capodrise, in Via Retella 65.
          Vendita plurimarche, assistenza qualificata, ricambi originali e passione per le due ruote.
        </p>

        <div class="hero-actions">
          <a href="#moto" class="btn-primary-custom">Scopri i veicoli</a>
          <a href="tel:+393391581997" class="btn-secondary-custom">Chiama ora</a>
        </div>
      </div>
    </section>

    <section class="intro-strip">
      <div class="container intro-grid">
        <div class="intro-card">
          <strong>Vendita</strong>
          <span>Moto e scooter nuovi e usati plurimarche</span>
        </div>
        <div class="intro-card">
          <strong>Assistenza</strong>
          <span>Servizi qualificati di manutenzione e supporto</span>
        </div>
        <div class="intro-card">
          <strong>Ricambi</strong>
          <span>Ricambi originali per qualità e compatibilità</span>
        </div>
      </div>
    </section>

    <section id="moto" class="featured-section">
      <div class="container">
        <div class="section-heading">
          <p class="section-kicker">Catalogo</p>
          <h2>Moto e scooter in evidenza</h2>
          <p>Esplora una selezione di veicoli disponibili in concessionaria.</p>
        </div>

        <div class="filters-grid">
          <select v-model="filters.condition" class="filter-input" aria-label="Filtra per condizione">
            <option value="all">Tutti</option>
            <option value="nuove">Nuovi</option>
            <option value="usate">Usati</option>
          </select>

          <input
            v-model="filters.search"
            type="text"
            class="filter-input"
            placeholder="Cerca per marca o modello"
            aria-label="Cerca per marca o modello"
          />

          <select v-model="filters.sort" class="filter-input" aria-label="Ordina veicoli">
            <option value="price-asc">Prezzo crescente</option>
            <option value="price-desc">Prezzo decrescente</option>
            <option value="year-desc">Anno più recente</option>
          </select>
        </div>

        <div v-if="pending" class="state-box">
          Caricamento veicoli...
        </div>

        <div v-else-if="error" class="state-box error">
          Impossibile caricare il catalogo in questo momento.
        </div>

        <div v-else-if="featuredMotos.length" class="featured-grid">
          <article
            v-for="moto in featuredMotos"
            :key="moto._id"
            class="moto-card"
          >
            <img
              :src="formatImage(moto)"
              :alt="`${moto.marca} ${moto.modello}`"
              class="moto-image"
              loading="lazy"
            />

            <div class="moto-body">
              <p class="moto-kicker">{{ moto.marca || 'Moto' }}</p>
              <h3>{{ moto.modello || 'Modello disponibile' }}</h3>

              <ul class="moto-meta">
                <li>Anno: {{ formatYear(moto) }}</li>
                <li>Km: {{ moto.chilometri?.toLocaleString('it-IT') || 'N/D' }}</li>
                <li>Cilindrata: {{ moto.cilindrata ? `${moto.cilindrata} cc` : 'N/D' }}</li>
              </ul>

              <div class="moto-footer">
                <strong>{{ formatPrice(moto.prezzo) }}</strong>
                <NuxtLink :to="`/moto/${moto.slug || moto._id}`">Dettagli</NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="state-box">
          Nessun veicolo trovato con i filtri selezionati.
        </div>

        <div class="catalog-cta">
          <NuxtLink to="/moto" class="btn-primary-custom">Vai al catalogo completo</NuxtLink>
        </div>
      </div>
    </section>

    <section id="servizi" class="benefits-section">
      <div class="container">
        <div class="section-heading">
          <p class="section-kicker">Servizi</p>
          <h2>I nostri servizi</h2>
          <p>Una gamma completa di servizi per tutti gli appassionati delle due ruote.</p>
        </div>

        <div class="benefits-grid">
          <div class="benefit-card">
            <h3>Vendita veicoli</h3>
            <p>Ampia scelta di moto e scooter nuovi e usati plurimarche.</p>
          </div>

          <div class="benefit-card">
            <h3>Assistenza qualificata</h3>
            <p>Servizi di manutenzione e assistenza specializzata per ogni esigenza.</p>
          </div>

          <div class="benefit-card">
            <h3>Ricambi originali</h3>
            <p>Disponibilità di ricambi originali per garantire qualità e affidabilità.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="marchi" class="brands-section">
      <div class="container">
        <div class="section-heading">
          <p class="section-kicker">Marchi</p>
          <h2>Marchi trattati</h2>
          <p>Trattiamo marchi prestigiosi come Honda, Piaggio, Kymco e molti altri ancora.</p>
        </div>

        <div class="brands-grid">
          <div class="brand-pill">Honda</div>
          <div class="brand-pill">Piaggio</div>
          <div class="brand-pill">Kymco</div>
          <div class="brand-pill">Scooter</div>
          <div class="brand-pill">Moto usate</div>
          <div class="brand-pill">Moto nuove</div>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container cta-band-shell">
        <div>
          <p class="section-kicker">Road Runner Moto</p>
          <h2>Competenza e passione al tuo servizio</h2>
          <p>
            Vieni a trovarci in concessionaria per scoprire moto, scooter, accessori e assistenza dedicata.
          </p>
        </div>

        <div class="cta-actions">
          <a href="tel:0823516087" class="btn-secondary-custom">0823 516087</a>
          <a
            href="https://wa.me/393391581997"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary-custom"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>

    <section id="contatti" class="contact-section">
      <div class="container contact-shell">
        <div class="contact-copy">
          <p class="section-kicker">Contatti</p>
          <h2>Vieni a trovarci</h2>
          <p>
            Road Runner è a Capodrise, in Via Retella 65. Se cerchi una moto nuova, un usato selezionato
            o assistenza specializzata, siamo pronti ad aiutarti.
          </p>

          <div class="hours-box">
            <p><strong>Lunedì:</strong> 08:30 - 13:00 / 16:00 - 19:15</p>
            <p><strong>Martedì:</strong> 08:30 - 13:00 / 16:00 - 19:15</p>
            <p><strong>Mercoledì:</strong> 08:30 - 13:00 / 16:00 - 19:15</p>
            <p><strong>Giovedì:</strong> 08:30 - 13:00 / 16:00 - 19:15</p>
            <p><strong>Venerdì:</strong> 08:30 - 13:00 / 16:00 - 19:15</p>
            <p><strong>Sabato:</strong> 08:30 - 13:00</p>
            <p><strong>Domenica:</strong> Chiuso</p>
          </div>
        </div>

        <div class="contact-card">
          <h3>Contatti diretti</h3>
          <a href="tel:0823516087">Tel. 0823 516087</a>
          <a href="tel:+393391581997">Cell. +39 339 158 1997</a>
          <a href="mailto:inforoadrunner@libero.it">inforoadrunner@libero.it</a>
          <p>Via Retella 65, Capodrise (CE)</p>

          <div class="contact-buttons">
            <a
              href="https://wa.me/393391581997"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary-custom full"
            >
              Scrivici su WhatsApp
            </a>
            <a
              href="https://maps.google.com/?q=Via+Retella+65,+Capodrise"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary-custom full"
            >
              Apri su Maps
            </a>
          </div>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <strong>Road Runner Moto</strong>
          <p>Concessionaria moto e scooter a Capodrise.</p>
        </div>

        <div>
          <strong>Contatti</strong>
          <p>0823 516087</p>
          <p>+39 339 158 1997</p>
          <p>inforoadrunner@libero.it</p>
        </div>

        <div>
          <strong>Sede</strong>
          <p>Via Retella 65</p>
          <p>Capodrise (CE)</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
:root {
  --bg: #050505;
  --panel: #101010;
  --panel-2: #151515;
  --text: #f5f5f5;
  --muted: #bdbdbd;
  --primary: #d7182a;
  --primary-2: #ff5b6b;
  --line: rgba(255,255,255,.08);
  --shadow: 0 18px 50px rgba(0,0,0,.32);
}

* {
  box-sizing: border-box;
}

.page-shell {
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

.container {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(16px);
  background: rgba(5,5,5,.78);
  border-bottom: 1px solid var(--line);
}

.nav-shell {
  min-height: 82px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: white;
  min-width: 0;
}

.brand-logo {
  width: 58px;
  height: 58px;
  object-fit: contain;
  border-radius: 12px;
  background: #fff;
  padding: 6px;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.brand-name {
  font-size: 1.1rem;
  font-weight: 900;
  letter-spacing: .08em;
}

.brand-tagline {
  margin-top: 6px;
  color: var(--primary-2);
  font-weight: 800;
  letter-spacing: .12em;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 18px;
}

.main-nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.mobile-toggle {
  display: none;
  background: transparent;
  border: 0;
  padding: 0;
  width: 42px;
  height: 42px;
}

.mobile-toggle span {
  display: block;
  height: 2px;
  width: 24px;
  background: white;
  margin: 5px auto;
  border-radius: 999px;
}

.mobile-nav {
  display: none;
}

.hero {
  position: relative;
  min-height: 92vh;
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    linear-gradient(rgba(0,0,0,.62), rgba(0,0,0,.80)),
    radial-gradient(circle at top, rgba(215, 24, 42, 0.18), transparent 35%),
    url('/hero-moto.jpg') center/cover no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,.15), rgba(0,0,0,.5));
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 920px;
  padding: 90px 0 80px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  padding: 10px 16px;
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 999px;
  background: rgba(255,255,255,.06);
  color: #fff;
  font-size: .95rem;
}

.hero-title {
  margin: 0 0 18px;
  font-size: clamp(2.7rem, 6vw, 5.4rem);
  line-height: .95;
  font-weight: 900;
  letter-spacing: -.03em;
}

.hero-title span {
  display: block;
  color: var(--primary-2);
}

.hero-subtitle {
  max-width: 760px;
  margin: 0 auto 30px;
  color: #e8e8e8;
  font-size: 1.08rem;
  line-height: 1.7;
}

.hero-actions,
.cta-actions,
.contact-buttons {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.hero-actions,
.cta-actions {
  justify-content: center;
}

.btn-primary-custom,
.btn-secondary-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 14px 22px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}

.btn-primary-custom:hover,
.btn-secondary-custom:hover {
  transform: translateY(-2px);
}

.btn-primary-custom {
  color: white;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  box-shadow: 0 10px 26px rgba(215, 24, 42, .26);
}

.btn-secondary-custom {
  color: white;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(255,255,255,.04);
}

.full {
  width: 100%;
}

.intro-strip,
.featured-section,
.benefits-section,
.brands-section,
.contact-section {
  padding: 88px 0;
}

.intro-strip {
  padding-top: 34px;
}

.intro-grid,
.featured-grid,
.benefits-grid,
.brands-grid,
.footer-grid {
  display: grid;
  gap: 22px;
}

.intro-grid,
.featured-grid,
.benefits-grid {
  grid-template-columns: repeat(3, 1fr);
}

.brands-grid {
  grid-template-columns: repeat(6, 1fr);
}

.footer-grid {
  grid-template-columns: repeat(3, 1fr);
}

.intro-card,
.moto-card,
.benefit-card,
.state-box,
.brand-pill,
.hours-box,
.contact-card {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: linear-gradient(180deg, #131313, #0b0b0b);
  box-shadow: var(--shadow);
}

.intro-card,
.benefit-card,
.state-box,
.hours-box,
.contact-card {
  padding: 24px;
}

.intro-card {
  display: grid;
  gap: 8px;
}

.intro-card strong {
  font-size: 1.05rem;
}

.intro-card span,
.benefit-card p,
.state-box,
.hours-box p,
.contact-copy p,
.contact-card p,
.site-footer p {
  color: var(--muted);
}

.section-heading {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 30px;
}

.section-heading h2,
.cta-band-shell h2,
.contact-copy h2 {
  margin: 0 0 12px;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
}

.section-kicker {
  margin: 0 0 10px;
  color: var(--primary-2);
  text-transform: uppercase;
  letter-spacing: .12em;
  font-size: .85rem;
  font-weight: 800;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.filter-input {
  width: 100%;
  min-height: 52px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--panel);
  color: white;
  padding: 14px 16px;
  outline: none;
}

.filter-input:focus {
  border-color: rgba(255, 91, 107, .65);
  box-shadow: 0 0 0 4px rgba(255, 91, 107, .12);
}

.moto-card {
  overflow: hidden;
}

.moto-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
}

.moto-body {
  padding: 18px;
}

.moto-kicker {
  margin: 0 0 10px;
  color: var(--primary-2);
  text-transform: uppercase;
  letter-spacing: .08em;
  font-size: .8rem;
  font-weight: 800;
}

.moto-body h3 {
  margin: 0 0 14px;
  font-size: 1.35rem;
}

.moto-meta {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  display: grid;
  gap: 8px;
  color: var(--muted);
}

.moto-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.moto-footer a {
  color: white;
  font-weight: 700;
  text-decoration: none;
}

.catalog-cta {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

.benefit-card h3,
.contact-card h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.brand-pill {
  min-height: 78px;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #fff;
  text-align: center;
  padding: 14px;
}

.cta-band {
  padding: 10px 0 88px;
}

.cta-band-shell {
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 24px;
  align-items: center;
  padding: 30px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgba(215,24,42,.14), rgba(255,91,107,.06)),
    linear-gradient(180deg, #151515, #0d0d0d);
}

.contact-shell {
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  gap: 24px;
  align-items: start;
}

.contact-card {
  display: grid;
  gap: 14px;
}

.contact-card a {
  color: white;
  text-decoration: none;
  font-weight: 700;
}

.hours-box {
  margin-top: 22px;
}

.site-footer {
  padding: 32px 0 40px;
  border-top: 1px solid var(--line);
  background: #080808;
}

.error {
  border-color: rgba(255, 91, 107, .35);
}

@media (max-width: 1100px) {
  .brands-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .main-nav {
    display: none;
  }

  .mobile-toggle {
    display: block;
  }

  .mobile-nav {
    display: grid;
    gap: 10px;
    padding: 0 16px 16px;
    border-top: 1px solid var(--line);
    background: rgba(8,8,8,.96);
  }

  .mobile-nav a {
    color: white;
    text-decoration: none;
    padding: 10px 0;
  }

  .mobile-cta {
    margin-top: 4px;
  }

  .intro-grid,
  .featured-grid,
  .benefits-grid,
  .filters-grid,
  .brands-grid,
  .contact-shell,
  .cta-band-shell,
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    min-height: 86vh;
  }

  .hero-content {
    padding: 80px 0 68px;
  }
}
</style>
