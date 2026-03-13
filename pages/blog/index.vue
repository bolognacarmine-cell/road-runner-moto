<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BlogCard from '~/components/blog/BlogCard.vue'

const route = useRoute()
const posts = ref([])
const total = ref(0)
const page = ref(1)
const totalPages = ref(1)
const loading = ref(true)
const selectedCategory = ref(route.query.category || 'Tutti')
const searchQuery = ref(route.query.search || '')

const categories = ['Tutti', 'Novità Moto', 'Manutenzione', 'Consigli Guida', 'Offerte', 'Eventi']

const fetchPosts = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/blog', {
      query: {
        category: selectedCategory.value,
        search: searchQuery.value,
        page: page.value,
        limit: 9
      }
    })
    posts.value = res.posts
    total.value = res.total
    totalPages.value = res.totalPages
  } catch (err) {
    console.error('Errore caricamento blog:', err)
  } finally {
    loading.value = false
  }
}

// Watchers per aggiornare la lista al cambio di filtri o pagina
watch([selectedCategory, page], () => {
  fetchPosts()
})

// Gestione dei parametri URL
watch(() => route.query, (newQuery) => {
  if (newQuery.category && newQuery.category !== selectedCategory.value) {
    selectedCategory.value = newQuery.category
  }
  if (newQuery.search !== undefined && newQuery.search !== searchQuery.value) {
    searchQuery.value = newQuery.search
  }
}, { deep: true })

// Debounce per la ricerca
let searchTimeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchPosts()
  }, 500)
})

onMounted(() => {
  fetchPosts()
})

useHead({
  title: 'Blog & News | Road Runner Moto',
  meta: [
    { name: 'description', content: 'Ultime novità dal mondo delle moto, consigli di manutenzione e offerte speciali da Road Runner Moto.' }
  ]
})
</script>

<template>
  <div class="blog-index-page">
    <!-- Hero Section -->
    <section class="blog-hero">
      <div class="container">
        <div class="hero-content">
          <span class="badge">News & Insights</span>
          <h1>Mondo Road Runner</h1>
          <p>Rimani aggiornato su novità, tecnica e passioni a due ruote.</p>
        </div>
      </div>
    </section>

    <!-- Filtri e Ricerca -->
    <section class="blog-filters">
      <div class="container">
        <div class="filters-shell">
          <div class="categories-list">
            <button 
              v-for="cat in categories" 
              :key="cat"
              :class="{ active: selectedCategory === cat }"
              @click="selectedCategory = cat; page = 1"
            >
              {{ cat }}
            </button>
          </div>
          <div class="search-box">
            <input v-model="searchQuery" type="text" placeholder="Cerca articoli..." />
            <span class="search-icon">🔍</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Elenco Articoli -->
    <section class="blog-grid-section">
      <div class="container">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Caricamento articoli...</p>
        </div>

        <div v-else-if="posts.length === 0" class="empty-state">
          <h3>Nessun articolo trovato</h3>
          <p>Prova a cambiare i filtri o la query di ricerca.</p>
          <button @click="selectedCategory = 'Tutti'; searchQuery = ''; page = 1" class="btn-secondary-custom">
            Resetta filtri
          </button>
        </div>

        <div v-else class="blog-grid">
          <BlogCard v-for="post in posts" :key="post._id" :post="post" />
        </div>

        <!-- Paginazione -->
        <div v-if="totalPages > 1" class="pagination">
          <button 
            :disabled="page === 1" 
            @click="page--"
            class="btn-page"
          >
            ←
          </button>
          <span class="page-info">Pagina {{ page }} di {{ totalPages }}</span>
          <button 
            :disabled="page === totalPages" 
            @click="page++"
            class="btn-page"
          >
            →
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.blog-index-page {
  background: var(--bg);
  min-height: 100vh;
  padding-bottom: 100px;
}

.blog-hero {
  padding: 120px 0 60px;
  background: linear-gradient(to bottom, #111 0%, var(--bg) 100%);
  text-align: center;
}

.hero-content h1 {
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 900;
  margin: 10px 0 20px;
  letter-spacing: -0.02em;
}

.badge {
  color: var(--primary-2);
  text-transform: uppercase;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
}

.hero-content p {
  color: var(--muted);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.blog-filters {
  position: sticky;
  top: 90px;
  z-index: 100;
  padding: 20px 0;
  background: rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
  margin-bottom: 60px;
}

.filters-shell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

@media (max-width: 900px) {
  .filters-shell {
    flex-direction: column;
    align-items: stretch;
  }
}

.categories-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;
  scrollbar-width: none;
}

.categories-list::-webkit-scrollbar { display: none; }

.categories-list button {
  background: var(--panel);
  border: 1px solid var(--line);
  color: var(--muted);
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
}

.categories-list button:hover {
  border-color: var(--primary-2);
}

.categories-list button.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.search-box {
  position: relative;
  min-width: 300px;
}

.search-box input {
  width: 100%;
  background: var(--panel-2);
  border: 1px solid var(--line);
  padding: 10px 40px 10px 16px;
  border-radius: 12px;
  color: #fff;
  outline: none;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 100px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(215, 24, 42, 0.2);
  border-top-color: var(--primary-2);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.pagination {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.btn-page {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--panel);
  border: 1px solid var(--line);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.btn-page:hover:not(:disabled) {
  border-color: var(--primary-2);
  background: var(--panel-2);
}

.btn-page:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: var(--muted);
  font-weight: 600;
}
</style>
