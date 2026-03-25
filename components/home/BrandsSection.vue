<script setup>
// Nessun dato dinamico per ora, i marchi sono statici
const brands = [
  { name: 'Honda', image: '/brands/honda.jpg' },
  { name: 'Piaggio', image: '/brands/piaggio.jpg' },
  { name: 'Kymco', image: '/brands/kymco.jpg' },
  { name: 'Suzuki', image: '/brands/suzuki.jpg' },
  { name: 'Yamaha', image: '/brands/yamaha.jpg' },
  { name: 'Moto Guzzi', image: '/brands/motoguzzi.jpg' }
]
</script>

<template>
  <section id="marchi" class="brands-section">
    <div class="container">
      <div class="section-heading">
        <p class="section-kicker">Marchi</p>
        <h2>Marchi trattati</h2>
        <p>I migliori motocicli delle marche più prestigiose, scelti per te.</p>
      </div>

      <div class="brands-grid">
        <div
          v-for="brand in brands"
          :key="brand.name"
          class="brand-pill"
          :style="{ backgroundImage: `url(${brand.image})` }"
        >
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
  min-height: 120px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.brand-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%);
  z-index: 1;
}

.brand-name {
  position: relative;
  z-index: 2;
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 1.1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.brand-pill:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.2);
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
}
</style>
<style scoped>
.brands-section {
  padding: 88px 16px;
  background: #050505;
  color: #f5f5f5;
}

.section-heading {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 40px;
}

.section-heading h2 {
  margin: 0 0 12px;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
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
  min-height: 78px;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #fff;
  text-align: center;
  padding: 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(215,24,42,.14), rgba(255,91,107,.06));
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: default;
}

.brand-pill:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0,0,0,.3);
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
}
</style>