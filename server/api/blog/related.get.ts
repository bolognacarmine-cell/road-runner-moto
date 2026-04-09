import { defineEventHandler, createError, getQuery } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const motoId = query.motoId as string

  if (!motoId) {
    throw createError({ statusCode: 400, statusMessage: 'motoId mancante.' })
  }

  const { db, client } = await connectToDatabase()

  try {
    const collection = db.collection('blog_posts')

    // Trova articoli che hanno questo motoId nell'array relatedMotos
    const posts = await collection.find({ 
      relatedMotos: { $in: [motoId] } 
    }).sort({ date: -1 }).limit(3).toArray()

    return {
      posts
    }

  } catch (error: any) {
    console.error('ERRORE BLOG RELATED GET:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore durante il recupero degli articoli correlati.' })
  } finally {
    await client.close()
  }
})
