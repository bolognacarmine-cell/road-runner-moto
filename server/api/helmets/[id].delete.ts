
import { defineEventHandler } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID casco non fornito' })

  const { db, client } = await connectToDatabase()

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
    await client.close()
  }
})
