import { defineEventHandler, getQuery, createError } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  const { id } = query

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID utente mancante.' })
  }

  const client = new MongoClient(config.mongodbUri)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
    
    // 1. Trova l'utente per recuperare la targa
    const user = await db.collection('portal_users').findOne({ _id: new ObjectId(id as string) })
    
    if (user) {
      const targa = user.targa?.toUpperCase()
      
      // 2. Elimina i dati del veicolo associato
      if (targa) {
        await db.collection('portal_vehicles').deleteOne({ targa })
        await db.collection('portal_maintenance').deleteMany({ targa })
        // Nota: i documenti non vengono eliminati qui per sicurezza o se vuoi pulire anche quelli:
        // await db.collection('portal_documents').deleteMany({ targa })
      }
      
      // 3. Elimina l'utente stesso
      await db.collection('portal_users').deleteOne({ _id: new ObjectId(id as string) })
    }

    return { success: true, message: 'Cliente rimosso dal portale con successo.' }

  } catch (error: any) {
    console.error('ERRORE DELETE PORTAL USER:', error)
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Errore durante l\'eliminazione dell\'utente.' })
  } finally {
    await client.close()
  }
})
