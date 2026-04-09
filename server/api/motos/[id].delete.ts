import { defineEventHandler, getRouterParam } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID mancante'
    })
  }

  const { db, client } = await connectToDatabase()

  try {
    console.log(`[API] Tentativo di eliminazione moto ${id}...`)
    const collection = db.collection('motos')

    // Elimina il documento tramite ID
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Moto non trovata'
      })
    }

    return {
      message: 'Moto eliminata con successo'
    }

  } catch (error: any) {
    console.error('ERRORE API MOTOS DELETE:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante l\'eliminazione',
      message: error.message
    })
  } finally {
    await client.close()
  }
})
