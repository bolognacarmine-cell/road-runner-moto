import { defineEventHandler, createError } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const { db, client } = await connectToDatabase()

  try {
    const collection = db.collection('leads')

    const leads = await collection.find({}).sort({ createdAt: -1 }).toArray()

    return {
      leads
    }

  } catch (error: any) {
    console.error('ERRORE LEADS GET:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante il recupero dei preventivi.'
    })
  } finally {
    await client.close()
  }
})
