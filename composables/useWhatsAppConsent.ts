/**
 * Consenso WhatsApp (categoria opzionale del banner Silktide).
 *
 * Il manager Silktide salva la scelta per categoria in localStorage
 * con la chiave `silktideCookieChoice_<id>` (suffix vuoto in questa versione).
 * I link wa.me vengono bloccati finché l'utente non concede il consenso:
 * il click apre il pannello preferenze del banner invece di uscire dal sito.
 */

const CONSENT_KEY = 'silktideCookieChoice_whatsapp'

// link WhatsApp in sospeso: aperto automaticamente appena arriva il consenso
let pendingHref: string | null = null

export function isWhatsAppConsented(): boolean {
  if (import.meta.server) return false
  return localStorage.getItem(CONSENT_KEY) === 'true'
}

export function setPendingWhatsAppHref(href: string | null) {
  pendingHref = href
}

export function consumePendingWhatsAppHref(): string | null {
  const href = pendingHref
  pendingHref = null
  return href
}
