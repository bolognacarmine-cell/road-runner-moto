import { defineEventHandler, createError } from 'h3'
import { connectToDatabase } from '~/server/utils/mongodb'
import { isAdmin } from '../utils/auth'

export default defineEventHandler(async (event) => {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Non autorizzato.' })
  }

  const { db } = await connectToDatabase()

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
  }
})
