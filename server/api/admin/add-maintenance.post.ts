import { defineEventHandler, readBody, createError } from 'h3'
import { MongoClient } from 'mongodb'
import { isAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { targa, data, km, descrizione, partiSostituite, costo } = body

  if (!targa || !descrizione) {
    throw createError({ statusCode: 400, statusMessage: 'Targa e descrizione obbligatorie.' })
  }

  const { db } = await connectToDatabase()

  try {
    await db.collection('portal_maintenance').insertOne({
      targa: targa.toUpperCase(),
      data: data || new Date().toISOString().split('T')[0],
      km: Number(km) || 0,
      descrizione,
      partiSostituite: partiSostituite || '',
      costo: Number(costo) || 0,
      createdAt: new Date()
    })

    return { success: true }

  } catch (error: any) {
    console.error('ERRORE ADD MAINTENANCE:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore salvataggio intervento.' })
  } finally {
  }
})
