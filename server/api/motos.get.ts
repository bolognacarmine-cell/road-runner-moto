import { defineEventHandler } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = new MongoClient(config.mongodbUri)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
    const collection = db.collection('motos')

    // Recupera tutte le moto ordinate per data di creazione (più recenti prima)
    const motos = await collection.find({}).sort({ createdAt: -1 }).toArray()

    return {
      motos
    }

  } catch (error) {
    console.error('Errore MongoDB (GET):', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante il recupero dei dati dal database.',
      data: error.message
    })
  } finally {
    await client.close()
  }
})
