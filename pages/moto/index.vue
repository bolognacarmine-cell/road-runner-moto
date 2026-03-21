
<script setup>
import { ref, onMounted } from 'vue'
import FeaturedVehicles from '~/components/home/FeaturedVehicles.vue'

const vehicles = ref([])
const loading = ref(true)
const error = ref(false)

const fetchVehicles = async () => {
  try {
    const res = await $fetch('/api/motos')
    vehicles.value = Array.isArray(res.motos) ? res.motos : []
  } catch (e) {
    console.error('Errore nel caricamento del catalogo:', e)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchVehicles()
})

useHead({
  title: 'Catalogo Veicoli | Road Runner Moto',
  meta: [
    { name: 'description', content: 'Sfoglia il nostro catalogo completo di moto e scooter nuovi e usati.' }
  ]
})
</script>

<template>
  <div class="catalog-page">
    <div class="catalog-hero">
      <div class="container">
        <h1>Catalogo Veicoli</h1>
        <p>Tutte le nostre moto e scooter pronti per te</p>
      </div>
    </div>

    <div v-if="loading" class="container py-5 text-center">
      <div class="spinner"></div>
      <p>Caricamento catalogo...</p>
    </div>

    <div v-else-if="error" class="container py-5 text-center">
      <p class="text-danger">Si è verificato un errore durante il caricamento.</p>
      <button @click="fetchVehicles" class="btn-primary-custom">Riprova</button>
    </div>

    <FeaturedVehicles v-else :vehicles="vehicles" />
  </div>
</template>

<style scoped>
.catalog-page {
  padding-top: 80px; /* Offset for header */
  background: #050505;
  min-height: 100vh;
}

.catalog-hero {
  padding: 60px 0;
  background: linear-gradient(to bottom, #111, #050505);
  text-align: center;
  border-bottom: 1px solid #222;
}

.catalog-hero h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 10px;
  color: #fff;
}

.catalog-hero p {
  color: #888;
  font-size: 1.2rem;
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.text-center {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 91, 107, 0.3);
  border-radius: 50%;
  border-top-color: #ff5b6b;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
