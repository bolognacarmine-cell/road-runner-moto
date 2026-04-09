export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { db, client } = await connectToDatabase()

  try {
    const collection = db.collection('leads')

    // Validazione base
    if (!body.nome || !body.email || !body.telefono) {
      throw createError({ statusCode: 400, statusMessage: 'Dati obbligatori mancanti.' })
    }

    const newLead = {
      ...body,
      status: 'nuovo',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(newLead)

    // Nota: Qui si potrebbe aggiungere l'invio email con Nodemailer
    // console.log('Email di notifica inviata al concessionario')

    return {
      success: true,
      message: 'Richiesta ricevuta con successo!',
      id: result.insertedId
    }

  } catch (error: any) {
    console.error('ERRORE LEADS POST:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Errore durante l\'invio della richiesta.',
      data: error.message
    })
  } finally {
    await client.close()
  }
})
