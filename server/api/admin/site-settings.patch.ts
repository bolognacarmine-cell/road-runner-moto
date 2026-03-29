import { defineEventHandler, readBody, createError } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)
  const { themeColor } = body

  if (!themeColor || !['rosso', 'arancione', 'verde', 'blu', 'giallo', 'viola'].includes(themeColor)) {
    throw createError({ statusCode: 400, statusMessage: 'Colore non valido' })
  }

  const client = new MongoClient(config.mongodbUri)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
    
    // Aggiorna o crea il documento unico di impostazioni
    await db.collection('siteSettings').updateOne(
      { _id: 'road-runner-settings' as any },
      { 
        $set: { 
          themeColor, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    )

    return { success: true, themeColor }

  } catch (error: any) {
    console.error('ERRORE PATCH SITE SETTINGS:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore durante il salvataggio' })
  } finally {
    await client.close()
  }
})
