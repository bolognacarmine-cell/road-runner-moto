import { defineEventHandler, createError } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  if (!config.mongodbUri) {
    throw createError({ statusCode: 500, statusMessage: 'Database non configurato.' })
  }

  const client = new MongoClient(config.mongodbUri as string)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
    const collection = db.collection('blog_posts')

    // Trova articoli nella categoria 'Manutenzione'
    const posts = await collection.find({ 
      category: 'Manutenzione'
    }).sort({ date: -1 }).limit(5).toArray()

    return {
      posts
    }

  } catch (error: any) {
    console.error('ERRORE BLOG MAINTENANCE GET:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore durante il recupero degli articoli di manutenzione.' })
  } finally {
    await client.close()
  }
})
