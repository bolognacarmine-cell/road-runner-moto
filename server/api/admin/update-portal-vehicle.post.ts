import { defineEventHandler, readBody, createError } from 'h3'
import { MongoClient } from 'mongodb'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  const { marca, modello, targa, photoUrl, dataAcquisto, kmIniziali, kmAttuali, prossimaManutenzione, avvisi } = body

  if (!targa) {
    throw createError({ statusCode: 400, statusMessage: 'Targa obbligatoria.' })
  }

  const client = new MongoClient(config.mongodbUri)

  try {
    await client.connect()
    const db = client.db(config.mongodbDbName)
    
    console.log('UPDATING VEHICLE FOR TARGA:', targa.toUpperCase())
    console.log('DATA:', { marca, modello, dataAcquisto, kmIniziali, kmAttuali, prossimaManutenzione, avvisi })

    // Upsert: aggiorna se esiste, altrimenti crea
    const result = await db.collection('portal_vehicles').updateOne(
      { targa: targa.toUpperCase() },
      { 
        $set: { 
          marca: marca || '', 
          modello: modello || '', 
          photoUrl: photoUrl || '',
          dataAcquisto: dataAcquisto || null,
          kmIniziali: Number(kmIniziali) || 0,
          kmAttuali: Number(kmAttuali) || 0,
          prossimaManutenzione: prossimaManutenzione || '',
          avvisi: avvisi || '',
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    )

    console.log('UPDATE RESULT:', result)

    return { success: true, message: 'Veicolo salvato.' }

  } catch (error: any) {
    console.error('ERRORE DETTAGLIATO UPDATE PORTAL VEHICLE:', error)
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Errore salvataggio veicolo.',
      message: error.message 
    })
  } finally {
    await client.close()
  }
})
