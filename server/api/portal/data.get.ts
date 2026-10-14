import { defineEventHandler, createError, getQuery } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const payloadTarga = (event.context as any)?.portalTarga as string | undefined
  const query = getQuery(event)
  const requested = (query.targa as string | undefined) || payloadTarga

  if (!payloadTarga) {
    throw createError({ statusCode: 401, statusMessage: 'Accesso portale richiesto.' })
  }
  if (requested && requested.toUpperCase() !== payloadTarga.toUpperCase()) {
    throw createError({ statusCode: 403, statusMessage: 'Accesso negato ai dati di questo veicolo.' })
  }

  const targa = payloadTarga.toUpperCase()

  const { db } = await connectToDatabase()

  try {
    // 1. Dati Veicolo
    const vehicle = await db.collection('portal_vehicles').findOne({ targa })
    
    // 2. Storico Manutenzioni
    const maintenance = await db.collection('portal_maintenance')
      .find({ targa })
      .sort({ date: -1 })
      .toArray()
    
    // 3. Documenti
    const documents = await db.collection('portal_documents')
      .find({ targa })
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
  }
})
