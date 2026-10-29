import { defineEventHandler, readBody, createError } from 'h3'
import { MongoClient } from 'mongodb'
import { uploadOptimizedImage } from '../../utils/cloudinaryUpload'
import { isAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)

  const { targa, title, type, fileBase64 } = body

  if (!targa || !fileBase64) {
    throw createError({ statusCode: 400, statusMessage: 'Targa e file sono obbligatori.' })
  }

  const { db } = await connectToDatabase()

  try {
    // 1. Upload su Cloudinary (ottimizzato)
    const uploadResult = await uploadOptimizedImage(fileBase64, {
      folder: 'portal-docs',
      maxWidth: 1600,
      resourceType: 'auto'
    })

    // 2. Salvataggio riferimento su MongoDB
    await db.collection('portal_documents').insertOne({
      targa: targa.toUpperCase(),
      title: title || 'Documento senza titolo',
      type: type || 'Altro',
      url: uploadResult.secureUrl,
      cloudinary_id: uploadResult.publicId,
      createdAt: new Date()
    })

    return { success: true, url: uploadResult.secureUrl }

  } catch (error: any) {
    console.error('ERRORE UPLOAD DOC:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore caricamento documento.' })
  } finally {
  }
})
