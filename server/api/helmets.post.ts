
import { defineEventHandler, readBody, createError } from 'h3'
import { MongoClient } from 'mongodb'
import { uploadOptimizedImage } from '../utils/cloudinaryUpload'
import { isAdmin } from '../utils/auth'

export default defineEventHandler(async (event) => {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)

  const { db } = await connectToDatabase()

  try {
    const imageUrls = []
    if (body.imagesBase64 && Array.isArray(body.imagesBase64)) {
      for (const base64 of body.imagesBase64) {
        const uploadResult = await uploadOptimizedImage(base64, {
          folder: 'road-runner-helmets',
          maxWidth: 1600,
          resourceType: 'auto'
        })
        imageUrls.push(uploadResult.secureUrl)
      }
    }

    const collection = db.collection('helmets')

    const { imagesBase64, imageOrder, ...helmetData } = body
    
    let finalImmagini = []
    if (imageOrder && Array.isArray(imageOrder)) {
      let newImgIdx = 0
      finalImmagini = imageOrder.map(item => {
        if (item === 'NEW_IMAGE') return imageUrls[newImgIdx++]
        return item
      })
    } else {
      finalImmagini = imageUrls.length > 0 ? imageUrls : (body.immagini || [])
    }

    const newHelmet = {
      ...helmetData,
      immagini: finalImmagini,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(newHelmet)

    return {
      message: 'Casco caricato con successo!',
      id: result.insertedId,
      urls: finalImmagini
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore durante il salvataggio del casco'
    })
  } finally {
  }
})
