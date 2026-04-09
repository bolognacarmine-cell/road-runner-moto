import { defineEventHandler } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const { db, client } = await connectToDatabase()

  try {
    const settings = await db.collection('siteSettings').findOne({ _id: 'road-runner-settings' as any })
    
    return settings || { 
      themeColor: 'rosso',
      backgroundColor: '#030303',
      textColor: '#fdfdfd'
    }

  } catch (error: any) {
    return { 
      themeColor: 'rosso',
      backgroundColor: '#030303',
      textColor: '#fdfdfd'
    }
  } finally {
    await client.close()
  }
})
