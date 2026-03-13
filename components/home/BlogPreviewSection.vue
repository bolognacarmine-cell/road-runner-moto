<script setup>
import { ref, onMounted } from 'vue'
import BlogCard from '~/components/blog/BlogCard.vue'

const latestPosts = ref([])
const loading = ref(true)

const fetchLatestPosts = async () => {
  try {
    const res = await $fetch('/api/blog', {
      query: { limit: 3 }
    })
    latestPosts.value = res.posts
  } catch (err) {
    console.error('Errore caricamento anteprima blog:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLatestPosts()
})
</script>

<template>
  <section class="blog-preview-section">
    <div class="container">
      <div class="section-heading">
        <p class="section-kicker">Mondo Road Runner</p>
        <div class="heading-flex">
          <h2>Ultime dal Blog</h2>
          <NuxtLink to="/blog" class="btn-link">Vedi tutti gli articoli →</NuxtLink>
        </div>
      </div>

      <div v-if="loading" class="loading-grid">
        <div v-for="i in 3" :key="i" class="skeleton-card"></div>
      </div>

      <div v-else-if="latestPosts.length > 0" class="blog-preview-grid">
        <BlogCard v-for="post in latestPosts" :key="post._id" :post="post" />
      </div>

      <div v-else class="empty-state">
        <p>Non ci sono ancora articoli nel blog.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog-preview-section {
  padding: 100px 0;
  background: var(--bg);
  border-top: 1px solid var(--line);
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

.heading-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
}

@media (max-width: 640px) {
  .heading-flex {
    flex-direction: column;
    align-items: flex-start;
  }
}

.heading-flex h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  margin: 0;
}

.btn-link {
  color: var(--primary-2);
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  transition: opacity 0.3s ease;
}

.btn-link:hover {
  opacity: 0.8;
}

.blog-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.skeleton-card {
  height: 400px;
  background: var(--panel);
  border-radius: 16px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 0.3; }
  100% { opacity: 0.6; }
}

.empty-state {
  text-align: center;
  padding: 40px;
  background: var(--panel);
  border-radius: 16px;
  color: var(--muted);
}

@media (max-width: 1024px) {
  .loading-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .loading-grid {
    grid-template-columns: 1fr;
  }
}
</style>
