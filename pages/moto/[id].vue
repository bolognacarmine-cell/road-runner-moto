
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MotoCarousel from '~/components/moto/MotoCarousel.vue'

const route = useRoute()
const moto = ref(null)
const relatedMotos = ref([]) // In caso servissero altre moto correlate
const relatedPosts = ref([])
const loading = ref(true)
const error = ref(null)

const fetchMoto = async () => {
  try {
    const res = await $fetch(`/api/motos/${route.params.id}`)
    moto.value = res.moto
    // Carica anche articoli blog correlati
    fetchRelatedPosts()
  } catch (err) {
    console.error('Errore nel caricamento del veicolo:', err)
    error.value = 'Impossibile caricare i dettagli di questo veicolo.'
  } finally {
    loading.value = false
  }
}

const fetchRelatedPosts = async () => {
  try {
    const res = await $fetch(`/api/blog/related?motoId=${route.params.id}`)
    relatedPosts.value = res.posts || []
  } catch (e) {
    console.error('Errore caricamento articoli correlati:', e)
  }
}

onMounted(() => {
  fetchMoto()
})

const formatPrice = (price) => {
  if (!price) return 'Prezzo su richiesta'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)
}

const formatImages = (images) => {
  if (images && Array.isArray(images) && images.length > 0) {
    return images.map(img => {
      const url = typeof img === 'string' ? img : (img?.url || '/logo-road-runner.jpg')
      return url.replace('/upload/', '/upload/f_auto,q_auto/')
    })
  }
  return ['/logo-road-runner.jpg']
}
</script>

<template>
  <div class="moto-detail-page">
    <div class="container py-5">
      <!-- Breadcrumb / Back button -->
      <div class="back-nav mb-5">
        <NuxtLink to="/#moto" class="btn-back">
          <span class="arrow">←</span> Torna al catalogo
        </NuxtLink>
      </div>
      <!-- Loading State -->
      <div v-if="loading" class="loading-box">
        <div class="spinner"></div>
        <p>Caricamento dettagli...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-box">
        <p>{{ error }}</p>
        <NuxtLink to="/" class="btn-primary-custom">Torna alla Home</NuxtLink>
      </div>

      <!-- Content -->
      <div v-else-if="moto" class="moto-detail-grid">
        <!-- Colonna Sinistra: Carosello -->
        <div class="moto-visuals">
          <MotoCarousel :images="formatImages(moto.immagini)" :altText="`${moto.marca} ${moto.modello}`" height="500px" />
          
          <div class="moto-description-section mt-5">
            <h3>Descrizione</h3>
            <div class="description-text">
              {{ moto.descrizione || 'Nessuna descrizione disponibile per questo veicolo.' }}
            </div>
          </div>
        </div>

        <!-- Colonna Destra: Info & Prezzo -->
        <div class="moto-info-panel">
          <div class="sticky-panel">
            <span class="type-badge">{{ moto.tipo }}</span>
            <h1 class="moto-title">{{ moto.marca }} {{ moto.modello }}</h1>
            <p class="price-tag">{{ formatPrice(moto.prezzo) }}</p>
            
            <div class="spec-grid">
              <div class="spec-item">
                <span class="label">Anno</span>
                <span class="value">{{ moto.annoImmatricolazione || 'N/D' }}</span>
              </div>
              <div class="spec-item">
                <span class="label">Chilometri</span>
                <span class="value">{{ moto.chilometri?.toLocaleString('it-IT') || '0' }} km</span>
              </div>
              <div class="spec-item">
                <span class="label">Cilindrata</span>
                <span class="value">{{ moto.cilindrata ? `${moto.cilindrata} cc` : 'N/D' }}</span>
              </div>
            </div>

            <div class="cta-actions">
              <a :href="`https://wa.me/393391581997?text=Ciao, vorrei informazioni su ${moto.marca} ${moto.modello}`" target="_blank" class="btn-whatsapp">
                Chiedi su WhatsApp
              </a>
              <a href="tel:+393391581997" class="btn-call">
                Chiama ora
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Articoli Blog Correlati -->
      <div v-if="relatedPosts.length > 0" class="related-posts-section mt-10">
        <h3 class="section-title">Dal nostro Blog</h3>
        <div class="blog-mini-grid">
          <NuxtLink v-for="post in relatedPosts" :key="post._id" :to="`/blog/${post.slug}`" class="mini-blog-card">
            <img :src="post.imageCover || '/logo-road-runner.jpg'" :alt="post.title" />
            <div class="mini-blog-info">
              <span class="mini-badge">{{ post.category }}</span>
              <h4>{{ post.title }}</h4>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.moto-detail-page {
  background: #050505;
  color: #fff;
  min-height: 100vh;
  padding-top: 80px;
}

.back-nav {
  display: flex;
  align-items: center;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #888;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-back .arrow {
  transition: transform 0.3s ease;
}

.btn-back:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-back:hover .arrow {
  transform: translateX(-4px);
}
.moto-detail-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 40px;
}

.moto-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin: 10px 0;
}

.price-tag {
  font-size: 2rem;
  color: #ff5b6b;
  font-weight: 700;
  margin-bottom: 30px;
}

.type-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 91, 107, 0.1);
  color: #ff5b6b;
  border-radius: 20px;
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 700;
}

.spec-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
  background: #111;
  padding: 20px;
  border-radius: 18px;
  border: 1px solid #222;
}

.spec-item {
  display: flex;
  flex-direction: column;
}

.spec-item .label {
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 4px;
}

.spec-item .value {
  font-weight: 700;
  color: #fff;
}

.description-text {
  color: #ccc;
  line-height: 1.8;
  font-size: 1.1rem;
  white-space: pre-wrap;
}

.moto-description-section h3 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 700;
}

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-whatsapp {
  background: #25d366;
  color: white;
  text-align: center;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.3s;
}

.btn-call {
  background: #fff;
  color: #000;
  text-align: center;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.3s;
}

.btn-whatsapp:hover, .btn-call:hover {
  opacity: 0.9;
}

.sticky-panel {
  position: sticky;
  top: 100px;
}

.related-posts-section {
  padding-top: 60px;
  border-top: 1px solid var(--line);
}

.section-title {
  font-size: 1.75rem;
  font-weight: 900;
  margin-bottom: 30px;
}

.blog-mini-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.mini-blog-card {
  display: flex;
  gap: 15px;
  background: var(--panel);
  border: 1px solid var(--line);
  padding: 12px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.mini-blog-card:hover {
  border-color: var(--primary-2);
  transform: translateY(-5px);
}

.mini-blog-card img {
  width: 100px;
  height: 75px;
  object-fit: cover;
  border-radius: 8px;
}

.mini-blog-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.mini-badge {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--primary-2);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.mini-blog-info h4 {
  font-size: 1rem;
  line-height: 1.3;
  margin: 0;
}

.loading-box, .error-box {
  text-align: center;
  padding: 100px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255,255,255,0.1);
  border-top: 4px solid #ff5b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .moto-detail-grid {
    grid-template-columns: 1fr;
  }
  .sticky-panel {
    position: static;
  }
}
</style>
