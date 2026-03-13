import { defineEventHandler, createError, getQuery } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  
  // Parametri di query per filtri, ricerca e paginazione
  const category = query.category as string
  const search = query.search as string
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 9
  const skip = (page - 1) * limit

  if (!config.mongodbUri) {
    throw createError({ statusCode: 500, statusMessage: 'Database non configurato.' })
  }

  const client = new MongoClient(config.mongodbUri as string)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName || 'roadrunner_db')
    const collection = db.collection('blog_posts')

    // Costruzione filtro
    const filter: any = {}
    if (category && category !== 'Tutti') filter.category = category
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    const total = await collection.countDocuments(filter)
    const posts = await collection.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }

  } catch (error: any) {
    console.error('ERRORE BLOG GET:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore durante il recupero degli articoli.' })
  } finally {
    await client.close()
  }
})
