
import { defineEventHandler, readBody } from 'h3'
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // 0. Verifica configurazione essenziale
  if (!config.mongodbUri) {
    console.error('ERRORE POST: MONGODB_URI non definita!')
    throw createError({ statusCode: 500, statusMessage: 'Database non configurato.' })
  }

  // 1. Configurazione Cloudinary
  if (config.cloudinaryCloudName && config.cloudinaryApiKey && config.cloudinaryApiSecret) {
    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret
    })
  } else {
    console.warn('ATTENZIONE: Cloudinary non configurato. L\'upload delle immagini fallirà.')
  }

  // 2. Connessione a MongoDB
  const client = new MongoClient(config.mongodbUri, {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000
  })

  try {
    // 3. Upload Immagini su Cloudinary (se presenti)
    const imageUrls = []
    if (body.imagesBase64 && Array.isArray(body.imagesBase64)) {
      console.log(`Tentativo di upload di ${body.imagesBase64.length} immagini su Cloudinary...`)
      for (const base64 of body.imagesBase64) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(base64, {
            folder: 'road-runner-motos'
          })
          imageUrls.push(uploadResponse.secure_url)
        } catch (cloudinaryErr) {
          console.error('Errore durante l\'upload su Cloudinary:', cloudinaryErr)
          throw createError({ statusCode: 500, statusMessage: 'Errore durante l\'upload delle immagini su Cloudinary.', data: cloudinaryErr.message })
        }
      }
    }

    console.log('Tentativo di connessione a MongoDB (POST)...')
    await client.connect()
    console.log('Connesso con successo al database:', config.mongodbDbName)
    
    const db = client.db(config.mongodbDbName)
    const collection = db.collection('motos')

    // 4. Preparazione dei dati finali
    const { imagesBase64, ...motoData } = body
    const newMoto = {
      ...motoData,
      immagini: imageUrls.length > 0 ? imageUrls : body.immagini,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 5. Salvataggio su MongoDB
    const result = await collection.insertOne(newMoto)
    console.log('Moto inserita con successo, ID:', result.insertedId)

    return {
      message: 'Moto e immagini caricate con successo!',
      id: result.insertedId,
      urls: imageUrls
    }

  } catch (error) {
    console.error('ERRORE CRITICO MONGODB (POST):', {
      message: error.message,
      code: error.code,
      name: error.name
    })
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante il salvataggio sul database.',
      data: error.message
    })
  } finally {
    await client.close()
  }
})
