import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID mancante'
    })
  }

  // 1. Configurazione Cloudinary
  if (config.cloudinaryCloudName && config.cloudinaryApiKey && config.cloudinaryApiSecret) {
    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret
    })
  }

  const mongodbUri = config.mongodbUri as string
  const client = new MongoClient(mongodbUri, {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000
  })

  try {
    // 2. Upload nuove immagini su Cloudinary (se presenti in Base64)
    const newImageUrls = []
    if (body.imagesBase64 && Array.isArray(body.imagesBase64)) {
      console.log(`Aggiornamento moto ${id}: upload di ${body.imagesBase64.length} nuove immagini...`)
      for (const base64 of body.imagesBase64) {
        const uploadResponse = await cloudinary.uploader.upload(base64, {
          folder: 'road-runner-motos'
        })
        newImageUrls.push(uploadResponse.secure_url)
      }
    }

    console.log('Tentativo di connessione a MongoDB (PUT)...')
    await client.connect()
    
    const db = client.db(config.mongodbDbName)
    const collection = db.collection('motos')

    // 3. Rimuoviamo i campi che non devono essere salvati direttamente come dati
    const { _id, imagesBase64, immagini, imageOrder, ...updateData } = body

    // 4. Costruiamo la lista immagini finale rispettando l'ordine
    let finalImmagini = []
    if (imageOrder && Array.isArray(imageOrder)) {
      let newImgIdx = 0
      finalImmagini = imageOrder.map(item => {
        if (item === 'NEW_IMAGE') {
          return newImageUrls[newImgIdx++]
        }
        return item // È un URL esistente
      })
    } else {
      // Fallback: concatena vecchie e nuove
      finalImmagini = [...(body.immagini || []), ...newImageUrls]
    }

    // 5. Aggiorna il documento tramite ID
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateData,
          immagini: finalImmagini,
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
      urls: finalImmagini
    }

  } catch (error) {
    console.error('Errore durante l\'aggiornamento:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante l\'aggiornamento',
      message: error.message
    })
  } finally {
    await client.close()
  }
})
