import { defineEventHandler } from 'h3'
import { MongoClient } from 'mongodb'
import { connectToDatabase } from '~/server/utils/mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const uri = config.mongodbUri as string

  // Se non c'è MONGODB_URI configurato, restituisci impostazioni di default
  if (!uri) {
    console.log('[API] MONGODB_URI non configurato - uso impostazioni default')
    return {
      themeColor: 'rosso',
      backgroundColor: '#030303',
      textColor: '#fdfdfd'
    }
  }

  const { db } = await connectToDatabase()

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
  }
})
