import { defineEventHandler } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = new MongoClient(config.mongodbUri)

  try {
    await client.connect()
    const db = client.db('roadrunner_db')
    const collection = db.collection('motos')

    // Recupera tutte le moto ordinate per data di creazione (più recenti prima)
    const motos = await collection.find({}).sort({ createdAt: -1 }).toArray()

    return {
      statusCode: 200,
      body: {
        motos
      }
    }

  } catch (error) {
    console.error('Errore MongoDB (GET):', error)
    return {
      statusCode: 500,
      body: {
        message: 'Errore durante il recupero dei dati dal database.',
        error: error.message
      }
    }
  } finally {
    await client.close()
  }
})
