import { defineEventHandler, getQuery, createError } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  const { id } = query

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID preventivo mancante.' })
  }

  const client = new MongoClient(config.mongodbUri)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
    
    const result = await db.collection('leads').deleteOne({ _id: new ObjectId(id as string) })

    if (result.deletedCount === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Preventivo non trovato.' })
    }

    return { success: true, message: 'Preventivo eliminato con successo.' }

  } catch (error: any) {
    console.error('ERRORE DELETE LEAD:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore durante l\'eliminazione.' })
  } finally {
    await client.close()
  }
})
