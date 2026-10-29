
import { defineEventHandler, readBody, createError } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'
import { uploadOptimizedImage } from '../../utils/cloudinaryUpload'
import { isAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const id = event.context.params?.id

  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID casco non fornito' })

  const { db } = await connectToDatabase()

  try {
    const newImageUrls = []
    if (body.imagesBase64 && Array.isArray(body.imagesBase64)) {
      for (const base64 of body.imagesBase64) {
        const uploadResult = await uploadOptimizedImage(base64, {
          folder: 'road-runner-helmets',
          maxWidth: 1600,
          resourceType: 'auto'
        })
        newImageUrls.push(uploadResult.secureUrl)
      }
    }

    const collection = db.collection('helmets')

    const { _id, imagesBase64, immagini, imageOrder, ...updateData } = body

    let finalImmagini = []
    if (imageOrder && Array.isArray(imageOrder)) {
      let newImgIdx = 0
      finalImmagini = imageOrder.map(item => {
        if (item === 'NEW_IMAGE') return newImageUrls[newImgIdx++]
        return item
      })
    } else {
      finalImmagini = [...(body.immagini || []), ...newImageUrls]
    }

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
      throw createError({ statusCode: 404, statusMessage: 'Casco non trovato' })
    }

    return {
      message: 'Casco aggiornato con successo!',
      urls: finalImmagini
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore durante l\'aggiornamento del casco'
    })
  } finally {
  }
})
