import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const demoPosts = [
  {
    title: "Notizie Moto: Nuovi Modelli e Innovazioni Tecnologiche 2026",
    slug: "notizie-moto-nuovi-modelli-2026",
    category: "Nuove Moto",
    imageCover: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=2070&auto=format&fit=crop",
    excerpt: "Scopri le ultime tendenze del settore moto: dai motori Euro 5+ alle innovazioni su sicurezza e connettività.",
    content: `# Notizie Moto: Nuovi Modelli e Innovazioni Tecnologiche

Il mondo delle due ruote sta attraversando una fase di trasformazione senza precedenti. Nel 2026, l'attenzione dei costruttori è focalizzata su un equilibrio perfetto tra prestazioni pure, sostenibilità ambientale e sicurezza proattiva. Che tu sia un amante delle naked cattive, un viaggiatore instancabile in sella a una crossover o un pendolare urbano su scooter, le novità di quest'anno promettono di rivoluzionare la tua esperienza di guida.

## Tendenze e Nuovi Modelli in Arrivo

I listini dei principali produttori si arricchiscono di modelli sempre più sofisticati. Vediamo una forte spinta verso i motori **Euro 5+**, che non solo riducono le emissioni ma ottimizzano l'erogazione grazie a una gestione elettronica affinata. Le crossover continuano a dominare il mercato, ma assistiamo a un ritorno prepotente delle medie cilindrate, agili e divertenti, ideali per chi cerca il massimo piacere di guida senza eccessi.

## Elettronica, Sicurezza e Comfort: La Nuova Frontiera

La vera rivoluzione avviene sotto la carena. Le innovazioni tecnologiche oggi riguardano principalmente:
- **Sistemi di assistenza alla guida (ARAS):** Radar anteriori e posteriori per il cruise control adattivo e il monitoraggio dell'angolo cieco.
- **Piattaforme inerziali (IMU) a 6 assi:** Gestione millimetrica di ABS Cornering e Traction Control.
- **Connettività Smartphone:** Display TFT sempre più grandi con navigazione cartografica integrata e gestione chiamate/musica.
- **Sospensioni Semi-attive:** Regolazione in tempo reale dello smorzamento per adattarsi a ogni tipo di fondo stradale.

## Perché queste novità interessano chi vuole comprare una moto oggi

Investire in un modello di ultima generazione significa non solo avere un mezzo più performante, ma soprattutto più sicuro. Le nuove tecnologie riducono drasticamente il rischio di incidenti e aumentano il comfort nei lunghi viaggi, rendendo la moto un mezzo godibile in ogni condizione.

Passa a trovarci da **Road Runner Moto** per scoprire dal vivo queste innovazioni e prenotare un test ride sui nuovi modelli 2026!

*Ti è piaciuto questo articolo? Leggi anche le nostre guide sulla manutenzione o scopri i prossimi raduni nella sezione Mondo Biker.*`,
    date: new Date(),
    autore: "Road Runner Team",
    relatedMotos: []
  },
  {
    title: "Codice della Strada: Aggiornamenti Normativi per Motociclisti",
    slug: "aggiornamenti-codice-strada-moto",
    category: "Codice della Strada",
    imageCover: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=2070&auto=format&fit=crop",
    excerpt: "Guida aggiornata sulle nuove regole del Codice della Strada: casco, sicurezza e sanzioni per chi guida una moto.",
    content: `# Codice della Strada: Cosa Cambia per chi Guida una Moto

Rimanere aggiornati sulle normative è fondamentale per ogni motociclista, non solo per evitare sanzioni, ma soprattutto per garantire la propria sicurezza e quella degli altri utenti della strada. In questo articolo analizziamo le ultime novità legislative che interessano il mondo delle due ruote.

## Cosa Cambia: Le Nuove Regole

Le recenti modifiche al Codice della Strada hanno introdotto norme più stringenti per la circolazione. L'obiettivo è chiaro: ridurre il numero di sinistri che coinvolgono utenti vulnerabili. Particolare attenzione è stata posta alla gestione del traffico urbano e all'utilizzo di dispositivi tecnologici durante la guida.

## Le Regole che Riguardano i Motociclisti

Ecco i punti chiave da tenere a mente:
- **Dispositivi di Protezione:** L'obbligo del casco è ovviamente confermato, ma si discute sempre più di standard omologativi più elevati (ECE 22.06) e dell'importanza dell'abbigliamento tecnico certificato.
- **Comportamento nel Traffico:** Sorpassi azzardati e circolazione in corsie non consentite sono soggetti a controlli più frequenti. La guida prudente non è solo un consiglio, ma un obbligo normativo.
- **Documentazione:** Assicurati di avere sempre con te patente, libretto di circolazione e certificato di assicurazione (anche in formato digitale).

## Sanzioni e Controlli

Le sanzioni per l'utilizzo del cellulare alla guida o per la guida sotto l'effetto di sostanze sono state inasprite. Anche la revisione periodica del veicolo è monitorata con maggiore rigore attraverso sistemi elettronici di lettura targa.

## Come Evitare Errori alla Guida

La conoscenza della norma è il primo passo per una guida serena. Rispetta sempre le precedenze, mantieni la distanza di sicurezza e adegua la velocità alle condizioni del fondo stradale e del traffico.

### 5 Consigli Pratici per Guidare in Regola:
1. Controlla sempre la scadenza di revisione e assicurazione.
2. Usa solo caschi con omologazione recente e ben allacciati.
3. Segnala ogni manovra con gli indicatori di direzione in anticipo.
4. Non sostare mai negli angoli ciechi dei mezzi pesanti.
5. Mantieni la calma anche nel traffico più intenso.

*Nota: Le normative possono subire ulteriori variazioni. Ti invitiamo a consultare sempre i canali ufficiali del Ministero delle Infrastrutture e dei Trasporti per gli aggiornamenti in tempo reale.*`,
    date: new Date(Date.now() - 86400000),
    autore: "Road Runner Team",
    relatedMotos: []
  },
  {
    title: "Sicurezza in Moto: Consigli di Guida e Manutenzione Essenziale",
    slug: "sicurezza-moto-guida-manutenzione",
    category: "Sicurezza e Manutenzione",
    imageCover: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=2000&auto=format&fit=crop",
    excerpt: "La sicurezza inizia dal box. Scopri i controlli pre-partenza e le abitudini di guida che salvano la vita.",
    content: `# Sicurezza in Moto: La Tua Guida Pratica

Essere un motociclista consapevole significa sapere che la sicurezza dipende da tre fattori: lo stato del mezzo, l'equipaggiamento e lo stile di guida. In questa guida pratica, esploriamo come minimizzare i rischi e massimizzare il piacere di ogni uscita.

## Controlli da Fare Prima di Partire

Non salire mai in sella senza aver dato un'occhiata veloce ma attenta alla tua moto. Bastano pochi minuti per prevenire problemi seri:
- **Pneumatici:** Controlla la pressione (a freddo) e l'usura del battistrada. Gomme sgonfie o troppo usurate compromettono la tenuta in curva.
- **Luci:** Verifica il funzionamento di fari, stop e frecce. Vedere ed essere visti è vitale.
- **Liquidi:** Un rapido controllo al livello dell'olio e del liquido di raffreddamento può salvarti da guasti meccanici costosi.

## Manutenzione che Aiuta a Prevenire Problemi

Oltre ai controlli quotidiani, la manutenzione regolare è la tua migliore alleata:
- **Freni:** Monitora lo stato delle pastiglie e la risposta della leva. Se senti vibrazioni o rumori anomali, corri in officina.
- **Trasmissione:** La catena deve essere pulita, ingrassata e tensionata correttamente ogni 500-1000 km.
- **Batteria:** Se la moto resta ferma spesso, usa un mantenitore di carica per evitare brutte sorprese all'avvio.

## Abitudini di Guida che Aumentano la Sicurezza

La strada non è una pista. Adottare uno stile di guida difensivo è fondamentale:
- **Distanza di Sicurezza:** Mantieni sempre lo spazio necessario per una frenata d'emergenza.
- **Sguardo:** Guarda sempre lontano, verso la fine della curva, non davanti alla ruota.
- **Equipaggiamento:** Anche per brevi tragitti, indossa sempre guanti, giacca con protezioni e scarpe adatte.

### Checklist Essenziale Pre-Partenza:
- [ ] Pressione pneumatici corretta
- [ ] Livello olio motore
- [ ] Funzionamento luci e frecce
- [ ] Tensione catena
- [ ] Casco pulito e visiera integra

La prevenzione è il segreto per godersi la strada per molti anni. Ti aspettiamo da **Road Runner Moto** per un check-up completo della tua moto!`,
    date: new Date(Date.now() - 86400000 * 2),
    autore: "Road Runner Team",
    relatedMotos: []
  },
  {
    title: "Guide per Motociclisti: Come Scegliere l'Abbigliamento Tecnico",
    slug: "guida-abbigliamento-tecnico-moto",
    category: "Guide per Motociclisti",
    imageCover: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop",
    excerpt: "Pelle o tessuto? Casco integrale o modulare? La nostra guida alla scelta dell'equipaggiamento perfetto.",
    content: `# Guida all'Abbigliamento Tecnico: Protezione con Stile

Scegliere l'abbigliamento giusto non è solo una questione di estetica, ma di sicurezza attiva e passiva. La tecnologia dei materiali ha fatto passi da gigante, offrendo oggi capi protettivi, confortevoli e adatti a ogni stagione.

## Il Casco: Il Tuo Primo Alleato

Il casco è l'elemento più importante. Scegli sempre un modello con omologazione **ECE 22.06**. L'integrale offre la massima protezione, mentre il modulare è ideale per il mototurismo grazie alla sua versatilità. Assicurati che la taglia sia corretta: non deve stringere troppo ma nemmeno muoversi.

## Pelle vs Tessuto

- **Pelle:** Offre la massima resistenza all'abrasione. È la scelta d'elezione per la guida sportiva e in pista.
- **Tessuto (Cordura, Gore-Tex):** Più versatile, spesso impermeabile e traspirante. Ideale per il turismo e l'uso quotidiano grazie alle membrane rimovibili.

## Protezioni e Airbag

Non dimenticare mai il paraschiena, spesso sottovalutato ma fondamentale. Oggi i sistemi **Airbag elettronici** sono diventati accessibili e offrono un livello di protezione nettamente superiore a qualsiasi imbottitura tradizionale.

Passa nel nostro store per provare le ultime collezioni e farti consigliare dai nostri esperti!`,
    date: new Date(Date.now() - 86400000 * 3),
    autore: "Road Runner Team",
    relatedMotos: []
  },
  {
    title: "Mobilità Urbana: Perché Scegliere uno Scooter Elettrico nel 2026",
    slug: "mobilita-urbana-scooter-elettrici-2026",
    category: "Scooter e Mobilità Urbana",
    imageCover: "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2024&auto=format&fit=crop",
    excerpt: "Vantaggi, autonomia e incentivi: tutto quello che devi sapere sulla rivoluzione elettrica in città.",
    content: `# La Rivoluzione della Mobilità Urbana

Muoversi in città sta cambiando. Il traffico, le zone a emissioni limitate e il costo del carburante stanno spingendo sempre più utenti verso soluzioni di mobilità elettrica.

## I Vantaggi dell'Elettrico

Gli scooter elettrici di ultima generazione offrono prestazioni paragonabili ai 125cc termici, con il vantaggio di una coppia immediata che li rende agilissimi nel traffico. I costi di manutenzione sono ridotti al minimo e il "pieno" si fa comodamente a casa.

## Autonomia e Ricarica

Le batterie estraibili hanno risolto il problema della ricarica per chi non ha un garage. L'autonomia media urbana si attesta ormai intorno ai 70-100 km, più che sufficienti per diversi giorni di commuting cittadino.

## Incentivi e Risparmio

Grazie agli ecoincentivi statali, l'acquisto di uno scooter elettrico è oggi estremamente vantaggioso. Se a questo aggiungi l'esenzione dal bollo per 5 anni e il risparmio su assicurazione e carburante, il ritorno dell'investimento è rapidissimo.

Scopri la nostra gamma elettrica da **Road Runner Moto** e rivoluziona il tuo modo di vivere la città!`,
    date: new Date(Date.now() - 86400000 * 4),
    autore: "Road Runner Team",
    relatedMotos: []
  },
  {
    title: "Evento: Raduno Road Runner 2026",
    slug: "raduno-road-runner-2026",
    category: "Eventi",
    imageCover: "https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=2024&auto=format&fit=crop",
    excerpt: "Torna l'appuntamento più atteso dell'anno. Unisciti a noi per una giornata di curve e passione.",
    content: "# Raduno Road Runner Moto 2026\n\nSiete pronti a scaldare i motori? Il raduno annuale si terrà il prossimo 15 Maggio.\n\n## Il Percorso\n\nPartiremo dalla nostra sede a Capodrise per un tour panoramico che ci porterà tra i monti del Matese.\n\n## Programma:\n- 09:00 Ritrovo e colazione in sede\n- 10:30 Partenza tour\n- 13:30 Pranzo convenzionato\n- 16:00 Premiazioni e saluti",
    date: new Date(Date.now() - 86400000 * 5),
    autore: "Road Runner Team",
    relatedMotos: []
  }
];

async function seedBlog() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI non trovata nel .env');
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME || 'roadrunner_db');
    const collection = db.collection('blog_posts');

    // Svuota collezione esistente (opzionale)
    // await collection.deleteMany({});

    // Inserisci solo se vuoto o aggiungi nuovi
    for (const post of demoPosts) {
      // Usiamo il titolo come chiave per trovare se esiste, ma aggiorniamo sempre lo slug
      const exists = await collection.findOne({ title: post.title });
      if (!exists) {
        await collection.insertOne(post);
        console.log(`✅ Articolo inserito: ${post.title}`);
      } else {
        await collection.updateOne(
          { title: post.title }, 
          { $set: { slug: post.slug, content: post.content, imageCover: post.imageCover } }
        );
        console.log(`ℹ️ Articolo aggiornato (slug & content): ${post.title}`);
      }
    }

    console.log('\n--- SEED BLOG COMPLETATO ---');
  } catch (err) {
    console.error('Errore durante il seed:', err);
  } finally {
    await client.close();
  }
}

seedBlog();
