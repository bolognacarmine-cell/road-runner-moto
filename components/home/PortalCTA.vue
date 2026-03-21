
<template>
  <section class="portal-section">
    <div class="container">
      <div class="portal-card">
        <div class="portal-icon-wrapper">
          <div class="portal-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
        </div>
        <div class="portal-content">
          <span class="portal-badge">Esclusivo per i Clienti</span>
          <h2 class="portal-title">Il Tuo Garage Digitale</h2>
          <p class="portal-description">Accedi all'area riservata per gestire la tua moto, visualizzare lo storico manutenzioni e ricevere promemoria sulle scadenze.</p>
        </div>
        <div class="portal-action">
          <NuxtLink to="/portale/login" class="btn-primary-custom">
            Area Clienti
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.portal-section {
  padding: 60px 0;
  background: var(--bg);
}

.portal-card {
  background: linear-gradient(135deg, rgba(225, 29, 72, 0.1), transparent), var(--panel);
  border: 1px solid var(--line);
  border-radius: 32px;
  padding: 60px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 48px;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.portal-card::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: var(--primary);
  filter: blur(150px);
  opacity: 0.1;
  pointer-events: none;
}

@media (max-width: 1024px) {
  .portal-card {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 48px 32px;
    gap: 32px;
  }
}

.portal-icon-wrapper {
  display: flex;
  justify-content: center;
}

.portal-icon {
  width: 80px;
  height: 80px;
  background: rgba(225, 29, 72, 0.1);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  border: 1px solid rgba(225, 29, 72, 0.2);
}

.portal-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(225, 29, 72, 0.1);
  color: var(--primary-2);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.portal-title {
  font-size: 2.25rem;
  line-height: 1.2;
  margin-bottom: 16px;
}

.portal-description {
  color: var(--muted);
  font-size: 1.125rem;
  max-width: 500px;
}

.portal-action {
  display: flex;
  justify-content: center;
}

.ml-2 {
  margin-left: 8px;
}
</style>
