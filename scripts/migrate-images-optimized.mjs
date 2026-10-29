import { MongoClient } from 'mongodb'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = join(__dirname, '..', 'public')

const DRY_RUN = process.argv.includes('--dry-run')
const APPLY = process.argv.includes('--apply')

const CLOUDINARY_TRANSFORMS = 'f_auto,q_auto,dpr_auto,c_limit'

function migrateCloudinaryUrl(url) {
  if (typeof url !== 'string' || !url) return url
  const qIndex = url.indexOf('?')
  const base = qIndex === -1 ? url : url.slice(0, qIndex)
  const qs = qIndex === -1 ? '' : url.slice(qIndex)
  const marker = '/image/upload/'
  const idx = base.indexOf(marker)
  if (idx === -1) return url
  const before = base.slice(0, idx + marker.length)
  const rest = base.slice(idx + marker.length)
  const m = rest.match(/^v\d+\/(.*)$/s)
  if (!m) return url
  const pub = m[1]
  if (pub.includes('f_auto')) return url // già ottimizzato
  const newBase = before + CLOUDINARY_TRANSFORMS + '/' + rest
  return newBase + qs
}

function migrateStaticUrl(url) {
  if (typeof url !== 'string' || !url) return url
  let path = url
  const qIndex = url.indexOf('?')
  if (qIndex !== -1) path = url.slice(0, qIndex)
  if (!path.startsWith('/')) return url
  if (!/\.(jpe?g|png|webp|avif|svg|gif|ico)$/i.test(path)) return url
  const lower = path.toLowerCase()
  if (/\.(webp|avif|svg|gif)$/i.test(lower)) return url // già ottimizzato
  const dot = path.lastIndexOf('.')
  const stem = path.slice(0, dot)
  const candidates = ['.webp', '.avif'].map((c) => `${stem}${c}`)
  const found = candidates.find((c) => existsSync(join(PUBLIC_DIR, c.slice(1))))
  if (!found) return url // asset statico non ancora presente come WebP/AVIF
  return url.replace(/\.(jpe?g|png)$/i, found)
}

function migrateImageUrl(url) {
  if (!url) return url
  if (typeof url !== 'string') return url
  if (url.includes('res.cloudinary.com')) return migrateCloudinaryUrl(url)
  return migrateStaticUrl(url)
}

function migrateImageField(value) {
  if (Array.isArray(value)) return value.map((v) => migrateImageUrl(v))
  return migrateImageUrl(value)
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI non trovata nel .env')

  const client = new MongoClient(uri, {
    connectTimeoutMS: 15000,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000
  })
  await client.connect()
  const dbName = process.env.MONGODB_DB_NAME || 'roadrunner_db'
  const db = client.db(dbName)

  const targets = [
    { collection: 'motos', field: 'immagini', type: 'array' },
    { collection: 'helmets', field: 'immagini', type: 'array' },
    { collection: 'tradeins', field: 'images', type: 'array' },
    { collection: 'blog_posts', field: 'imageCover', type: 'string' },
    { collection: 'portal_documents', field: 'url', type: 'string' },
    { collection: 'portal_vehicles', field: 'photoUrl', type: 'string' }
  ]

  for (const t of targets) {
    const coll = db.collection(t.collection)
    const cursor = coll.find({})
    let scanned = 0
    let updated = 0
    const changes = []

    for await (const doc of cursor) {
      scanned++
      const value = doc[t.field]
      const migrated = migrateImageField(value)

      if (t.type === 'array') {
        const changed = JSON.stringify(value) !== JSON.stringify(migrated)
        if (changed) {
          changes.push({ id: String(doc._id), field: t.field, from: value, to: migrated })
          if (APPLY) {
            await coll.updateOne({ _id: doc._id }, { $set: { [t.field]: migrated } })
            updated++
          }
        }
      } else {
        const changed = value !== migrated && String(value) !== String(migrated)
        if (changed) {
          changes.push({ id: String(doc._id), field: t.field, from: value, to: migrated })
          if (APPLY) {
            await coll.updateOne({ _id: doc._id }, { $set: { [t.field]: migrated } })
            updated++
          }
        }
      }
    }

    console.log(`[MIGRATION] ${t.collection}.${t.field}: scanned=${scanned} updated=${updated}`)
    if (changes.length) {
      console.log(`[MIGRATION] ${t.collection}.${t.field}: sample di cambiamenti (${changes.length}):`)
      for (const c of changes.slice(0, 10)) {
        console.log(`  - ${c.id}: ${c.field}\n    PRIMA: ${c.from}\n    DOPO : ${c.to}`)
      }
      if (changes.length > 10) console.log(`  ... e altri ${changes.length - 10}`)
    }
  }

  await client.close()
  console.log(DRY_RUN ? '[MIGRATION] DRY-RUN completato: nessun write eseguito.' : '[MIGRATION] MIGRAZIONE COMPLETATA.')
}

main().catch(async (e) => {
  console.error('[MIGRATION] ERRORE:', e)
  process.exit(1)
})
