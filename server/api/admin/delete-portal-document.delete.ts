import { defineEventHandler, getQuery, createError } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { id } = query

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID documento mancante.' })
  }

  // Configurazione Cloudinary
  cloudinary.config({
    cloud_name: useRuntimeConfig().cloudinaryCloudName,
    api_key: useRuntimeConfig().cloudinaryApiKey,
    api_secret: useRuntimeConfig().cloudinaryApiSecret
  })

  const { db, client } = await connectToDatabase()

  try {
    // 1. Recupera il documento per ottenere il cloudinary_id
    const doc = await db.collection('portal_documents').findOne({ _id: new ObjectId(id as string) })
    
    if (!doc) {
      throw createError({ statusCode: 404, statusMessage: 'Documento non trovato.' })
    }

    // 2. Elimina da Cloudinary (se esiste cloudinary_id)
    if (doc.cloudinary_id) {
      try {
        await cloudinary.uploader.destroy(doc.cloudinary_id)
      } catch (cloudinaryErr) {
        console.warn('Errore rimozione da Cloudinary (ignorabile):', cloudinaryErr)
      }
    }

    // 3. Elimina da MongoDB
    await db.collection('portal_documents').deleteOne({ _id: new ObjectId(id as string) })

    return { success: true, message: 'Documento eliminato.' }

  } catch (error: any) {
    console.error('ERRORE DELETE PORTAL DOC:', error)
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Errore durante l\'eliminazione.' })
  } finally {
    await client.close()
  }
})
