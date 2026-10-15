
import { defineEventHandler, createError } from 'h3'
import { MongoClient } from 'mongodb'
import { connectToDatabase } from '~/server/utils/mongodb'

// Dati mock per caschi
const mockHelmets = [
  {
    _id: '1',
    marca: 'LS2',
    modello: 'FF358 Rapid',
    taglia: 'M',
    prezzo: 129,
    isVisible: true,
    immagini: ['/img/helmets/collezione (1).jpg'],
    createdAt: '2024-01-15T10:00:00.000Z'
  },
  {
    _id: '2',
    marca: 'LS2',
    modello: 'FF800 Vector',
    taglia: 'L',
    prezzo: 149,
    isVisible: true,
    immagini: ['/img/helmets/collezione (2).jpg'],
    createdAt: '2024-01-14T10:00:00.000Z'
  }
]

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const uri = config.mongodbUri as string

  // Se non c'è MONGODB_URI configurato, restituisci dati mock
  if (!uri) {
    console.log('[API] MONGODB_URI non configurato - uso dati mock per caschi')
    return {
      success: true,
      helmets: mockHelmets
    }
  }

  const { db } = await connectToDatabase()

  try {
    const collection = db.collection('helmets')

    // Recupera tutti i caschi, ordinati per creazione (più recenti prima)
    const helmets = await collection.find({}).sort({ createdAt: -1 }).toArray()

    return {
      success: true,
      helmets
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore durante il recupero dei caschi'
    })
  }
})
