<script setup>
defineProps({
  post: {
    type: Object,
    required: true
  }
})

const formatDate = (d) => new Date(d).toLocaleDateString('it-IT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const readingTime = (content) => {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
</script>

<template>
  <NuxtLink :to="`/blog/${post.slug}`" class="blog-card">
    <div class="card-image">
      <img :src="post.imageCover || '/logo-road-runner.jpg'" :alt="post.title" loading="lazy" />
      <div class="category-badge">{{ post.category }}</div>
    </div>
    <div class="card-content">
      <div class="card-meta">
        <span class="date">{{ formatDate(post.date) }}</span>
        <span class="divider">•</span>
        <span class="reading-time">{{ readingTime(post.content) }} min lettura</span>
      </div>
      <h3 class="card-title">{{ post.title }}</h3>
      <p class="card-excerpt">{{ post.excerpt || post.content.substring(0, 120) + '...' }}</p>
      <div class="card-footer">
        <span class="read-more">Leggi di più →</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.blog-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  height: 100%;
}

.blog-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary-2);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

.card-image {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.blog-card:hover .card-image img {
  transform: scale(1.1);
}

.category-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--primary);
  color: #fff;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--muted);
  margin-bottom: 12px;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 12px;
  line-height: 1.3;
  color: #fff;
}

.card-excerpt {
  font-size: 0.95rem;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
}

.read-more {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary-2);
  transition: gap 0.3s ease;
}

.blog-card:hover .read-more {
  gap: 8px;
}
</style>
