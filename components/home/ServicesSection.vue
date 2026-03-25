<script setup>
import { ref, onMounted } from 'vue'

const latestNews = ref(null)
const latestMaintenance = ref(null)

const fetchFeaturedArticles = async () => {
  try {
    const [newsRes, maintRes] = await Promise.all([
      $fetch('/api/blog', { query: { category: 'Novità Moto', limit: 1 } }),
      $fetch('/api/blog', { query: { category: 'Manutenzione', limit: 1 } })
    ])
    
    if (newsRes.posts?.length > 0) latestNews.value = newsRes.posts[0]
    if (maintRes.posts?.length > 0) latestMaintenance.value = maintRes.posts[0]
  } catch (err) {
    console.error('Errore recupero articoli per servizi:', err)
  }
}

onMounted(() => {
  fetchFeaturedArticles()
})
</script>

<template>
<section id="servizi" class="benefits-section">
  <div class="container">
    <div class="section-heading">
      <p class="section-kicker">Servizi</p>
      <h2>I nostri servizi</h2>
      <p>Una gamma completa per tutti gli appassionati delle due ruote.</p>
    </div>
    <div class="benefits-grid">
      <div class="benefit-card">
        <h3>Vendita veicoli</h3>
        <p>Ampia scelta di moto e scooter plurimarche.</p>
        <div v-if="latestNews" class="latest-article-tip">
          <span>Novità:</span>
          <NuxtLink :to="`/blog/${latestNews.slug}`">{{ latestNews.title }}</NuxtLink>
        </div>
        <NuxtLink to="/blog?category=Novità%20Moto" class="read-more">Leggi di più →</NuxtLink>
      </div>
      <div class="benefit-card">
        <h3>Assistenza qualificata</h3>
        <p>Servizi di manutenzione e assistenza specializzata.</p>
        <div v-if="latestMaintenance" class="latest-article-tip">
          <span>Consiglio:</span>
          <NuxtLink :to="`/blog/${latestMaintenance.slug}`">{{ latestMaintenance.title }}</NuxtLink>
        </div>
        <NuxtLink to="/blog?category=Manutenzione" class="read-more">Leggi di più →</NuxtLink>
      </div>
      <div class="benefit-card">
        <h3>Finanziamenti</h3>
        <p>Soluzioni di pagamento flessibili e personalizzate per ogni esigenza.</p>
        <div class="latest-article-tip">
          <span>Novità:</span>
          <span>Tassi agevolati in sede</span>
        </div>
        <a href="https://wa.me/393391581997" target="_blank" rel="noopener noreferrer" class="read-more">Chiedi info →</a>
      </div>
    </div>
  </div>
</section>
</template>
<style scoped>
.benefits-section {
  padding: 80px 0;
  background: var(--bg);
  scroll-margin-top: 180px; /* Margine per l'header fisso */
}

.section-heading {
  margin-bottom: 48px;
}

.section-kicker {
  color: var(--primary-2);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.section-heading h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  margin-bottom: 16px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .benefits-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}

.benefit-card {
  padding: 32px;
  background: var(--panel);
  border-radius: var(--radius);
  border: 1px solid var(--line);
  transition: transform var(--transition), border-color var(--transition);
}

@media (hover: hover) {
  .benefit-card:hover {
    transform: translateY(-8px);
    border-color: rgba(255, 255, 255, 0.15);
  }
}

.benefit-card h3 {
  margin-bottom: 16px;
  color: var(--primary-2);
  font-weight: 800;
  font-size: 1.25rem;
}

.benefit-card p {
  color: var(--muted);
  font-size: 1rem;
  margin-bottom: 24px;
}

.latest-article-tip {
  background: rgba(255, 255, 255, 0.03);
  border-left: 2px solid var(--primary-2);
  padding: 12px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 24px;
}

.latest-article-tip span {
  display: block;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--primary-2);
  margin-bottom: 4px;
}

.latest-article-tip a {
  font-size: 0.85rem;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  line-height: 1.3;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.latest-article-tip a:hover {
  color: var(--primary-2);
}

.read-more {
  display: inline-block;
  color: var(--primary-2);
  font-weight: 700;
  text-decoration: none;
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.read-more:hover {
  transform: translateX(5px);
}
</style>