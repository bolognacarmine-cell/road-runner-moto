<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { useSearch } from '~/composables/useSearch'
import { useFilter } from '~/composables/useFilter'

const { setSearchQuery } = useSearch()
const { setFilter } = useFilter()

const selectFilter = (filter) => {
  setFilter(filter)
  // Se non siamo sulla home, il router gestirà il navigare verso /#moto
}

const mobileMenuOpen = ref(false)
let ctx;

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Silktide Consent Manager Configuration
useHead({
  script: [
    { src: '/silktide-consent.js', defer: true }
  ]
})

onMounted(async () => {
  await nextTick()
  
  // Inizializzazione Silktide
  const initSilktide = () => {
    if (window.silktideCookieBannerManager) {
      // Check if already initialized to avoid multiple banners
      if (!window.silktideCookieBannerManager.instance) {
        window.silktideCookieBannerManager.init({
          background: {
            showBackground: true
          },
          cookieIcon: {
            position: "bottom-left"
          }
        })
      }
      window.silktideCookieBannerManager.updateCookieBannerConfig({
        background: {
          showBackground: true
        },
        cookieIcon: {
          position: "bottom-left"
        },
        cookieTypes: [
          {
            id: "necessary",
            name: "Necessario",
            description: "<p>Questi cookie sono necessari per il corretto funzionamento del sito web e non possono essere disattivati. Aiutano in attività come l'accesso e l'impostazione delle preferenze sulla privacy.</p>",
            required: true
          },
          {
            id: "analytics",
            name: "Analisi",
            description: "<p>Questi cookie ci aiutano a migliorare il sito monitorando quali pagine sono più popolari e come i visitatori navigano sul sito.</p>",
            defaultValue: true,
            onAccept: function() {
              if (typeof gtag === 'function') {
                gtag('consent', 'update', { 'analytics_storage': 'granted' });
              }
              if (typeof dataLayer !== 'undefined') {
                dataLayer.push({ 'event': 'consenso_analitico_accettato' });
              }
            },
            onReject: function() {
              if (typeof gtag === 'function') {
                gtag('consent', 'update', { 'analytics_storage': 'denied' });
              }
            }
          },
          {
            id: "advertising",
            name: "Pubblicità",
            description: "<p>Questi cookie forniscono funzionalità aggiuntive e personalizzazione per migliorare la tua esperienza. Possono essere impostati da noi o da partner di cui utilizziamo i servizi.</p>",
            onAccept: function() {
              if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                  'ad_storage': 'granted',
                  'ad_user_data': 'granted',
                  'ad_personalization': 'granted'
                });
              }
              if (typeof dataLayer !== 'undefined') {
                dataLayer.push({ 'event': 'consenso_accettato_alla_pubblicità' });
              }
            },
            onReject: function() {
              if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied'
                });
              }
            }
          }
        ],
        text: {
          banner: {
            description: "<p>Utilizziamo i cookie sul nostro sito per migliorare la tua esperienza utente, fornire contenuti personalizzati e analizzare il nostro traffico. <a href='/cookie-policy' target='_blank'>Informativa sui cookie.</a></p>",
            acceptAllButtonText: "Accetta tutto",
            acceptAllButtonAccessibleLabel: "Accetta tutti i cookie",
            rejectNonEssentialButtonText: "Rifiuta i non essenziali",
            rejectNonEssentialButtonAccessibleLabel: "Rifiuta i non essenziali",
            preferencesButtonText: "Preferenze",
            preferencesButtonAccessibleLabel: "Attiva/disattiva le preferenze"
          },
          preferences: {
            title: "Personalizza le tue preferenze sui cookie",
            description: "<p>Rispettiamo il tuo diritto alla privacy. Puoi scegliere di non consentire alcuni tipi di cookie. Le tue preferenze sui cookie saranno applicate a tutto il nostro sito web.</p>",
            creditLinkText: "Ottieni questo banner gratuitamente",
            creditLinkAccessibleLabel: "Ottieni questo banner gratuitamente"
          }
        }
      });
    } else {
      setTimeout(initSilktide, 300);
    }
  }

  initSilktide()

  ctx = gsap.context(() => {
    // Animazione degli elementi interni (senza far muovere l'intero header)
    const navElements = document.querySelectorAll('.brand, .main-nav a, .nav-dropdown, .btn-primary-custom, .mobile-toggle')
    if (navElements.length > 0) {
      gsap.fromTo(navElements, 
        { y: -30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          delay: 0.2,
          ease: 'expo.out',
          clearProps: 'all'
        }
      )
    }
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <div class="page-shell">
    <!-- Header Standard Minimale -->
    <header class="minimal-header">
      <div class="container header-content">
        <NuxtLink to="/" class="minimal-logo">
          <div class="logo-box">
            <img src="/logo-road-runner.jpg" alt="Logo Road Runner Moto - Concessionaria Capodrise" />
          </div>
          <div class="brand-info">
            <span class="brand-title">ROAD RUNNER</span>
            <span class="brand-subtitle">Concessionaria Moto Nuove & Usate</span>
          </div>
        </NuxtLink>
        <nav class="minimal-nav">
          <NuxtLink to="/#chi-samo">Chi Siamo</NuxtLink>
          
          <div class="nav-dropdown">
            <span class="dropdown-trigger">Moto <span class="arrow">▼</span></span>
            <div class="dropdown-content">
              <NuxtLink to="/#moto" @click="selectFilter('nuovo')">Nuovo</NuxtLink>
              <NuxtLink to="/#moto" @click="selectFilter('usato')">Usato</NuxtLink>
              <NuxtLink to="/#moto" @click="selectFilter('promozioni')">Promozioni</NuxtLink>
            </div>
          </div>

          <div class="nav-dropdown">
            <span class="dropdown-trigger">Lifestyle <span class="arrow">▼</span></span>
            <div class="dropdown-content">
              <NuxtLink to="/#lifestyle">Accessori</NuxtLink>
              <NuxtLink to="/#lifestyle">Mondo Biker</NuxtLink>
            </div>
          </div>

          <div class="nav-dropdown">
            <span class="dropdown-trigger">Servizi <span class="arrow">▼</span></span>
            <div class="dropdown-content">
              <NuxtLink to="/#permute">Permute</NuxtLink>
              <NuxtLink to="/#assistenza">Assistenza</NuxtLink>
            </div>
          </div>

          <NuxtLink to="/blog">Blog</NuxtLink>
          <NuxtLink to="/#contatti">Contatti</NuxtLink>
          <NuxtLink to="/portale/login" class="portal-link-minimal">Area Clienti</NuxtLink>
        </nav>

        <!-- Mobile Toggle -->
        <button class="mobile-toggle" @click="toggleMenu" aria-label="Menu">
          <div class="hamburger" :class="{ active: mobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      <!-- Mobile Drawer -->
      <Transition name="drawer">
        <div v-if="mobileMenuOpen" class="mobile-drawer">
          <nav class="mobile-nav">
            <NuxtLink to="/#chi-samo" @click="toggleMenu">Chi Siamo</NuxtLink>
            
            <div class="mobile-group">
              <span class="group-title">Moto</span>
              <NuxtLink to="/#moto" @click="selectFilter('nuovo'); toggleMenu()">Nuovo</NuxtLink>
              <NuxtLink to="/#moto" @click="selectFilter('usato'); toggleMenu()">Usato</NuxtLink>
              <NuxtLink to="/#moto" @click="selectFilter('promozioni'); toggleMenu()">Promozioni</NuxtLink>
            </div>

            <div class="mobile-group">
              <span class="group-title">Lifestyle</span>
              <NuxtLink to="/#lifestyle" @click="toggleMenu">Accessori</NuxtLink>
              <NuxtLink to="/#lifestyle" @click="toggleMenu">Mondo Biker</NuxtLink>
            </div>

            <div class="mobile-group">
              <span class="group-title">Servizi</span>
              <NuxtLink to="/#permute" @click="toggleMenu">Permute</NuxtLink>
              <NuxtLink to="/#assistenza" @click="toggleMenu">Assistenza</NuxtLink>
            </div>

            <NuxtLink to="/blog" @click="toggleMenu">Blog</NuxtLink>
            <NuxtLink to="/#contatti" @click="toggleMenu">Contatti</NuxtLink>
            <NuxtLink to="/portale/login" class="portal-link-mobile" @click="toggleMenu">Area Clienti</NuxtLink>
          </nav>
        </div>
      </Transition>
    </header>

    <!-- Main content -->
    <main class="main-content">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-info">
          <NuxtLink to="/" class="footer-logo">ROAD RUNNER</NuxtLink>
          <p class="company-name">ROAD RUNNER DI TARTAGLIONE PASQUALE</p>
          <p class="company-address">Via San Francesco 13, 81020 Capodrise (CE)</p>
          <div class="legal-details">
            <p>Partita IVA: 04335610616</p>
            <p>Codice Fiscale: TRTPQL*****E932E</p>
            <p>REA: 318460</p>
          </div>
        </div>
        
        <div class="footer-links">
          <strong>Navigazione</strong>
          <nav>
            <NuxtLink to="/#chi-samo">Chi Siamo</NuxtLink>
            <NuxtLink to="/#moto">Moto & Scooter</NuxtLink>
            <NuxtLink to="/#lifestyle">Lifestyle</NuxtLink>
            <NuxtLink to="/#assistenza">Assistenza</NuxtLink>
            <NuxtLink to="/blog">Blog</NuxtLink>
          </nav>
        </div>

        <div class="footer-contact">
          <strong>Contatti</strong>
          <p>📞 0823 516087</p>
          <p>📱 +39 339 158 1997</p>
          <p>✉️ inforoadrunner@libero.it</p>
          <div class="social-links-footer">
            <a href="#" target="_blank">Facebook</a>
            <a href="#" target="_blank">Instagram</a>
          </div>
        </div>
      </div>

      <div class="container footer-bottom">
        <div class="bottom-flex">
          <p>&copy; 2026 Road Runner Moto. Tutti i diritti riservati.</p>
          <div class="privacy-links">
            <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>
            <NuxtLink to="/cookie-policy">Cookie Policy</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.minimal-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem 0;
  z-index: 1000;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.minimal-logo {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
}

.logo-box {
  width: 60px;
  height: 60px;
  background: #fff;
  border-radius: 50%;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  overflow: hidden;
}

.logo-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.1);
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-title {
  color: #fff;
  font-weight: 950;
  font-size: 1.5rem;
  letter-spacing: -0.02em;
  line-height: 1;
}

.brand-subtitle {
  color: var(--primary-2);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  margin-top: 4px;
}

.minimal-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.minimal-nav a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 700;
  transition: all 0.3s;
}

