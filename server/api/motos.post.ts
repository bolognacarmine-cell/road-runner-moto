
import { defineEventHandler, readBody } from 'h3'
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // 1. Configurazione Cloudinary
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
  })

  // 2. Connessione a MongoDB
  const client = new MongoClient(config.mongodbUri)

  try {
    // 3. Upload Immagini su Cloudinary (se presenti)
    const imageUrls = []
    if (body.imagesBase64 && Array.isArray(body.imagesBase64)) {
      for (const base64 of body.imagesBase64) {
        const uploadResponse = await cloudinary.uploader.upload(base64, {
          folder: 'road-runner-motos'
        })
        imageUrls.push(uploadResponse.secure_url)
      }
    }

    await client.connect()
    const db = client.db('roadrunner_db')
    const collection = db.collection('motos')

    // 4. Preparazione dei dati finali
    // Rimuoviamo i dati base64 e inseriamo gli URL di Cloudinary
    const { imagesBase64, ...motoData } = body
    const newMoto = {
      ...motoData,
      immagini: imageUrls.length > 0 ? imageUrls : body.immagini,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 5. Salvataggio su MongoDB
    const result = await collection.insertOne(newMoto)

    return {
      message: 'Moto e immagini caricate con successo!',
      id: result.insertedId,
      urls: imageUrls
    }

  } catch (error) {
    console.error('Errore durante il caricamento:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante il processo di caricamento.',
      data: error.message
    })
  } finally {
    await client.close()
  }
})
