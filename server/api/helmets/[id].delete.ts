
import { defineEventHandler, createError } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'
import { isAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = event.context.params?.id

  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID casco non fornito' })

  const { db } = await connectToDatabase()

  try {
    const collection = db.collection('helmets')

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Casco non trovato' })
    }

    return {
      message: 'Casco eliminato con successo!'
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Errore durante l\'eliminazione del casco'
    })
  } finally {
  }
})
