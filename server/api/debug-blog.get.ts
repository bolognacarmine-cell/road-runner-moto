import { defineEventHandler } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const client = new MongoClient(config.mongodbUri as string)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName || 'roadrunner_db')
    const collection = db.collection('blog_posts')

    const posts = await collection.find({}).project({ title: 1, slug: 1 }).toArray()
    const dbName = config.mongodbDbName || 'roadrunner_db'
    const uri = config.mongodbUri?.replace(/:[^:@]+@/, ':***@') // Mask password
    const collections = await db.listCollections().toArray()

    return {
      dbName,
      uri,
      collections: collections.map(c => c.name),
      postsCount: posts.length,
      posts
    }

  } catch (error: any) {
    return { error: error.message }
  } finally {
    await client.close()
  }
})
