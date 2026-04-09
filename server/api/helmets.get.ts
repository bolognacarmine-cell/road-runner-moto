
import { defineEventHandler } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const { db, client } = await connectToDatabase()

  try {
    const collection = db.collection('helmets')
    
    // Recupera tutti i caschi, ordinati per creazione (più recenti prima)
    const helmets = await collection.find({}).sort({ createdAt: -1 }).toArray()
    
    return {
      success: true,
      helmets
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore durante il recupero dei caschi'
    })
  } finally {
    await client.close()
  }
})
