import { defineEventHandler, createError } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig() // Auto-importato in Nuxt 3 server
  
  if (!config.mongodbUri) {
    console.error('ERRORE: MONGODB_URI non definita nelle variabili d\'ambiente!')
    throw createError({
      statusCode: 500,
      statusMessage: 'Configurazione database mancante.'
    })
  }

  const client = new MongoClient(config.mongodbUri, {
    connectTimeoutMS: 10000, // Timeout di 10 secondi
    serverSelectionTimeoutMS: 10000
  })

  try {
    console.log('Tentativo di connessione a MongoDB...')
    await client.connect()
    console.log('Connesso con successo al database:', config.mongodbDbName)
    
    const db = client.db(config.mongodbDbName)
    const collection = db.collection('motos')

    // Recupera tutte le moto ordinate per data di creazione (più recenti prima)
    const motos = await collection.find({}).sort({ createdAt: -1 }).toArray()
    console.log(`Recuperate ${motos.length} moto dal database.`)

    return {
      motos
    }

  } catch (error) {
    console.error('ERRORE CRITICO MONGODB (GET):', {
      message: error.message,
      code: error.code,
      name: error.name
    })
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore di connessione al database.',
      message: error.message.includes('querySrv') 
        ? 'Problema DNS locale: Non riesco a risolvere l\'indirizzo di MongoDB Atlas. Prova a cambiare i DNS del tuo PC in 8.8.8.8 o 1.1.1.1.'
        : error.message.includes('Authentication failed')
          ? 'ERRORE DI AUTENTICAZIONE: La password o lo username del Database User in Atlas sono errati. Controlla il file .env.'
          : error.message
    })
  } finally {
    await client.close()
  }
})
