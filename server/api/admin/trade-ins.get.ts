
import { defineEventHandler, createError } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  if (!config.mongodbUri) {
    throw createError({ statusCode: 500, statusMessage: 'Database non configurato.' })
  }

  const client = new MongoClient(config.mongodbUri as string)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
    const collection = db.collection('tradeins')

    const tradeIns = await collection.find({}).sort({ createdAt: -1 }).toArray()

    return {
      success: true,
      tradeIns
    }

  } catch (error: any) {
    console.error('ERRORE ADMIN TRADE-INS GET:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante il recupero delle richieste di permuta.',
      message: error.message
    })
  } finally {
    await client.close()
  }
})
