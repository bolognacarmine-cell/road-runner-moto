
<template>
  <section class="portal-cta">
    <div class="container">
      <div class="portal-card">
        <div class="portal-icon">🔑</div>
        <div class="portal-info">
          <h2>Area Riservata Clienti</h2>
          <p>Hai acquistato una moto da noi? Accedi al tuo portale privato per consultare documenti, storico manutenzioni e scadenze.</p>
        </div>
        <NuxtLink to="/portale/login" class="btn-primary-custom">Accedi al tuo Veicolo</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.portal-cta {
  padding: 60px 0;
  background: var(--bg);
}

.portal-card {
  background: linear-gradient(135deg, var(--panel) 0%, #151515 100%);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 40px;
  display: flex;
  align-items: center;
  gap: 30px;
  box-shadow: var(--shadow);
}

@media (max-width: 768px) {
  .portal-card {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
  }
}

.portal-icon {
  font-size: 3rem;
  background: rgba(255, 255, 255, 0.03);
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}

.portal-info {
  flex: 1;
}

.portal-info h2 {
  font-size: 1.75rem;
  font-weight: 900;
  margin-bottom: 10px;
}

.portal-info p {
  color: var(--muted);
  font-size: 1rem;
  max-width: 600px;
}

.btn-primary-custom {
  white-space: nowrap;
}
</style>