.minimal-nav a:hover {
  color: var(--primary-2);
  transform: translateY(-1px);
}

/* Dropdown Styles */
.nav-dropdown {
  position: relative;
  cursor: pointer;
  padding: 10px 0;
}

.dropdown-trigger {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

.nav-dropdown:hover .dropdown-trigger {
  color: var(--primary-2);
}

.arrow {
  font-size: 0.6rem;
  opacity: 0.5;
  transition: transform 0.3s;
}

.nav-dropdown:hover .arrow {
  transform: rotate(180deg);
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.nav-dropdown:hover .dropdown-content {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.dropdown-content a {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.85rem !important;
  color: rgba(255, 255, 255, 0.7) !important;
  display: block;
  white-space: nowrap;
}

.dropdown-content a:hover {
  background: rgba(225, 29, 72, 0.1);
  color: var(--primary-2) !important;
  transform: none !important;
}

.portal-link-minimal {
  background: rgba(225, 29, 72, 0.15);
  padding: 8px 18px;
  border-radius: 100px;
  border: 1px solid rgba(225, 29, 72, 0.3);
  color: var(--primary-2) !important;
}

.portal-link-minimal:hover {
  background: var(--primary-2);
  color: #fff !important;
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  z-index: 1001;
}

.hamburger {
  width: 28px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: all 0.3s;
}

.hamburger.active span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

/* Mobile Drawer */
.mobile-drawer {
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 5, 0.98);
  backdrop-filter: blur(20px);
  z-index: 1000;
  padding: 120px 40px 60px;
  display: flex;
  flex-direction: column;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.mobile-nav a {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  text-decoration: none;
}

.mobile-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding-left: 1rem;
  border-left: 2px solid rgba(225, 29, 72, 0.3);
}

.group-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary-2);
  font-weight: 900;
}

