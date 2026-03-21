<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

const acceptCookies = () => {
  localStorage.setItem('cookie-consent', 'accepted')
  isVisible.value = false
}

const declineCookies = () => {
  localStorage.setItem('cookie-consent', 'declined')
  isVisible.value = false
}

onMounted(() => {
  const consent = localStorage.getItem('cookie-consent')
  if (!consent) {
    setTimeout(() => {
      isVisible.value = true
    }, 1500)
  }
})
</script>

<template>
  <Transition name="fade-up">
    <div v-if="isVisible" class="cookie-banner">
      <div class="container banner-inner">
        <div class="banner-content">
          <h3>Informativa sui Cookie 🍪</h3>
          <p>Utilizziamo cookie tecnici e analitici per migliorare la tua esperienza sul nostro sito. Puoi scegliere quali accettare o consultare la nostra <NuxtLink to="/cookie-policy">Cookie Policy</NuxtLink> per maggiori dettagli.</p>
        </div>
        <div class="banner-actions">
          <button @click="declineCookies" class="btn-decline">Rifiuta</button>
          <button @click="acceptCookies" class="btn-accept">Accetta Tutti</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1000px;
  background: rgba(15, 15, 15, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 24px 32px;
  z-index: 9999;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.banner-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.banner-content h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
}

.banner-content p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

.banner-content a {
  color: var(--primary-2);
  text-decoration: underline;
}

.banner-actions {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.btn-accept {
  background: var(--primary);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 100px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.3s;
}

.btn-accept:hover {
  transform: scale(1.05);
}

.btn-decline {
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-decline:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

/* Transitions */
.fade-up-enter-active, .fade-up-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

@media (max-width: 768px) {
  .banner-inner {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }
  .banner-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>
