import { defineEventHandler, createError, getRouterParam } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Identificativo mancante.' })
  }

  if (!config.mongodbUri) {
    throw createError({ statusCode: 500, statusMessage: 'Database non configurato.' })
  }

  const client = new MongoClient(config.mongodbUri as string)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName || 'roadrunner_db')
    const collection = db.collection('blog_posts')

    console.log('RICERCA POST PER ID/SLUG:', id)
    // Cerchiamo l'articolo in modo più flessibile (senza distinzione tra maiuscole/minuscole)
    let post = await collection.findOne({ 
      slug: { $regex: new RegExp(`^${id}$`, 'i') } 
    })

    // Fallback: cerca per ID se non trovato per slug (utile per admin/modifica)
    if (!post && id.length === 24) {
      const { ObjectId } = await import('mongodb')
      try {
        post = await collection.findOne({ _id: new ObjectId(id) })
      } catch (e) {
        // Non un ObjectId valido, ignora
      }
    }
    
    console.log('POST TROVATO:', post ? post.title : 'NESSUN POST TROVATO')

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
    console.error('ERRORE BLOG GET:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Errore durante il recupero dell\'articolo.'
    })
  } finally {
    await client.close()
  }
})
