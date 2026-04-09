import { defineEventHandler, getQuery, createError } from 'h3'
import { MongoClient, ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { id } = query

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID intervento mancante.' })
  }

  const { db, client } = await connectToDatabase()

  try {
    await db.collection('portal_maintenance').deleteOne({ _id: new ObjectId(id as string) })

    return { success: true }

  } catch (error: any) {
    console.error('ERRORE DELETE MAINTENANCE:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore durante l\'eliminazione.' })
  } finally {
    await client.close()
  }
})
