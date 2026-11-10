import { createError } from 'h3'

/**
 * GET /api/privacy-requests/[token]
 * Verifica dello stato di una richiesta tramite il codice di riferimento.
 *
 * Non restituisce dati personali (solo stato, tipo, date): il token è
 * irripetibile e funge da prova di possesso.
 */
export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')

  if (!token || typeof token !== 'string' || !/^[a-f0-9]{32}$/.test(token)) {
    throw createError({ statusCode: 400, statusMessage: 'Riferimento non valido.' })
  }

  const { db } = await connectToDatabase()
  const request = await db.collection('privacy_requests').findOne({ token })

  if (!request) {
    throw createError({ statusCode: 404, statusMessage: 'Nessuna richiesta trovata con questo riferimento.' })
  }

  return {
    status: request.status,
    tipo: request.tipo,
    createdAt: request.createdAt,
    deadline: request.deadline,
    autoResponse: request.autoResponse?.text || null
  }
})
