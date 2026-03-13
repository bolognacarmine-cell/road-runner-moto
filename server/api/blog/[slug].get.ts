import { defineEventHandler, createError, getRouterParam } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const slug = getRouterParam(event, 'slug')

  if (!config.mongodbUri) {
    throw createError({ statusCode: 500, statusMessage: 'Database non configurato.' })
  }

  const client = new MongoClient(config.mongodbUri as string)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
    const collection = db.collection('blog_posts')

    const post = await collection.findOne({ slug })

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Articolo non trovato.'
      })
    }

    // Recupera moto correlate se specificato
    let relatedMotos = []
    if (post.relatedMotos && post.relatedMotos.length > 0) {
      const motosCollection = db.collection('motos')
      const { ObjectId } = await import('mongodb')
      
      const ids = post.relatedMotos.map((id: string) => {
        try { return new ObjectId(id) } catch (e) { return null }
      }).filter((id: any) => id !== null)
      
      if (ids.length > 0) {
        relatedMotos = await motosCollection.find({ _id: { $in: ids } }).toArray()
      }
    }

    return {
      post,
      relatedMotos
    }

  } catch (error: any) {
    console.error('ERRORE BLOG SLUG GET:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Errore durante il recupero dell\'articolo.'
    })
  } finally {
    await client.close()
  }
})
