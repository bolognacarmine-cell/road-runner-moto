
import { defineEventHandler, readBody } from 'h3'
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  if (config.cloudinaryCloudName && config.cloudinaryApiKey && config.cloudinaryApiSecret) {
    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret
    })
  }

  const { db, client } = await connectToDatabase()

  try {
    const imageUrls = []
    if (body.imagesBase64 && Array.isArray(body.imagesBase64)) {
      for (const base64 of body.imagesBase64) {
        const uploadResponse = await cloudinary.uploader.upload(base64, {
          folder: 'road-runner-helmets',
          resource_type: 'auto'
        })
        imageUrls.push(uploadResponse.secure_url)
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
    await client.close()
  }
})
