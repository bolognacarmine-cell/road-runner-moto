<script setup>
useHead({
  title: 'Privacy Policy | Road Runner Moto',
  meta: [
    { name: 'description', content: 'Informativa sulla privacy di Road Runner Moto. Scopri come trattiamo i tuoi dati personali in conformità al GDPR.' },
    { name: 'robots', content: 'noindex, follow' }
  ]
})
</script>

<template>
  <div class="legal-page">
    <div class="container py-20">
      <h1 class="text-4xl font-black mb-12">Privacy Policy</h1>
      
      <div class="legal-content">
        <p class="mb-6">Ultimo aggiornamento: 22 Marzo 2026</p>

        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">1. Titolare del Trattamento</h2>
          <p>Il Titolare del Trattamento dei dati è <strong>ROAD RUNNER DI TARTAGLIONE PASQUALE</strong>, con sede legale in VIA SAN FRANCESCO 13 - 81020 - CAPODRISE (CE). P.IVA: 04335610616. Email: inforoadrunner@libero.it.</p>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">2. Tipologia di dati raccolti</h2>
          <p>Attraverso questo sito web raccogliamo i seguenti dati personali:</p>
          <ul class="list-disc pl-6 mt-4 space-y-2">
            <li>Dati identificativi (Nome, Cognome)</li>
            <li>Dati di contatto (Email, Telefono)</li>
            <li>Dati relativi al veicolo (per il servizio di permuta e preventivi)</li>
            <li>Dati di navigazione (tramite cookie tecnici e analitici)</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">3. Finalità del trattamento</h2>
          <p>I dati vengono trattati per le seguenti finalità:</p>
          <ul class="list-disc pl-6 mt-4 space-y-2">
            <li>Rispondere alle richieste di preventivo o informazioni.</li>
            <li>Valutare le richieste di permuta moto.</li>
            <li>Gestire l'area riservata clienti.</li>
            <li>Adempiere agli obblighi di legge.</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">4. Base giuridica</h2>
          <p>Il trattamento si fonda sul consenso dell'interessato (per i moduli di contatto) e sull'esecuzione di misure precontrattuali o contrattuali richieste dall'utente.</p>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">5. Periodo di conservazione</h2>
          <p>I dati saranno conservati per il tempo strettamente necessario a gestire la richiesta dell'utente o secondo i termini previsti dalla legge italiana.</p>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">6. Diritti dell'interessato</h2>
          <p>Ai sensi del GDPR (Regolamento UE 2016/679), l'utente ha il diritto di:</p>
          <ul class="list-disc pl-6 mt-4 space-y-2">
            <li>Accedere ai propri dati.</li>
            <li>Chiederne la rettifica o la cancellazione.</li>
            <li>Opporsi al trattamento.</li>
            <li>Chiedere la limitazione del trattamento.</li>
            <li>Chiedere la portabilità dei dati.</li>
          </ul>
          <p class="mt-4">Per esercitare tali diritti, è possibile scrivere a inforoadrunner@libero.it.</p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legal-page {
  background: #050505;
  color: #fff;
  min-height: 100vh;
  padding-top: 120px;
}

.legal-content {
  max-width: 800px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.7);
}

.legal-content strong {
  color: #fff;
}

.legal-content h2 {
  color: #fff;
}
</style>
