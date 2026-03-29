import { defineEventHandler } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const client = new MongoClient(config.mongodbUri)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
    const settings = await db.collection('siteSettings').findOne({ _id: 'road-runner-settings' as any })
    
    return settings || { themeColor: 'rosso' }

  } catch (error: any) {
    return { themeColor: 'rosso' }
  } finally {
    await client.close()
  }
})
