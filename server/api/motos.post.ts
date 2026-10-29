
import { defineEventHandler, readBody, createError } from 'h3'
import { MongoClient } from 'mongodb'
import { uploadOptimizedImage } from '../utils/cloudinaryUpload'
import { isAdmin } from '../utils/auth'

export default defineEventHandler(async (event) => {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)

  // 1. Connessione a MongoDB tramite utilità centralizzata
  const { db } = await connectToDatabase()

  try {
    // 3. Upload Immagini su Cloudinary (se presenti)
    const imageUrls = []
    if (body.imagesBase64 && Array.isArray(body.imagesBase64)) {
      console.log(`Tentativo di upload di ${body.imagesBase64.length} immagini su Cloudinary...`)
      for (const [index, base64] of body.imagesBase64.entries()) {
        try {
          const uploadResult = await uploadOptimizedImage(base64, {
            folder: 'road-runner-motos',
            maxWidth: 1600,
            resourceType: 'auto'
          })
          imageUrls.push(uploadResult.secureUrl)
          console.log(`Immagine ${index + 1} caricata: ${uploadResult.secureUrl}`)
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
  }
})
