import { defineEventHandler, getRouterParam } from 'h3'
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

  const client = new MongoClient(config.mongodbUri, {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000
  })

  try {
    console.log(`Tentativo di eliminazione moto ${id}...`)
    await client.connect()
    const db = client.db(config.mongodbDbName)
    const collection = db.collection('motos')

    // Elimina il documento tramite ID
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Moto non trovata'
      })
    }

    return {
      message: 'Moto eliminata con successo'
    }

  } catch (error) {
    console.error('Errore MongoDB (DELETE):', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante l\'eliminazione',
      message: error.message
    })
  } finally {
    await client.close()
  }
})
