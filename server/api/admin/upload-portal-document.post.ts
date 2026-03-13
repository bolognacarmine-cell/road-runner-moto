import { defineEventHandler, readBody, createError } from 'h3'
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  const { targa, title, type, fileBase64 } = body

  if (!targa || !fileBase64) {
    throw createError({ statusCode: 400, statusMessage: 'Targa e file sono obbligatori.' })
  }

  // Configurazione Cloudinary
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
  })

  const client = new MongoClient(config.mongodbUri)

  try {
    // 1. Upload su Cloudinary
    const uploadRes = await cloudinary.uploader.upload(fileBase64, {
      folder: 'portal-docs',
      resource_type: 'auto'
    })

    // 2. Salvataggio riferimento su MongoDB
    await client.connect()
    const db = client.db(config.mongodbDbName)
    
    await db.collection('portal_documents').insertOne({
      targa: targa.toUpperCase(),
      title: title || 'Documento senza titolo',
      type: type || 'Altro',
      url: uploadRes.secure_url,
      cloudinary_id: uploadRes.public_id,
      createdAt: new Date()
    })

    return { success: true, url: uploadRes.secure_url }

  } catch (error: any) {
    console.error('ERRORE UPLOAD DOC:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore caricamento documento.' })
  } finally {
    await client.close()
  }
})
