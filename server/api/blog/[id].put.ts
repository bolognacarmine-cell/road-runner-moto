import { defineEventHandler, readBody, createError, getRouterParam } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!config.mongodbUri) {
    throw createError({ statusCode: 500, statusMessage: 'Database non configurato.' })
  }

  const client = new MongoClient(config.mongodbUri as string)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
    const collection = db.collection('blog_posts')

    const updateData = {
      ...body,
      updatedAt: new Date()
    }
    // Rimuovi _id se presente nel body
    delete updateData._id

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Articolo non trovato.' })
    }

    return { success: true }

  } catch (error: any) {
    console.error('ERRORE BLOG PUT:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore durante l\'aggiornamento.' })
  } finally {
    await client.close()
  }
})
