import { defineEventHandler, createError } from 'h3'
import { MongoClient } from 'mongodb'
import { connectToDatabase } from '~/server/utils/mongodb'

// Dati mock per sviluppo locale senza database
const mockMotos = [
  {
    _id: '1',
    marca: 'Honda',
    modello: 'PCX 160',
    categoria: 'Scooter',
    nuovaUsata: 'nuova',
    stato: 'nuovo',
    annoImmatricolazione: 2024,
    anno: 2024,
    cilindrata: 160,
    chilometri: 0,
    prezzo: 4290,
    isVisible: true,
    slug: 'honda-pcx-160',
    immagini: [
      '/brands/honda.jpg'
    ],
    createdAt: '2024-01-15T10:00:00.000Z'
  },
  {
    _id: '2',
    marca: 'Piaggio',
    modello: 'Beverly 300',
    categoria: 'Scooter',
    nuovaUsata: 'usata',
    stato: 'usato',
    annoImmatricolazione: 2022,
    anno: 2022,
    cilindrata: 300,
    chilometri: 12500,
    prezzo: 3900,
    isVisible: true,
    slug: 'piaggio-beverly-300',
    immagini: [
      '/brands/piaggio.jpg'
    ],
    createdAt: '2024-01-14T10:00:00.000Z'
  },
  {
    _id: '3',
    marca: 'Kymco',
    modello: 'X-Town 300i',
    categoria: 'Scooter',
    nuovaUsata: 'nuova',
    stato: 'nuovo',
    annoImmatricolazione: 2024,
    anno: 2024,
    cilindrata: 300,
    chilometri: 0,
    prezzo: 4990,
    isPromotion: true,
    prezzoScontato: 4590,
    isVisible: true,
    slug: 'kymco-x-town-300i',
    immagini: [
      '/brands/kymco.jpg'
    ],
    createdAt: '2024-01-13T10:00:00.000Z'
  },
  {
    _id: '4',
    marca: 'Honda',
    modello: 'CBR 650R',
    categoria: 'Naked',
    nuovaUsata: 'usata',
    stato: 'usato',
    annoImmatricolazione: 2021,
    anno: 2021,
    cilindrata: 650,
    chilometri: 8500,
    prezzo: 7200,
    isVisible: true,
    slug: 'honda-cbr-650r',
    immagini: [
      '/brands/honda.jpg'
    ],
    createdAt: '2024-01-12T10:00:00.000Z'
  },
  {
    _id: '5',
    marca: 'Moto Guzzi',
    modello: 'V7 III Stone',
    categoria: 'Naked',
    nuovaUsata: 'usata',
    stato: 'usato',
    annoImmatricolazione: 2020,
    anno: 2020,
    cilindrata: 850,
    chilometri: 15200,
    prezzo: 6800,
    isVisible: true,
    slug: 'moto-guzzi-v7-iii-stone',
    immagini: [
      '/brands/motoguzzi.jpg'
    ],
    createdAt: '2024-01-11T10:00:00.000Z'
  },
  {
    _id: '6',
    marca: 'Piaggio',
    modello: 'Medley 150',
    categoria: 'Scooter',
    nuovaUsata: 'nuova',
    stato: 'nuovo',
    annoImmatricolazione: 2024,
    anno: 2024,
    cilindrata: 150,
    chilometri: 0,
    prezzo: 3690,
    isVisible: true,
    slug: 'piaggio-medley-150',
    immagini: [
      '/brands/piaggio.jpg'
    ],
    createdAt: '2024-01-10T10:00:00.000Z'
  }
]

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const uri = config.mongodbUri as string

  // Se non c'è MONGODB_URI configurato, restituisci dati mock
  if (!uri) {
    console.log('[API] MONGODB_URI non configurato - uso dati mock per sviluppo locale')
    return {
      motos: mockMotos
    }
  }

  // 1. Connessione al database tramite utilità centralizzata e robusta
  const { db } = await connectToDatabase()

  try {
    const collection = db.collection('motos')

    // 2. Recupera tutte le moto ordinate per data di creazione (più recenti prima)
    const motos = await collection.find({}).sort({ createdAt: -1 }).toArray()
    console.log(`[API] Recuperate ${motos.length} moto dal database.`)

    return {
      motos
    }

  } catch (error: any) {
    const errorMessage = error?.message || 'Errore sconosciuto durante il recupero delle moto'
    console.error('ERRORE API MOTOS GET:', errorMessage)

    throw createError({
      statusCode: 500,
      statusMessage: 'Errore interno del server durante il recupero dei veicoli.',
      message: errorMessage
    })
  } finally {
    // 3. Chiusura connessione (opzionale se si volesse usare il pooling,
    // ma manteniamo il comportamento originale per sicurezza)
  }
})
