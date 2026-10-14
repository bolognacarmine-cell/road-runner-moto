import { defineEventHandler, readBody, createError } from 'h3'
import { connectToDatabase } from '../../utils/mongodb'
import { verifyPassword } from '../../utils/password'
import { signSession, setPortalCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))
  const { targa, password } = body || {}

  if (!targa || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Targa e Password sono obbligatorie.' })
  }

  const { db } = await connectToDatabase()

  try {
    const usersCollection = db.collection('portal_users')
    const user = await usersCollection.findOne({ targa: String(targa).toUpperCase() })

    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'Veicolo non trovato o non registrato nel portale.' })
    }

    const check = verifyPassword(String(password), String(user.password || ''))
    if (!check.valid) {
      throw createError({ statusCode: 401, statusMessage: 'Password errata.' })
    }

    // Upgrade legacy plaintext passwords to hashed on successful login.
    if (check.needsUpgrade) {
      const { hashPassword } = await import('../../utils/password')
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { password: hashPassword(String(password)) } }
      )
    }

    const { password: _, ...userSafe } = user

    const token = signSession(
      { role: 'customer', targa: String(targa).toUpperCase(), uid: String(user._id) },
      7 * 24 * 60 * 60
    )
    setPortalCookie(event, token, 7 * 24 * 60 * 60)

    return {
      success: true,
      user: userSafe,
      token
    }
  } catch (error: any) {
    console.error('ERRORE PORTAL LOGIN:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Errore durante l\'accesso.'
    })
  } finally {
  }
})