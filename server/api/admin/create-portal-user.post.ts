import { defineEventHandler, readBody, createError } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  const { nome, cognome, targa, password } = body

  if (!nome || !cognome || !targa || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Tutti i campi sono obbligatori.' })
  }

  const client = new MongoClient(config.mongodbUri)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
    
    // Controlla se targa esiste già
    const existing = await db.collection('portal_users').findOne({ targa: targa.toUpperCase() })
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: 'Targa già registrata nel portale.' })
    }

    const newUser = {
      nome,
      cognome,
      targa: targa.toUpperCase(),
      password, // In produzione: bcrypt.hash
      role: 'customer',
      createdAt: new Date()
    }

    await db.collection('portal_users').insertOne(newUser)

    return { success: true }

  } catch (error: any) {
    console.error('ERRORE CREATE PORTAL USER:', error)
    throw createError({ 
      statusCode: error.statusCode || 500, 
      statusMessage: error.statusMessage || 'Errore salvataggio utente.' 
    })
  } finally {
    await client.close()
  }
})
