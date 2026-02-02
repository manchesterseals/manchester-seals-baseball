#!/usr/bin/env node

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'manchester_seals';
const COLLECTION_NAME = 'roster';

async function main() {
  let client = null;
  try {
    console.log('🔷 Manchester Seals Baseball - MongoDB Roster Retrieval\n');
    
    // Connect to MongoDB
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✓ Connected to MongoDB successfully\n');
    
    // Get database and collection
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Retrieve all roster data
    console.log('--- All Roster Data ---');
    const allRoster = await collection.find({}).toArray();
    console.log(`✓ Retrieved ${allRoster.length} roster entries\n`);
    console.log(JSON.stringify(allRoster, null, 2));
    
    // Retrieve pitchers only
    console.log('\n--- Pitchers Only ---');
    const pitchers = await collection.find({ position: 'Pitcher' }).toArray();
    console.log(`✓ Retrieved ${pitchers.length} pitcher(s)\n`);
    console.log(JSON.stringify(pitchers, null, 2));
    
    // Retrieve outfielders
    console.log('\n--- Outfielders ---');
    const outfielders = await collection.find({ position: 'Outfield' }).toArray();
    console.log(`✓ Retrieved ${outfielders.length} outfielder(s)\n`);
    console.log(JSON.stringify(outfielders, null, 2));
    
    console.log('\n✓ Script completed successfully');
    
  } catch (error) {
    console.error('\n✗ Error occurred:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n✓ Disconnected from MongoDB');
    }
  }
}

main();
