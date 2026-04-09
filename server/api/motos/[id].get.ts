
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { ObjectId } from 'mongodb'

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
    const collection = db.collection('motos')

    const moto = await collection.findOne({ _id: new ObjectId(id) })

    if (!moto) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Moto non trovata'
      })
    }

    return {
      moto
    }

  } catch (error: any) {
    console.error('ERRORE MONGODB (SINGLE GET):', error.message)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante il recupero del veicolo.',
      message: error.message
    })
  } finally {
    await client.close()
  }
})
