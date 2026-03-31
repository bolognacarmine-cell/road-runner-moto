
<template>
  <div class="review-card">
    <div class="stars">
      <span v-for="i in 5" :key="i" class="star">★</span>
    </div>
    <p class="quote">"{{ text }}"</p>
    <div class="reviewer">
      <div v-if="avatar" class="avatar">
        <NuxtImg :src="avatar" :alt="author" width="40" height="40" loading="lazy" />
      </div>
      <div v-else class="avatar-placeholder">
        {{ author.charAt(0) }}
      </div>
      <span class="author">{{ author }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: String,
  author: String,
  avatar: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.review-card {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #333;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.review-card:hover {
  transform: translateY(-5px);
  border-color: #d4af37; /* Gold color for premium look */
}

.stars {
  color: #ffcc00;
  font-size: 1.2rem;
}

.quote {
  font-style: italic;
  color: #eee;
  font-size: 1.1rem;
  line-height: 1.6;
  flex-grow: 1;
}

.reviewer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.avatar, .avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-placeholder {
  background: #444;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-transform: uppercase;
}

.author {
  font-weight: 600;
  color: #fff;
  font-size: 0.9rem;
}
</style>
