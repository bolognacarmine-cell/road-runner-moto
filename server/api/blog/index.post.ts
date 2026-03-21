import { defineEventHandler, readBody, createError } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  if (!config.mongodbUri) {
    throw createError({ statusCode: 500, statusMessage: 'Database non configurato.' })
  }

  const client = new MongoClient(config.mongodbUri as string)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
    const collection = db.collection('blog_posts')

    // Validazione base
    if (!body.title || !body.slug || !body.content) {
      throw createError({ statusCode: 400, statusMessage: 'Titolo, slug e contenuto sono obbligatori.' })
    }

    // Verifica se lo slug esiste già
    const existing = await collection.findOne({ slug: body.slug })
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: 'Esiste già un articolo con questo slug.' })
    }

    const newPost = {
      ...body,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      comments: []
    }

    const result = await collection.insertOne(newPost)

    return {
      success: true,
      id: result.insertedId
    }

  } catch (error: any) {
    console.error('ERRORE BLOG POST:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Errore durante la creazione dell\'articolo.'
    })
  } finally {
    await client.close()
  }
})
