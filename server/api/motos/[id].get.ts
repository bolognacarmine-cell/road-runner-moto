
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID mancante'
    })
  }

  if (!config.mongodbUri) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configurazione database mancante.'
    })
  }

  const mongodbUri = config.mongodbUri as string
  const client = new MongoClient(mongodbUri, {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000
  })

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
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
    await client.close()
  }
})
