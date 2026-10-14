import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const PREFIX = 'scrypt'

export function hashPassword(password: string) {
  const salt = randomBytes(16)
  const derived = scryptSync(password, salt, 64)
  return `${PREFIX}$${salt.toString('base64url')}$${derived.toString('base64url')}`
}

export function verifyPassword(password: string, stored: string): { valid: boolean; needsUpgrade: boolean } {
  if (!stored || typeof stored !== 'string') return { valid: false, needsUpgrade: false }
  if (stored.startsWith(`${PREFIX}$`)) {
    const parts = stored.split('$')
    if (parts.length !== 3) return { valid: false, needsUpgrade: false }
    try {
      const salt = Buffer.from(parts[1], 'base64url')
      const hash = Buffer.from(parts[2], 'base64url')
      const derived = scryptSync(password, salt, hash.length)
      if (derived.length !== hash.length) return { valid: false, needsUpgrade: false }
      return { valid: timingSafeEqual(derived, hash), needsUpgrade: false }
    } catch {
      return { valid: false, needsUpgrade: false }
    }
  }
  // Legacy plaintext password support (upgrade on successful login)
  return { valid: password === stored, needsUpgrade: true }
}
