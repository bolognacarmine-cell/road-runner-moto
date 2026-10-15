import { defineEventHandler, createError } from 'h3'
import { MongoClient } from 'mongodb'
import { isAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { db } = await connectToDatabase()

  try {
    const vehicles = await db.collection('portal_vehicles').find({}).toArray()

    return {
      success: true,
      vehicles: vehicles || []
    }

  } catch (error: any) {
    console.error('ERRORE ALL PORTAL VEHICLES:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore recupero veicoli portale.'
    })
  } finally {
  }
})
