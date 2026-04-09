import { MongoClient, Db } from 'mongodb'
import { createError } from 'h3'

/**
 * Utilità centralizzata per la connessione a MongoDB.
 * Gestisce URI SRV e Standard, fornisce log chiari e gestione errori robusta.
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const config = useRuntimeConfig()
  const uri = config.mongodbUri as string
  const dbName = config.mongodbDbName || 'roadrunner_db'

  // 1. Verifica presenza variabile ambiente
  if (!uri) {
    console.error('[MONGODB] ERRORE: Variabile MONGODB_URI assente nelle runtimeConfig.')
    throw createError({
      statusCode: 500,
      statusMessage: 'Database non configurato correttamente su Render.'
    })
  }

  // 2. Analisi tipo URI (senza stampare segreti)
  const isSrv = uri.startsWith('mongodb+srv://')
  const maskedUri = uri.replace(/\/\/.*:.*@/, '//****:****@')
  console.log(`[MONGODB] Tentativo di connessione...`)
  console.log(`[MONGODB] Tipo URI: ${isSrv ? 'SRV (+srv)' : 'Standard'}`)
  // console.log(`[MONGODB] URI Mascherata: ${maskedUri}`) // Utile per debug se necessario

  // 3. Configurazione client robusta
  const client = new MongoClient(uri, {
    connectTimeoutMS: 15000,      // Più tempo per la risoluzione DNS su Render
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    // Se SRV fallisce spesso, l'utente dovrebbe passare alla stringa standard
  })

  try {
    await client.connect()
    const db = client.db(dbName)
    console.log(`[MONGODB] Connesso con successo al database: ${dbName}`)
    return { client, db }
  } catch (error: any) {
    const errMsg = error.message || 'Errore di connessione sconosciuto'
    console.error(`[MONGODB] ERRORE CRITICO: ${errMsg}`)
    
    // Gestione specifica errori DNS SRV
    if (errMsg.includes('querySrv') || errMsg.includes('ETIMEOUT')) {
      console.error('[MONGODB] SUGGERIMENTO: Errore DNS/SRV rilevato. Passare alla "Standard Connection String" in MongoDB Atlas.')
    }

    throw createError({
      statusCode: 503,
      statusMessage: 'Servizio Database Temporaneamente Non Disponibile',
      data: {
        error: errMsg,
        hint: isSrv ? 'Prova a usare la stringa di connessione standard (mongodb://) invece di quella SRV.' : 'Verifica whitelist IP su MongoDB Atlas.'
      }
    })
  }
}
