import { defineEventHandler, getRouterParam, createError } from 'h3'
import { ObjectId } from 'mongodb'
import { isAdmin } from '../../../utils/auth'

const STATI_AMMESSI = ['received', 'in_lavorazione', 'risolta', 'rifiutata']

/**
 * PATCH /api/admin/privacy-requests/[id]
 * Aggiorna lo stato di una richiesta (solo amministratore).
 * Body: { status, note? }
 */
export default defineEventHandler(async (event) => {
  if (!isAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  if (!id || !ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID richiesta non valido.' })
  }

  const body = await readBody(event)

  if (!STATI_AMMESSI.includes(body?.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Stato non valido.' })
  }
  if (body.note !== undefined && (typeof body.note !== 'string' || body.note.length > 2000)) {
    throw createError({ statusCode: 400, statusMessage: 'Nota non valida (max 2000 caratteri).' })
  }

  const { db } = await connectToDatabase()

  const result = await db.collection('privacy_requests').findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        status: body.status,
        ...(typeof body.note === 'string' ? { nota_interna: body.note } : {}),
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after', projection: { token: 0 } }
  )

  if (!result) {
    throw createError({ statusCode: 404, statusMessage: 'Richiesta non trovata.' })
  }

  return { success: true, request: result }
})
