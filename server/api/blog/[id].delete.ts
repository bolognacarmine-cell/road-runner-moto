import { defineEventHandler, createError, getRouterParam } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const { db, client } = await connectToDatabase()

  try {
    const collection = db.collection('blog_posts')

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Articolo non trovato.' })
    }

    return { success: true }

  } catch (error: any) {
    console.error('ERRORE BLOG DELETE:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore durante l\'eliminazione.' })
  } finally {
    await client.close()
  }
})
