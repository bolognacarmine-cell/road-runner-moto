
import { MongoClient } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

async function testConnections() {
  console.log('--- INIZIO TEST CONNESSIONI ---');

  // 1. Test MongoDB
  console.log('\n1. Test MongoDB...');
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ Errore: MONGODB_URI non trovata nel file .env');
  } else {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    try {
      await client.connect();
      console.log('✅ MongoDB: Connessione riuscita!');
      const db = client.db(process.env.MONGODB_DB_NAME || 'roadrunner_db');
      await db.command({ ping: 1 });
      console.log('✅ MongoDB: Database raggiungibile!');
    } catch (err) {
      console.error('❌ MongoDB: Connessione fallita!');
      console.error('Dettaglio errore:', err.message);
      if (err.message.includes('IP address')) {
        console.log('👉 Suggerimento: Il tuo IP locale non è nella whitelist di Atlas.');
      }
    } finally {
      await client.close();
    }
  }

  // 2. Test Cloudinary
  console.log('\n2. Test Cloudinary...');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOCUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary: Connessione riuscita!');
  } catch (err) {
    console.error('❌ Cloudinary: Connessione fallita!');
    console.error('Dettaglio errore:', err.message);
    console.log('👉 Suggerimento: Verifica che CLOUDINARY_API_SECRET sia completa (clicca sull\'occhio su Cloudinary).');
  }

  console.log('\n--- FINE TEST ---');
}

testConnections();
