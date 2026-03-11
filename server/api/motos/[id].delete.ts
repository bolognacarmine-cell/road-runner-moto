import { defineEventHandler, getRouterParam } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    return { statusCode: 400, body: { message: 'ID mancante' } }
  }

  const client = new MongoClient(config.mongodbUri)

  try {
    await client.connect()
    const db = client.db('roadrunner_db')
    const collection = db.collection('motos')

    // Elimina il documento tramite ID
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return { statusCode: 404, body: { message: 'Moto non trovata' } }
    }

    return {
      statusCode: 200,
      body: { message: 'Moto eliminata con successo' }
    }

  } catch (error) {
    console.error('Errore MongoDB (DELETE):', error)
    return {
      statusCode: 500,
      body: { message: 'Errore durante l\'eliminazione', error: error.message }
    }
  } finally {
    await client.close()
  }
})
