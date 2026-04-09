import { defineEventHandler, createError } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const { db, client } = await connectToDatabase()

  try {
    const users = await db.collection('portal_users').find({}).sort({ createdAt: -1 }).toArray()
    const vehicles = await db.collection('portal_vehicles').find({}).toArray()

    return {
      success: true,
      users,
      vehicles
    }

  } catch (error: any) {
    console.error('ERRORE PORTAL ADMIN GET:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore recupero dati admin portale.' })
  } finally {
    await client.close()
  }
})
