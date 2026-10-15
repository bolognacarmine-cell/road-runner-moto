import { defineEventHandler, createError, getQuery } from 'h3'
import { MongoClient } from 'mongodb'
import { connectToDatabase } from '~/server/utils/mongodb'

// Dati mock per blog
const mockPosts = [
  {
    _id: '1',
    title: 'Nuovi modelli Honda 2024',
    slug: 'nuovi-modelli-honda-2024',
    category: 'Novità Moto',
    excerpt: 'Scopri le novità Honda per il 2024 con nuovi modelli di scooter e moto.',
    content: 'Scopri le novità Honda per il 2024 con nuovi modelli di scooter e moto.',
    date: '2024-01-15T10:00:00.000Z',
    imageUrl: '/cta-bg.jpg',
    isVisible: true
  },
  {
    _id: '2',
    title: 'Come scegliere il casco giusto',
    slug: 'come-scegliere-casco-giusto',
    category: 'Sicurezza',
    excerpt: 'Guida completa per scegliere il casco più adatto alle tue esigenze.',
    content: 'Guida completa per scegliere il casco più adatto alle tue esigenze.',
    date: '2024-01-14T10:00:00.000Z',
    imageUrl: '/compass.jpg',
    isVisible: true
  }
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // Parametri di query per filtri, ricerca e paginazione
  const category = query.category as string
  const search = query.search as string
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 9
  const skip = (page - 1) * limit

  const config = useRuntimeConfig()
  const uri = config.mongodbUri as string

  // Se non c'è MONGODB_URI configurato, restituisci dati mock
  if (!uri) {
    console.log('[API] MONGODB_URI non configurato - uso dati mock per blog')

    let filteredPosts = mockPosts

    // Filtri mock
    if (category && category !== 'Tutti') {
      filteredPosts = filteredPosts.filter(p => p.category === category)
    }
    if (search) {
      filteredPosts = filteredPosts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase())
      )
    }

    const total = filteredPosts.length
    const posts = filteredPosts.slice(skip, skip + limit)

    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  }

  const { db } = await connectToDatabase()

  try {
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
  }
})
