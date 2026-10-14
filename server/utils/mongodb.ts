import { MongoClient, Db } from 'mongodb'
import { createError } from 'h3'

/**
 * Connessione MongoDB riutilizzata per l'intero processo.
 *
 * Il modulo mantiene una singola connessione/pool. I consumatori ricevono un client
 * già connesso ma non devono chiuderlo: la chiusura è responsabilità del modulo.
 */
type ReusableClient = Omit<MongoClient, 'close'>

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null
let pendingConnection: Promise<{ client: ReusableClient; db: Db }> | null = null
let realCloseClient: MongoClient | null = null

export async function connectToDatabase(): Promise<{ client: ReusableClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient as ReusableClient, db: cachedDb }
  }

  if (pendingConnection) {
    return pendingConnection
  }

  pendingConnection = (async () => {
    const config = useRuntimeConfig()
    const uri = config.mongodbUri as string
    const dbName = config.mongodbDbName || 'roadrunner_db'

    if (!uri) {
      console.error('[MONGODB] ERRORE: Variabile MONGODB_URI assente nelle runtimeConfig.')
      throw createError({
        statusCode: 500,
        statusMessage: 'Database non configurato correttamente su Render.'
      })
    }

    const isSrv = uri.startsWith('mongodb+srv://')
    const client = new MongoClient(uri, {
      connectTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    })

    try {
      await client.connect()
      const db = client.db(dbName)

      const reusableClient = client as ReusableClient

      cachedClient = client
      cachedDb = db
      realCloseClient = client

      console.log(`[MONGODB] Connesso con successo al database: ${dbName}`)
      console.log(`[MONGODB] Tipo URI: ${isSrv ? 'SRV (+srv)' : 'Standard'}`)

      return { client: reusableClient, db }
    } catch (error: any) {
      const errMsg = error.message || 'Errore di connessione sconosciuto'
      console.error(`[MONGODB] ERRORE CRITICO: ${errMsg}`)

      if (errMsg.includes('querySrv') || errMsg.includes('ETIMEOUT')) {
        console.error('[MONGODB] SUGGERIMENTO: Errore DNS/SRV rilevato. Passare alla "Standard Connection String" in MongoDB Atlas.')
      }

      try {
        await client.close()
      } catch {
        // Ignore cleanup errors after a failed connection attempt.
      }

      cachedClient = null
      cachedDb = null
      realCloseClient = null

      throw createError({
        statusCode: 503,
        statusMessage: 'Servizio Database Temporaneamente Non Disponibile',
        data: {
          error: errMsg,
          hint: isSrv ? 'Prova a usare la stringa di connessione standard (mongodb://) invece di quella SRV.' : 'Verifica whitelist IP su MongoDB Atlas.'
        }
      })
    }
  })()

  try {
    return await pendingConnection
  } catch (error) {
    throw error
  } finally {
    pendingConnection = null
  }
}

/**
 * Utility dedicata alla chiusura esplicita del pool singleton.
 * Non usata dagli handler delle API.
 */
export async function closeDatabase(): Promise<void> {
  if (!realCloseClient) return
  try {
    await realCloseClient.close()
  } finally {
    realCloseClient = null
    cachedClient = null
    cachedDb = null
    pendingConnection = null
  }
}