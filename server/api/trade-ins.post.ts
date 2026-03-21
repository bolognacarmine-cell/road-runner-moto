
import { defineEventHandler, readBody, createError } from 'h3'
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  // 1. Verifica configurazione Database
  if (!config.mongodbUri) {
    throw createError({ statusCode: 500, statusMessage: 'Database non configurato.' })
  }

  // 2. Configurazione Cloudinary
  if (config.cloudinaryCloudName && config.cloudinaryApiKey && config.cloudinaryApiSecret) {
    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret
    })
  }

  const client = new MongoClient(config.mongodbUri as string)

  try {
    const imageUrls = []
    // Se ci sono immagini (base64) caricale su Cloudinary
    if (body.imagesBase64 && Array.isArray(body.imagesBase64)) {
      for (const base64 of body.imagesBase64) {
        const uploadResponse = await cloudinary.uploader.upload(base64, {
          folder: 'road-runner-tradeins',
          resource_type: 'auto'
        })
        imageUrls.push(uploadResponse.secure_url)
      }
    }

    await client.connect()
    const db = client.db(config.mongodbDbName)
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
    await client.close()
  }
})
