<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const post = ref(null)
const relatedMotos = ref([])
const loading = ref(true)
const error = ref(null)

const fetchPost = async () => {
  try {
    console.log('CHIAMATA API PER SLUG:', route.params.slug)
    const res = await $fetch(`/api/blog/${route.params.slug}`)
    post.value = res.post
    relatedMotos.value = res.relatedMotos
  } catch (err) {
    console.error('ERRORE FETCH POST:', err)
    error.value = err.data?.statusMessage || 'Articolo non trovato o errore nel caricamento.'
  } finally {
    loading.value = false
  }
}

// Semplice parser Markdown (molto base)
const renderMarkdown = (text) => {
  if (!text) return ''
  return text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img src='$2' alt='$1' class='blog-content-img' />")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank'>$1</a>")
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n/gim, '<br />')
}

onMounted(() => {
  fetchPost()
})

const formatDate = (d) => new Date(d).toLocaleDateString('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

useHead({
  title: post.value?.title || 'Articolo Blog',
  meta: [
    { name: 'description', content: post.value?.excerpt || '' },
    { property: 'og:title', content: post.value?.title },
    { property: 'og:image', content: post.value?.imageCover }
  ]
})
</script>

<template>
  <div class="blog-post-page">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Caricamento articolo...</p>
    </div>

    <div v-else-if="error" class="error-box container">
      <p>{{ error }}</p>
      <NuxtLink to="/blog" class="btn-primary-custom">Torna al Blog</NuxtLink>
    </div>

    <article v-else-if="post" class="post-content">
      <!-- Hero Header -->
      <header class="post-hero">
        <div class="hero-bg" :style="{ backgroundImage: `url(${post.imageCover || '/logo-road-runner.jpg'})` }"></div>
        <div class="hero-overlay"></div>
        <div class="container hero-shell">
          <NuxtLink to="/blog" class="back-link">← Torna al Blog</NuxtLink>
          <div class="post-meta-top">
            <span class="badge">{{ post.category }}</span>
            <span class="date">{{ formatDate(post.date) }}</span>
          </div>
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-author">
            <img src="/logo-road-runner.jpg" alt="Author" />
            <span>{{ post.autore || 'Road Runner Team' }}</span>
          </div>
        </div>
      </header>

      <div class="container main-layout">
        <!-- Contenuto Articolo -->
        <div class="article-body">
          <div class="markdown-content" v-html="renderMarkdown(post.content)"></div>
          
          <!-- Social Share -->
          <div class="share-box">
            <span>Condividi:</span>
            <div class="share-links">
              <a :href="`https://wa.me/?text=Leggi questo articolo su Road Runner Moto: ${post.title} - https://road-runner-moto.it/blog/${post.slug}`" target="_blank" class="share-wa">WhatsApp</a>
              <a :href="`https://www.facebook.com/sharer/sharer.php?u=https://road-runner-moto.it/blog/${post.slug}`" target="_blank" class="share-fb">Facebook</a>
            </div>
          </div>
        </div>

        <!-- Sidebar: Moto Correlate & Info -->
        <aside class="article-sidebar">
          <div v-if="relatedMotos.length > 0" class="sidebar-block">
            <h3>Moto in evidenza</h3>
            <div class="related-motos">
              <NuxtLink v-for="moto in relatedMotos" :key="moto._id" :to="`/moto/${moto._id}`" class="mini-moto-card">
                <img :src="moto.immagini?.[0] || '/logo-road-runner.jpg'" alt="Moto" />
                <div class="mini-moto-info">
                  <strong>{{ moto.marca }} {{ moto.modello }}</strong>
                  <span class="price">{{ moto.prezzo ? `€ ${moto.prezzo}` : 'Prezzo su richiesta' }}</span>
                </div>
              </NuxtLink>
            </div>
          </div>

          <div class="sidebar-cta">
            <h3>Hai bisogno di assistenza?</h3>
            <p>I nostri esperti sono pronti ad aiutarti per ogni tua esigenza.</p>
            <NuxtLink to="/#contatti" class="btn-primary-custom full">Contattaci ora</NuxtLink>
          </div>
        </aside>
      </div>
    </article>
  </div>
</template>

<style scoped>
.blog-post-page {
  background: var(--bg);
  min-height: 100vh;
  padding-bottom: 100px;
}

.post-hero {
  position: relative;
  height: 70vh;
  min-height: 500px;
  display: flex;
  align-items: flex-end;
  padding-bottom: 80px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1.05);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0.2) 100%);
}

