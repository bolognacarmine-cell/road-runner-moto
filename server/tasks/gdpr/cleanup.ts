import { defineTask } from 'nitro/runtime'
import type { TaskPayload } from 'nitro/runtime'

/**
 * Task di pulizia automatica dei dati personali (GDPR art. 5, principio di limitazione della conservazione).
 *
 * Elimina dal DB i record con dati personali più vecchi del periodo di retention
 * configurato (runtimeConfig.gdprRetentionDays, default 730 giorni = 2 anni).
 *
 * Collezioni interessate:
 *  - leads          → richieste di contatto commerciali (nome, email, telefono)
 *  - tradeins       → richieste di permuta (nome, email, telefono, dettagli veicolo)
 *  - privacy_requests → richieste degli interessati, eliminate 2 anni dopo la ricezione
 *
 * Esecuzione:
 *  - Automatica: tutti i giorni alle 03:00 (nitro.scheduledTasks in nuxt.config.ts)
 *  - Manuale:    POST /api/_nitro/tasks/run/gdpr:cleanup  (in dev)
 */
export default defineTask({
  meta: {
    name: 'gdpr:cleanup',
    description: 'Elimina i dati personali oltre il periodo di retention GDPR'
  },
  async run() {
    const config = useRuntimeConfig()
    const retentionDays = Number(config.gdprRetentionDays) || 730
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)

    const { db } = await connectToDatabase()

    const collections = ['leads', 'tradeins', 'privacy_requests']
    const deleted: Record<string, number> = {}

    for (const name of collections) {
      const result = await db.collection(name).deleteMany({
        createdAt: { $lt: cutoff }
      })
      deleted[name] = result.deletedCount ?? 0
    }

    const total = Object.values(deleted).reduce((sum, n) => sum + n, 0)

    console.log(
      `[GDPR] Pulizia completata: ${total} record eliminati (retention ${retentionDays} giorni, cutoff ${cutoff.toISOString()})`,
      JSON.stringify(deleted)
    )

    return {
      total,
      deleted,
      retentionDays,
      cutoff: cutoff.toISOString()
    } satisfies TaskPayload
  }
})
