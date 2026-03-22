<script setup>
useHead({
  title: 'Cookie Policy | Road Runner Moto',
  meta: [
    { name: 'description', content: 'Informativa sui cookie di Road Runner Moto. Gestione del consenso e tipologie di cookie utilizzati.' },
    { name: 'robots', content: 'noindex, follow' }
  ]
})
</script>

<template>
  <div class="legal-page">
    <div class="container py-20">
      <h1 class="text-4xl font-black mb-12">Cookie Policy</h1>
      
      <div class="legal-content">
        <p class="mb-6">Ultimo aggiornamento: 22 Marzo 2026</p>

        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">1. Cosa sono i cookie</h2>
          <p>I cookie sono piccoli file di testo che i siti visitati dall'utente inviano al suo terminale, dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla successiva visita del medesimo utente.</p>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">2. Tipologia di cookie utilizzati</h2>
          <p class="mb-4">In conformità alle Linee Guida Garante Privacy 2021, questo sito utilizza cookie granulari classificati come segue:</p>
          
          <div class="overflow-x-auto mb-8">
            <table class="w-full text-sm border-collapse border border-white/10">
              <thead>
                <tr class="bg-white/5">
                  <th class="border border-white/10 p-3 text-left">Nome Cookie</th>
                  <th class="border border-white/10 p-3 text-left">Fornitore</th>
                  <th class="border border-white/10 p-3 text-left">Finalità</th>
                  <th class="border border-white/10 p-3 text-left">Durata</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-white/10 p-3">cookie-consent</td>
                  <td class="border border-white/10 p-3">Proprio (Road Runner)</td>
                  <td class="border border-white/10 p-3">Memorizza le preferenze sul consenso cookie</td>
                  <td class="border border-white/10 p-3">1 anno</td>
                </tr>
                <tr>
                  <td class="border border-white/10 p-3">_ga, _gid</td>
                  <td class="border border-white/10 p-3">Google Analytics</td>
                  <td class="border border-white/10 p-3">Analitici (IP Anonimizzato)</td>
                  <td class="border border-white/10 p-3">2 anni / 24 ore</td>
                </tr>
                <tr>
                  <td class="border border-white/10 p-3">NID, CONSENT</td>
                  <td class="border border-white/10 p-3">Google (Maps/YouTube)</td>
                  <td class="border border-white/10 p-3">Preferenze e profilazione (previo consenso)</td>
                  <td class="border border-white/10 p-3">6 mesi</td>
                </tr>
              </tbody>
            </table>
          </div>

          <ul class="list-disc pl-6 space-y-4">
            <li>
              <strong>Cookie Tecnici e di Sessione:</strong>
              <p>Strettamente necessari per il funzionamento del sito. Non richiedono consenso preventivo (es. gestione login, sicurezza).</p>
            </li>
            <li>
              <strong>Cookie Analitici (Google Analytics 4):</strong>
              <p>Utilizzati con <strong>IP Masking</strong> attivo (anonimizzazione) e senza incrocio di dati con altre proprietà Google. Sono equiparati ai tecnici secondo le attuali interpretazioni del Garante se configurati correttamente.</p>
            </li>
            <li>
              <strong>Cookie di Terze Parti (Social/Maps):</strong>
              <p>Installati solo dopo click esplicito su "Accetta tutto" o interazione con il componente. <a href="https://policies.google.com/technologies/cookies" target="_blank" class="underline">Policy Google</a>.</p>
            </li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">3. Gestione del consenso</h2>
          <p>Tramite il banner presente al primo accesso, l'utente può scegliere quali categorie di cookie accettare. Le preferenze possono essere modificate in ogni momento cancellando i cookie del browser.</p>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">4. Come disabilitare i cookie dal browser</h2>
          <p>L'utente può configurare il proprio browser per rifiutare i cookie o per segnalare quando ne viene inviato uno:</p>
          <ul class="list-disc pl-6 mt-4 space-y-2">
            <li>Google Chrome</li>
            <li>Mozilla Firefox</li>
            <li>Apple Safari</li>
            <li>Microsoft Edge</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">5. Titolare del Trattamento e Dati Fiscali</h2>
          <p>Il Titolare del Trattamento è <strong>ROAD RUNNER DI TARTAGLIONE PASQUALE</strong>.</p>
          <ul class="list-disc pl-6 mt-4 space-y-1">
            <li><strong>Sede Legale:</strong> Via San Francesco 13, 81020 Capodrise (CE)</li>
            <li><strong>P.IVA:</strong> 04335610616</li>
            <li><strong>REA:</strong> 318460</li>
            <li><strong>Email:</strong> inforoadrunner@libero.it</li>
          </ul>
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
