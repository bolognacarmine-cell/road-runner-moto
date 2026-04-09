import { defineEventHandler, createError } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  // 1. Connessione al database tramite utilità centralizzata e robusta
  const { db, client } = await connectToDatabase()

  try {
    const collection = db.collection('motos')

    // 2. Recupera tutte le moto ordinate per data di creazione (più recenti prima)
    const motos = await collection.find({}).sort({ createdAt: -1 }).toArray()
    console.log(`[API] Recuperate ${motos.length} moto dal database.`)

    return {
      motos
    }

  } catch (error: any) {
    const errorMessage = error?.message || 'Errore sconosciuto durante il recupero delle moto'
    console.error('ERRORE API MOTOS GET:', errorMessage)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore interno del server durante il recupero dei veicoli.',
      message: errorMessage
    })
  } finally {
    // 3. Chiusura connessione (opzionale se si volesse usare il pooling, 
    // ma manteniamo il comportamento originale per sicurezza)
    await client.close()
  }
})
