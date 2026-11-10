import { randomBytes } from 'node:crypto'
import { createError } from 'h3'

/**
 * POST /api/privacy-requests
 * Modulo per le richieste degli interessati (GDPR artt. 15-21).
 *
 * Input (body):
 *   nome      string  2-100 caratteri (obbligatorio)
 *   email     string  email valida (obbligatorio)
 *   telefono  string  facoltativo, max 30
 *   tipo      'accesso' | 'rettifica' | 'cancellazione' | 'limitazione' | 'portabilita' | 'opposizione'
 *   messaggio string  10-5000 caratteri (obbligatorio)
 *   consenso  boolean deve essere true
 *
 * Output:
 *   { ok, reference, deadline, autoResponse }
 *
 * La risposta automatica è confermata all'istante: la richiesta riceve un codice
 * univoco (reference) e una scadenza di 30 giorni. Nessun dato personale oltre
 * al minimo indispensabile viene restituito.
 */

const TIPI_AMMESSI = ['accesso', 'rettifica', 'cancellazione', 'limitazione', 'portabilita', 'opposizione']
const STATO_INIZIALE = 'received'

// Rate limit semplice in memoria: max 5 richieste/ora per IP (niente nuove dipendenze)
const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function clientIp(event: any): string {
  const fwd = getHeader(event, 'x-forwarded-for')
  if (fwd) return String(fwd).split(',')[0].trim()
  return event.node?.req?.socket?.remoteAddress || 'unknown'
}

function isRateLimited(event: any): boolean {
  const ip = clientIp(event)
  const now = Date.now()
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  list.push(now)
  hits.set(ip, list)
  return list.length > MAX_PER_WINDOW
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Metodo non consentito.' })
  }

  if (isRateLimited(event)) {
    throw createError({ statusCode: 429, statusMessage: 'Troppe richieste. Riprova più tardi.' })
  }

  const body = await readBody(event)

  // --- validazione lato server (il client non è attendibile) ---------------
  if (typeof body?.nome !== 'string' || body.nome.trim().length < 2 || body.nome.trim().length > 100) {
    throw createError({ statusCode: 400, statusMessage: 'Il nome è obbligatorio (2-100 caratteri).' })
  }
  if (typeof body?.email !== 'string' || !EMAIL_RE.test(body.email.trim())) {
    throw createError({ statusCode: 400, statusMessage: 'Indirizzo email non valido.' })
  }
  if (body.telefono !== undefined && (typeof body.telefono !== 'string' || body.telefono.trim().length > 30)) {
    throw createError({ statusCode: 400, statusMessage: 'Numero di telefono non valido.' })
  }
  if (!TIPI_AMMESSI.includes(body?.tipo)) {
    throw createError({ statusCode: 400, statusMessage: 'Tipo di richiesta non valido.' })
  }
  if (typeof body?.messaggio !== 'string' || body.messaggio.trim().length < 10 || body.messaggio.trim().length > 5000) {
    throw createError({ statusCode: 400, statusMessage: 'Il messaggio deve avere tra 10 e 5000 caratteri.' })
  }
  if (body.consenso !== true) {
    throw createError({ statusCode: 400, statusMessage: 'È necessario il consenso al trattamento.' })
  }

  const token = randomBytes(16).toString('hex')
  const now = new Date()
  const deadline = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const autoResponse = {
    sentAt: now,
    channel: 'on-site',
    subject: `Richiesta ${body.tipo} registrata`,
    text:
      `La tua richiesta di ${body.tipo} è stata registrata correttamente. ` +
      `Riferimento: ${token}. ` +
      `Risponderemo entro 30 giorni (scadenza: ${deadline.toISOString().slice(0, 10)}). ` +
      `Puoi verificare lo stato in qualsiasi momento usando il codice di riferimento.`
  }

  const { db } = await connectToDatabase()
  const collection = db.collection('privacy_requests')

  // L'indice univoco su token garantisce che non possano esistere duplicati
  try {
    await collection.createIndex({ token: 1 }, { unique: true })
  } catch {
    // l'indice esiste già: ignora
  }

  try {
    await collection.insertOne({
      token,
      nome: body.nome.trim(),
      email: body.email.trim().toLowerCase(),
      telefono: typeof body.telefono === 'string' ? body.telefono.trim() : '',
      tipo: body.tipo,
      messaggio: body.messaggio.trim(),
      consenso: true,
      status: STATO_INIZIALE,
      deadline,
      autoResponse,
      createdAt: now,
      updatedAt: now
    })
  } catch (error: any) {
    console.error('ERRORE PRIVACY REQUESTS POST:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante la registrazione della richiesta.'
    })
  }

  return {
    ok: true,
    reference: token,
    deadline: deadline.toISOString(),
    autoResponse: { subject: autoResponse.subject, text: autoResponse.text }
  }
})
