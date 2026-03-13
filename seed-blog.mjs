import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const demoPosts = [
  {
    title: "Le Novità Honda 2026: Cosa Aspettarsi",
    slug: "novita-honda-2026",
    category: "Novità Moto",
    imageCover: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=2070&auto=format&fit=crop",
    excerpt: "Scopriamo insieme tutte le anteprime del brand giapponese per la stagione 2026. Nuovi motori e design rivoluzionari.",
    content: "# Novità Honda 2026\n\nHonda continua a stupire il mondo delle due ruote con una lineup per il 2026 che promette di ridefinire gli standard di performance e sostenibilità.\n\n## La Nuova Hornet 1000\n\nUno dei modelli più attesi è sicuramente la nuova Hornet 1000, che eredita il motore della CBR1000RR-R ma con una taratura pensata per il divertimento stradale.\n\n### Caratteristiche Tecniche:\n- Potenza: 152 CV\n- Coppia: 110 Nm\n- Peso: 195 kg\n\n## Manutenzione e Affidabilità\n\nRicordiamo a tutti i nostri clienti che la manutenzione regolare è fondamentale per mantenere queste prestazioni nel tempo. Venite a trovarci a Capodrise per un controllo gratuito.",
    date: new Date(),
    autore: "Road Runner Team",
    relatedMotos: []
  },
  {
    title: "Guida alla Manutenzione Invernale dello Scooter",
    slug: "manutenzione-scooter-inverno",
    category: "Manutenzione",
    imageCover: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=2070&auto=format&fit=crop",
    excerpt: "L'inverno è alle porte. Ecco 5 consigli fondamentali per non farti trovare impreparato dal freddo.",
    content: "# Proteggi il tuo Scooter in Inverno\n\nIl freddo e l'umidità sono i nemici numero uno del tuo scooter. Segui questa guida per evitare brutte sorprese alla ripartenza.\n\n## 1. La Batteria\n\nIn inverno la batteria perde efficienza. Se non usi lo scooter per più di una settimana, usa un mantenitore di carica.\n\n## 2. Liquido Raffreddamento\n\nAssicurati che il livello del liquido sia corretto e che contenga l'antigelo necessario.\n\n## 3. Pneumatici\n\nControlla la pressione: con il freddo tende a scendere velocemente.",
    date: new Date(Date.now() - 86400000 * 2),
    autore: "Road Runner Team",
    relatedMotos: []
  },
  {
    title: "5 Consigli per la Guida in Sicurezza in Città",
    slug: "guida-sicurezza-citta",
    category: "Consigli Guida",
    imageCover: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=2000&auto=format&fit=crop",
    excerpt: "Muoversi nel traffico richiede attenzione e tecnica. Scopri come migliorare la tua sicurezza quotidiana.",
    content: "# Guida Sicura nel Traffico\n\nLa città è un ambiente ostile per il motociclista. Ecco come navigare nel traffico di Caserta e provincia in totale sicurezza.\n\n## La Posizione in Sella\n\nTieni sempre le dita sulla leva del freno anteriore. Quei decimi di secondo risparmiati possono fare la differenza.\n\n## Angoli Ciechi\n\nMai sostare negli angoli ciechi delle auto. Se non vedi gli occhi del conducente nello specchietto, lui non vede te.",
    date: new Date(Date.now() - 86400000 * 5),
    autore: "Road Runner Team",
    relatedMotos: []
  },
  {
    title: "Super Offerte Usato: Occasioni da non Perdere",
    slug: "offerte-usati-marzo",
    category: "Offerte",
    imageCover: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop",
    excerpt: "Questo mese abbiamo selezionato per voi 10 moto usate garantite con prezzi incredibili.",
    content: "# Occasioni Usato Road Runner\n\nIl nostro parco usato si rinnova! Tutte le moto sono sottoposte a 50 controlli tecnici prima della consegna.\n\n## Garanzia 12 Mesi\n\nOgni veicolo usato acquistato presso Road Runner Moto include 12 mesi di garanzia legale di conformità.\n\n### Modelli Disponibili:\n- Honda SH 150 (2022)\n- Piaggio Beverly 300 (2021)\n- Yamaha MT-07 (2023)\n\nPassa in sede per un test ride!",
    date: new Date(Date.now() - 86400000 * 10),
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
    date: new Date(Date.now() - 86400000 * 15),
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
      const exists = await collection.findOne({ slug: post.slug });
      if (!exists) {
        await collection.insertOne(post);
        console.log(`✅ Articolo inserito: ${post.title}`);
      } else {
        console.log(`ℹ️ Articolo già esistente: ${post.title}`);
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
