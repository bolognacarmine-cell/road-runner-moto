import { defineEventHandler, readBody, createError } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { themeColor, backgroundColor, textColor } = body

  if (themeColor && !['rosso', 'arancione', 'verde', 'blu', 'giallo', 'viola'].includes(themeColor)) {
    throw createError({ statusCode: 400, statusMessage: 'Colore non valido' })
  }

  const { db, client } = await connectToDatabase()

  try {
    // Costruisci oggetto update
    const updateData: any = { updatedAt: new Date() }
    if (themeColor) updateData.themeColor = themeColor
    if (backgroundColor) updateData.backgroundColor = backgroundColor
    if (textColor) updateData.textColor = textColor

    // Aggiorna o crea il documento unico di impostazioni
    await db.collection('siteSettings').updateOne(
      { _id: 'road-runner-settings' as any },
      { $set: updateData },
      { upsert: true }
    )

    return { success: true, themeColor, backgroundColor, textColor }

  } catch (error: any) {
    console.error('ERRORE PATCH SITE SETTINGS:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore durante il salvataggio' })
  } finally {
    await client.close()
  }
})
