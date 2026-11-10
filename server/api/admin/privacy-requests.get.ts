import { defineEventHandler, createError } from 'h3'
import { isAdmin } from '../../utils/auth'

/**
 * GET /api/admin/privacy-requests
 * Elenco delle richieste degli interessati (solo amministratore).
 * Il token di verifica non viene mai esposto in lista.
 */
export default defineEventHandler(async (event) => {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { db } = await connectToDatabase()

  const requests = await db
    .collection('privacy_requests')
    .find({})
    .project({ token: 0 })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray()

  return { requests }
})
