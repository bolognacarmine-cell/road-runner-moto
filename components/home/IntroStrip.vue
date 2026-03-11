<template>
  <section class="intro-strip">
    <div class="intro-grid">
      <div class="intro-card">
        <strong>Vendita</strong>
        <span>Moto e scooter nuovi e usati plurimarche</span>
      </div>
      <div class="intro-card">
        <strong>Assistenza</strong>
        <span>Servizi qualificati di manutenzione e supporto</span>
      </div>
      <div class="intro-card">
        <strong>Ricambi</strong>
        <span>Ricambi originali per qualità e compatibilità</span>
      </div>
    </div>
  </section>
</template>

<script setup>
// Logica futura qui
</script>

<style scoped>
.intro-strip {
  padding: 60px 16px;
  background: #050505;
  color: #f5f5f5;
}

.intro-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
}

.intro-card {
  padding: 24px;
  background: #101010;
  border-radius: 18px;
  text-align: center;
  border: 1px solid rgba(255,255,255,.08);
}

.intro-card strong {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.intro-card span {
  color: #bdbdbd;
}
</style>