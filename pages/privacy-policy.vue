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
            <li><strong>Dati identificativi:</strong> Nome, Cognome, Indirizzo (per valutazioni permuta).</li>
            <li><strong>Dati di contatto:</strong> Email, numero di telefono (WhatsApp incluso).</li>
            <li><strong>Dati del veicolo:</strong> Marca, modello, anno, km, condizioni d'uso e immagini caricate dall'utente per il servizio di permuta.</li>
            <li><strong>Dati di navigazione:</strong> Indirizzo IP, tipo di browser, dati di log tramite cookie tecnici e analitici anonimizzati.</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">3. Finalità del trattamento</h2>
          <p>I dati vengono trattati esclusivamente per le seguenti finalità:</p>
          <ul class="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Gestione Richieste:</strong> Fornire preventivi personalizzati e consulenza su moto nuove e usate.</li>
            <li><strong>Servizio Permuta:</strong> Valutazione tecnica del veicolo usato proposto in permuta, inclusa l'analisi delle foto caricate.</li>
            <li><strong>Assistenza Clienti:</strong> Supporto tramite form contatti o pulsanti rapidi WhatsApp.</li>
            <li><strong>Obblighi Legali:</strong> Adempimento di obblighi fiscali, contabili e normativi (es. normativa anti-riciclaggio per compravendita veicoli).</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">7. Proprietà Intellettuale e Marchi</h2>
          <p>Tutti i contenuti presenti sul sito (testi, grafiche, loghi, icone, immagini) sono di proprietà di <strong>Road Runner Moto</strong> o dei rispettivi proprietari dei marchi citati (es. marchi motociclistici). È vietata la riproduzione, anche parziale, senza autorizzazione scritta. Le immagini dei veicoli caricate dagli utenti nel form permuta rimangono di proprietà degli stessi ma vengono concesse in uso temporaneo per la sola finalità di valutazione tecnica.</p>
        </section>

        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">4. Base giuridica e Trasferimenti extra-UE</h2>
          <p>Il trattamento si fonda sul consenso dell'interessato e sull'esecuzione di misure precontrattuali o contrattuali.</p>
          <p class="mt-4">Per quanto riguarda i servizi di terze parti (es. Google Analytics 4, Google Maps), informiamo che i dati potrebbero essere trasferiti verso server situati negli Stati Uniti (USA). Tali trasferimenti sono disciplinati dal <strong>Data Privacy Framework (DPF)</strong> e dalle <strong>Clausole Contrattuali Standard (SCC)</strong>, unitamente all'adozione di misure tecniche quali l'<strong>IP Masking</strong> (anonimizzazione dell'indirizzo IP) per minimizzare l'identificabilità dell'utente fuori dallo Spazio Economico Europeo (SEE).</p>
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
