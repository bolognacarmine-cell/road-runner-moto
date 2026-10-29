
import { defineEventHandler, readBody, createError } from 'h3'
import { MongoClient } from 'mongodb'
import { uploadOptimizedImage } from '../utils/cloudinaryUpload'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { db } = await connectToDatabase()

  try {
    const imageUrls = []
    // Se ci sono immagini (base64) caricale su Cloudinary
    if (body.imagesBase64 && Array.isArray(body.imagesBase64)) {
      for (const base64 of body.imagesBase64) {
        const uploadResult = await uploadOptimizedImage(base64, {
          folder: 'road-runner-tradeins',
          maxWidth: 1600,
          resourceType: 'auto'
        })
        imageUrls.push(uploadResult.secureUrl)
      }
    }

    const collection = db.collection('tradeins')

    const newTradeIn = {
      ...body,
      images: imageUrls,
      createdAt: new Date(),
      status: 'penden' // penden, in_progress, completed, rejected
    }

    // Rimuovi i dati base64 prima del salvataggio nel DB
    delete newTradeIn.imagesBase64

    const result = await collection.insertOne(newTradeIn)

    return {
      success: true,
      message: 'Richiesta di permuta inviata con successo!',
      id: result.insertedId
    }

  } catch (error: any) {
    console.error('ERRORE TRADE-IN POST:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante l\'invio della richiesta.',
      message: error.message
    })
  } finally {
  }
})
