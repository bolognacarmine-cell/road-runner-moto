import { defineEventHandler, getRouterParam, createError } from 'h3'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '~/server/utils/mongodb'

// Fallback locale quando il DB non è configurato (solo sviluppo)
const mockMoto = {
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
  descrizione: 'Mock moto per sviluppo locale.',
  immagini: [
    '/brands/honda.jpg'
  ],
  createdAt: '2024-01-15T10:00:00.000Z'
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID mancante'
    })
  }

  const config = useRuntimeConfig()
  const uri = (config as any).mongodbUri as string
  if (!uri) {
    if (id === '1') return { moto: mockMoto as any }
    throw createError({ statusCode: 404, statusMessage: 'Moto non trovata' })
  }

  const { db } = await connectToDatabase()

  try {
    const collection = db.collection('motos')

    const moto = await collection.findOne({ _id: new ObjectId(id) })

    if (!moto) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Moto non trovata'
      })
    }

    return {
      moto
    }

  } catch (error: any) {
    console.error('ERRORE MONGODB (SINGLE GET):', error.message)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante il recupero del veicolo.',
      message: error.message
    })
  } finally {
  }
})