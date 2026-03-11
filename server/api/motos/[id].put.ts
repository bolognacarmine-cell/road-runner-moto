import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID mancante'
    })
  }

  // 1. Configurazione Cloudinary
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
  })

  const client = new MongoClient(config.mongodbUri)

  try {
    // 2. Upload nuove immagini su Cloudinary (se presenti in Base64)
    const newImageUrls = []
    if (body.imagesBase64 && Array.isArray(body.imagesBase64)) {
      for (const base64 of body.imagesBase64) {
        const uploadResponse = await cloudinary.uploader.upload(base64, {
          folder: 'road-runner-motos'
        })
        newImageUrls.push(uploadResponse.secure_url)
      }
    }

    await client.connect()
    const db = client.db('roadrunner_db')
    const collection = db.collection('motos')

    // 3. Uniamo le vecchie immagini (quelle che sono rimaste nel form) con le nuove
    // body.immagini contiene gli URL esistenti che l'utente ha deciso di tenere
    const updatedImages = [...(body.immagini || []), ...newImageUrls]

    // Rimuoviamo i campi che non devono essere salvati direttamente come dati
    const { _id, imagesBase64, immagini, ...updateData } = body

    // 4. Aggiorna il documento tramite ID
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateData,
          immagini: updatedImages,
          updatedAt: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Moto non trovata'
      })
    }

    return {
      message: 'Moto aggiornata con successo!',
      urls: updatedImages
    }

  } catch (error) {
    console.error('Errore durante l\'aggiornamento:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante l\'aggiornamento',
      data: error.message
    })
  } finally {
    await client.close()
  }
})
