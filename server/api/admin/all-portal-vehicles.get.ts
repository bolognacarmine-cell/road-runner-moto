import { defineEventHandler, createError } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const client = new MongoClient(config.mongodbUri)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)

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
    await client.close()
  }
})