.hero-shell {
  position: relative;
  z-index: 2;
}

.back-link {
  color: var(--muted);
  font-weight: 600;
  margin-bottom: 30px;
  display: inline-block;
  transition: color 0.3s ease;
}

.back-link:hover { color: #fff; }

.post-meta-top {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.badge {
  background: var(--primary);
  color: #fff;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
}

.date {
  color: var(--muted);
  font-size: 0.9rem;
}

.post-title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 30px;
  letter-spacing: -0.02em;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.post-author img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--primary);
}

.post-author span {
  font-weight: 700;
  font-size: 0.95rem;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 60px;
  margin-top: 60px;
}

@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
}

.article-body {
  background: var(--panel);
  border: 1px solid var(--line);
  padding: 40px;
  border-radius: 24px;
}

.markdown-content {
  font-size: 1.15rem;
  line-height: 1.8;
  color: rgba(255,255,255,0.9);
}

.markdown-content :deep(h2) {
  font-size: 2rem;
  font-weight: 800;
  margin: 40px 0 20px;
  color: var(--primary-2);
}

.markdown-content :deep(h3) {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 24px 0 12px;
}

.markdown-content :deep(p) {
  margin-bottom: 20px;
}

.markdown-content :deep(li) {
  margin-bottom: 8px;
  list-style: square;
  margin-left: 20px;
}

.markdown-content :deep(a) {
  color: var(--primary-2);
  text-decoration: underline;
}

.markdown-content :deep(.blog-content-img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 32px 0;
  display: block;
}

.share-box {
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid var(--line);
  display: flex;
  align-items: center;
  gap: 20px;
}

.share-links {
  display: flex;
  gap: 15px;
}

.share-wa, .share-fb {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
}

.share-wa { background: #25D366; }
.share-fb { background: #1877F2; }

.article-sidebar {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.sidebar-block h3, .sidebar-cta h3 {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 20px;
}

.related-motos {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mini-moto-card {
  display: flex;
  gap: 15px;
  background: var(--panel-2);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--line);
  transition: all 0.3s ease;
}

.mini-moto-card:hover {
  border-color: var(--primary-2);
  transform: translateX(5px);
}

.mini-moto-card img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.mini-moto-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.mini-moto-info strong {
  font-size: 0.95rem;
  display: block;
}

.mini-moto-info .price {
  color: var(--primary-2);
  font-weight: 700;
  font-size: 0.85rem;
}

.sidebar-cta {
  background: linear-gradient(135deg, var(--primary) 0%, #b91524 100%);
  padding: 30px;
  border-radius: 20px;
  color: #fff;
}

.sidebar-cta p {
  font-size: 0.95rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .post-hero {
    height: 60vh;
    min-height: 400px;
    padding-bottom: 40px;
  }

  .post-title {
    font-size: 2.2rem;
  }

  .article-body {
    padding: 24px 20px;
    border-radius: 16px;
  }

  .markdown-content {
    font-size: 1.05rem;
  }

  .markdown-content :deep(h2) {
    font-size: 1.6rem;
  }

  .share-box {
    flex-direction: column;
    align-items: flex-start;
  }

  .share-links {
    width: 100%;
  }

  .share-wa, .share-fb {
    flex: 1;
    text-align: center;
  }
}

.loading-state {
  text-align: center;
  padding: 150px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(215, 24, 42, 0.2);
  border-top-color: var(--primary-2);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 30px;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
