
import { defineEventHandler, readBody } from 'h3'
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

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

  // 2. Connessione a MongoDB tramite utilità centralizzata
  const { db, client } = await connectToDatabase()

  try {
    // 3. Upload Immagini su Cloudinary (se presenti)
    const imageUrls = []
    if (body.imagesBase64 && Array.isArray(body.imagesBase64)) {
      console.log(`Tentativo di upload di ${body.imagesBase64.length} immagini su Cloudinary...`)
      for (const [index, base64] of body.imagesBase64.entries()) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(base64, {
            folder: 'road-runner-motos',
            resource_type: 'auto'
          })
          imageUrls.push(uploadResponse.secure_url)
          console.log(`Immagine ${index + 1} caricata: ${uploadResponse.secure_url}`)
        } catch (cloudinaryError: any) {
          console.error(`Errore Cloudinary sull'immagine ${index + 1}:`, cloudinaryError.message)
          throw createError({
            statusCode: 500,
            statusMessage: 'Errore durante l\'upload su Cloudinary.',
            message: cloudinaryError.message
          })
        }
      }
    }

    const collection = db.collection('motos')

    // 4. Preparazione dei dati finali
    const { imagesBase64, imageOrder, ...motoData } = body
    
    // Costruiamo la lista immagini finale rispettando l'ordine
    let finalImmagini = []
    if (imageOrder && Array.isArray(imageOrder)) {
      let newImgIdx = 0
      finalImmagini = imageOrder.map(item => {
        if (item === 'NEW_IMAGE') {
          return imageUrls[newImgIdx++]
        }
        return item // È un URL esistente
      })
    } else {
      finalImmagini = imageUrls.length > 0 ? imageUrls : (body.immagini || [])
    }

    const newMoto = {
      ...motoData,
      immagini: finalImmagini,
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

  } catch (error: any) {
    const errorMessage = error?.message || 'Errore sconosciuto durante il salvataggio della moto'
    console.error('ERRORE API MOTOS POST:', errorMessage)
    
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore interno del server durante il salvataggio del veicolo.',
      message: errorMessage
    })
  } finally {
    await client.close()
  }
})
