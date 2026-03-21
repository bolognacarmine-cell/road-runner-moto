
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

async function testConnection() {
  console.log('--- TEST CONNESSIONE MONGODB ---');
  console.log('URI:', uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'NON DEFINITO');
  
  if (!uri) {
    console.error('ERRORE: MONGODB_URI non trovata in .env');
    return;
  }

  const client = new MongoClient(uri, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000
  });

  try {
    console.log('Tentativo di connessione...');
    await client.connect();
    console.log('✅ CONNESSIONE RIUSCITA!');
    
    const db = client.db('roadrunner_db');
    const collections = await db.listCollections().toArray();
    console.log('Collezioni trovate:', collections.map(c => c.name));
    
  } catch (err) {
    console.error('❌ ERRORE DI CONNESSIONE:');
    console.error('Messaggio:', err.message);
    console.error('Codice:', err.code);
    console.error('Nome:', err.name);
    
    if (err.message.includes('IP address') || err.message.includes('whitelist')) {
      console.error('\nSUGGERIMENTO: Il tuo indirizzo IP non è abilitato su MongoDB Atlas.');
    } else if (err.message.includes('authentication failed')) {
      console.error('\nSUGGERIMENTO: Username o Password errati.');
    } else if (err.message.includes('timed out')) {
      console.error('\nSUGGERIMENTO: Timeout della connessione. Potrebbe essere un firewall o una rete instabile.');
    }
  } finally {
    await client.close();
    console.log('--- TEST COMPLETATO ---');
  }
}

testConnection();
