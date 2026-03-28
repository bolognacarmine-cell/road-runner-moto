<script setup>
defineProps({
  selectedBrand: {
    type: String,
    default: null
  }
})

defineEmits(['select-brand'])

const brands = [
  { name: 'Honda', image: '/brands/honda.jpg' },
  { name: 'Piaggio', image: '/brands/piaggio.jpg' },
  { name: 'Kymco', image: '/brands/kymco.jpg' },
  { name: 'Moto Guzzi', image: '/brands/motoguzzi.jpg' },
  { name: 'Zontes', image: '/brands/zontes.jpg' },
  { name: 'CFMOTO', image: '/brands/cfmoto.jpg' },
  { name: 'KL', image: '/brands/kl.jpg' },
  { name: 'SYM', image: '/brands/sysm.jpg' },
  { name: 'Moto Morini', image: '/brands/motomorini.jpg' },
  { name: 'QJ MOTOR', image: '/brands/qjmotor.jpg' }
]
</script>

<template>
  <section id="marchi" class="brands-section">
    <div class="container">
      <div class="section-heading">
        <p class="section-kicker">Marchi</p>
        <h2>Marchi trattati</h2>
        <p>Seleziona un marchio per scoprire i veicoli disponibili.</p>
      </div>

      <div class="brands-grid">
        <div
          v-for="brand in brands"
          :key="brand.name"
          class="brand-pill"
          :class="{ active: selectedBrand === brand.name }"
          @click="$emit('select-brand', brand.name)"
        >
          <div 
            class="brand-image" 
            :style="{ backgroundImage: `url(${brand.image})` }"
          ></div>
          <div class="brand-overlay"></div>
          <span class="brand-name">{{ brand.name }}</span>
        </div>
      </div>

      <div class="brands-footer">
        <NuxtLink to="/blog?category=Novità%20Moto" class="btn-read-more">
          Leggi di più sulle novità dei marchi →
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.brands-section {
  padding: 40px 16px;
  background: #050505;
  color: #f5f5f5;
  scroll-margin-top: 180px; /* Margine per l'header fisso */
}

.section-heading {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 40px;
}

.section-heading h2 {
  margin: 0 0 12px;
  font-size: clamp(2rem, 4vw, 3rem);
}

.section-kicker {
  color: #ff5b6b;
  text-transform: uppercase;
  font-weight: 800;
  font-size: .85rem;
  letter-spacing: .12em;
}

.brands-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 18px;
  margin-top: 32px;
}

.brand-pill {
  position: relative;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background-color: #1a1a1a;
}

.brand-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: 85%;
  background-position: center 20%;
  background-repeat: no-repeat;
  filter: grayscale(1);
  opacity: 0;
  transition: all 0.5s ease;
  z-index: 0;
}

.brand-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
  z-index: 1;
}

.brand-name {
  position: relative;
  z-index: 2;
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 1rem;
  text-align: center;
  width: 100%;
}

.brand-pill.active .brand-image,
.brand-pill:hover .brand-image {
  opacity: 1;
  filter: grayscale(0);
  background-size: 90%;
}

.brand-pill.active,
.brand-pill:hover {
  background-color: #252525;
  border-color: #ff5b6b;
  box-shadow: 0 15px 35px rgba(215, 24, 42, 0.2);
}

.brand-pill.active {
  background-color: rgba(215, 24, 42, 0.05);
}

.brands-footer {
  margin-top: 60px;
  display: flex;
  justify-content: center;
}

.btn-read-more {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 100px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-read-more:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: #ff5b6b;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

/* Responsive */
@media (max-width: 1100px) {
  .brands-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 700px) {
  .brands-grid {
    grid-template-columns: 1fr;
  }
  
  /* Mostra sempre le immagini sui dispositivi mobili */
  .brand-image {
    opacity: 1;
    filter: grayscale(0);
    background-size: 90%;
  }
  
  .brand-pill {
    background-color: #252525;
    border-color: rgba(255, 255, 255, 0.15);
  }
}
</style>