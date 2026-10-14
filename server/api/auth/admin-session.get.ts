import { defineEventHandler, createError } from 'h3'
import { getAdminToken, verifySession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getAdminToken(event)
  const payload = verifySession(token)
  if (!payload || payload.role !== 'admin') {
    throw createError({ statusCode: 401, statusMessage: 'Non autenticato.' })
  }
  return { success: true, user: payload.u }
})