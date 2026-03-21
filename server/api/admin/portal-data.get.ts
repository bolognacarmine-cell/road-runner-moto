import { defineEventHandler, createError } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  
  if (!config.mongodbUri) {
    throw createError({ statusCode: 500, statusMessage: 'Database non configurato.' })
  }

  const client = new MongoClient(config.mongodbUri)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
    
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
