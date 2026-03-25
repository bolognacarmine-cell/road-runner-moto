import { defineEventHandler, getQuery, createError } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  const { id } = query

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID permuta mancante.' })
  }

  const client = new MongoClient(config.mongodbUri)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
    
    const result = await db.collection('tradeins').deleteOne({ _id: new ObjectId(id as string) })

    if (result.deletedCount === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Permuta non trovata.' })
    }

    return { success: true, message: 'Richiesta di permuta eliminata con successo.' }

  } catch (error: any) {
    console.error('ERRORE DELETE TRADE-IN:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore durante l\'eliminazione.' })
  } finally {
    await client.close()
  }
})
