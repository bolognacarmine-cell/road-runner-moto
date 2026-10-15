import { defineEventHandler, readBody, createError, getRequestIP } from 'h3'
import { safeEqual, signSession, setAdminCookie } from '../../utils/auth'

// Rate limiting: max 5 tentativi per IP ogni 15 minuti
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = loginAttempts.get(ip)
  if (!record || record.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  record.count++
  return record.count > MAX_ATTEMPTS
}

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

  if (isRateLimited(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Troppi tentativi. Riprova tra 15 minuti.' })
  }

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