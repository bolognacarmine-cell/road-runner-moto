
import { defineEventHandler, createError } from 'h3'
import { MongoClient } from 'mongodb'
import { isAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { db } = await connectToDatabase()

  try {
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
  }
})
