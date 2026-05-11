import { defineEventHandler, readBody, createError } from 'h3'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, nome, cognome, password, cellulare, targa } = body

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID utente mancante.' })
  }

  const { db, client } = await connectToDatabase()

  try {
    const updateData: any = {}
    if (nome !== undefined) updateData.nome = nome
    if (cognome !== undefined) updateData.cognome = cognome
    if (password) updateData.password = password
    if (cellulare !== undefined) updateData.cellulare = cellulare
    if (targa) updateData.targa = targa.toUpperCase()

    if (Object.keys(updateData).length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'Nessun dato da aggiornare fornito.' })
    }

    const result = await db.collection('portal_users').updateOne(
      { _id: new ObjectId(id as string) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Utente non trovato.' })
    }

    return { success: true, message: 'Utente aggiornato con successo.' }

  } catch (error: any) {
    console.error('ERRORE UPDATE PORTAL USER:', error)
    throw createError({ 
      statusCode: error.statusCode || 500, 
      statusMessage: error.statusMessage || 'Errore aggiornamento utente.' 
    })
  } finally {
    await client.close()
  }
})
