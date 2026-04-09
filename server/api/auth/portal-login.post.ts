import { defineEventHandler, readBody, createError } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, targa, password } = body

  // Validazione Username fisso come richiesto
  if (username !== 'roadrunner') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Username non valido.'
    })
  }

  if (!targa || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Targa e Password sono obbligatorie.'
    })
  }

  const { db, client } = await connectToDatabase()

  try {
    const usersCollection = db.collection('portal_users')

    // Ricerca utente per targa
    const user = await usersCollection.findOne({ targa: targa.toUpperCase() })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Veicolo non trovato o non registrato nel portale.'
      })
    }

    // Verifica password (in un sistema reale userei bcrypt.compare)
    if (user.password !== password) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Password errata.'
      })
    }

    // Login riuscito - In un sistema reale genererei un JWT
    // Per ora restituiamo i dati dell'utente (escludendo la password)
    const { password: _, ...userSafe } = user

    return {
      success: true,
      user: userSafe,
      token: 'mock-jwt-token-' + Math.random().toString(36).substring(7) // Mock token
    }

  } catch (error: any) {
    console.error('ERRORE PORTAL LOGIN:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Errore durante l\'accesso.'
    })
  } finally {
    await client.close()
  }
})
