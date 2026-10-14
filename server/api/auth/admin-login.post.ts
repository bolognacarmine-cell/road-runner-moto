import { defineEventHandler, readBody, createError } from 'h3'
import { safeEqual, signSession, setAdminCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))
  const username = body?.username
  const password = body?.password

  const config = useRuntimeConfig()
  const adminUser = process.env.ADMIN_USER || (config.adminUser as string)
  const adminPassword = process.env.ADMIN_PASSWORD || (config.adminPassword as string)
  const adminSessionSecret = process.env.ADMIN_SESSION_SECRET || (config.adminSessionSecret as string)

  if (!adminUser || !adminPassword || !adminSessionSecret) {
    throw createError({ statusCode: 500, statusMessage: 'Autenticazione admin non configurata sul server.' })
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Username e password obbligatorie.' })
  }

  const okUser = safeEqual(username, String(adminUser))
  const okPass = safeEqual(password, String(adminPassword))
  if (!okUser || !okPass) {
    throw createError({ statusCode: 401, statusMessage: 'Credenziali non valide.' })
  }

  const token = signSession({ role: 'admin', u: String(adminUser) }, 8 * 60 * 60)
  setAdminCookie(event, token, 8 * 60 * 60)

  return { success: true }
})