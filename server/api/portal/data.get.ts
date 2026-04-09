import { defineEventHandler, createError, getQuery } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const targa = query.targa as string

  if (!targa) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Targa mancante.'
    })
  }

  const { db, client } = await connectToDatabase()

  try {
    // 1. Dati Veicolo
    const vehicle = await db.collection('portal_vehicles').findOne({ targa: targa.toUpperCase() })
    
    // 2. Storico Manutenzioni
    const maintenance = await db.collection('portal_maintenance')
      .find({ targa: targa.toUpperCase() })
      .sort({ date: -1 })
      .toArray()

    // 3. Documenti
    const documents = await db.collection('portal_documents')
      .find({ targa: targa.toUpperCase() })
      .sort({ date: -1 })
      .toArray()

    return {
      success: true,
      vehicle: vehicle || null,
      maintenance: maintenance || [],
      documents: documents || []
    }

  } catch (error: any) {
    console.error('ERRORE PORTAL DATA:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Errore recupero dati portale.'
    })
  } finally {
    await client.close()
  }
})