.mobile-group a {
  font-size: 1.1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}

.portal-link-mobile {
  margin-top: 1rem;
  text-align: center;
  background: var(--primary);
  padding: 16px;
  border-radius: 12px;
  font-size: 1.1rem !important;
}

/* Transitions */
.drawer-enter-active, .drawer-leave-active {
  transition: opacity 0.4s, transform 0.4s;
}
.drawer-enter-from, .drawer-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.main-content {
  min-height: 100vh;
}

@media (max-width: 1100px) {
  .minimal-nav {
    gap: 1rem;
  }
  .brand-subtitle {
    display: none;
  }
}

@media (max-width: 850px) {
  .minimal-nav {
    display: none;
  }
  .mobile-toggle {
    display: block;
  }
}

/* Header Styles Rimossi in favore di PremiumHeader.vue */

.site-footer {
  padding: 100px 0 40px;
  background: #050505;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 60px;
  margin-bottom: 80px;
}

.footer-logo {
  display: inline-block;
  font-size: 1.8rem;
  font-weight: 950;
  color: #fff;
  text-decoration: none;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.company-name {
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.company-address, .legal-details p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  line-height: 1.6;
}

.legal-details {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-links strong, .footer-contact strong {
  display: block;
  margin-bottom: 24px;
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
}

.footer-links nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: var(--primary-2);
}

.footer-contact p {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.social-links-footer {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.social-links-footer a {
  color: #fff;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.social-links-footer a:hover {
  opacity: 1;
  color: var(--primary-2);
}

.footer-bottom {
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.bottom-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.85rem;
}

.privacy-links {
  display: flex;
  gap: 24px;
}

.privacy-links a {
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s;
}

.privacy-links a:hover {
  color: #fff;
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .bottom-flex {
    flex-direction: column;
    text-align: center;
  }
}
</style>