import { getCookie, setCookie, getHeader } from 'h3'
import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE_ADMIN = 'rr_admin'
const COOKIE_PORTAL = 'rr_portal'

function secret() {
  const config = useRuntimeConfig()
  return process.env.ADMIN_SESSION_SECRET || (config.adminSessionSecret as string) || 'dev-only-insecure-secret'
}

function b64url(input: Buffer | string) {
  return Buffer.isBuffer(input) ? input.toString('base64url') : Buffer.from(input).toString('base64url')
}

export function signSession(payload: Record<string, any>, maxAgeSeconds = 8 * 60 * 60) {
  const body = b64url(JSON.stringify({ ...payload, exp: Date.now() + maxAgeSeconds * 1000, iat: Date.now() }))
  const sig = b64url(createHmacBuffer(body))
  return `${body}.${sig}`
}

function createHmacBuffer(value: string) {
  const hmac = createHmac('sha256', secret())
  hmac.update(value)
  return hmac.digest()
}

export function verifySession(token: string | null | undefined): Record<string, any> | null {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [body, sig] = parts
  const expected = b64url(createHmacBuffer(body))
  if (!safeEqual(sig, expected)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
    if (!payload || typeof payload.exp !== 'number' || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export function getAdminToken(event: any) {
  const cookie = getCookie(event, COOKIE_ADMIN)
  if (cookie) return cookie
  const auth = getHeader(event, 'authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) return auth.slice(7)
  return null
}

export function getPortalToken(event: any) {
  const cookie = getCookie(event, COOKIE_PORTAL)
  if (cookie) return cookie
  const auth = getHeader(event, 'authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) return auth.slice(7)
  return null
}

export function setAdminCookie(event: any, token: string, maxAgeSeconds = 8 * 60 * 60) {
  setCookie(event, COOKIE_ADMIN, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds,
    secure: process.env.NODE_ENV === 'production'
  })
}

export function setPortalCookie(event: any, token: string, maxAgeSeconds = 7 * 24 * 60 * 60) {
  setCookie(event, COOKIE_PORTAL, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds,
    secure: process.env.NODE_ENV === 'production'
  })
}

export function clearAdminCookie(event: any) {
  setCookie(event, COOKIE_ADMIN, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0, secure: process.env.NODE_ENV === 'production' })
}

export function clearPortalCookie(event: any) {
  setCookie(event, COOKIE_PORTAL, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0, secure: process.env.NODE_ENV === 'production' })
}

export function isAdmin(event: any) {
  const payload = verifySession(getAdminToken(event))
  return payload && payload.role === 'admin'
}

export function getPortalPayload(event: any) {
  return verifySession(getPortalToken(event))
}
