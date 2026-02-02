import { MongoClient, Db, Collection } from 'mongodb';

// MongoDB connection configuration
const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017';
const DATABASE_NAME = 'manchester_seals';
const COLLECTION_NAME = 'roster';

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Connect to MongoDB database
 * @returns MongoDB client instance
 */
export async function connectToDatabase(): Promise<MongoClient> {
  if (client) {
    console.log('Using existing MongoDB connection');
    return client;
  }

  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✓ Connected to MongoDB successfully');
    return client;
  } catch (error) {
    console.error('✗ Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Get the database instance
 * @returns MongoDB database instance
 */
export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase() first.');
  }
  return db;
}

/**
 * Initialize database connection
 */
export async function initializeDatabase(): Promise<Db> {
  const connectedClient = await connectToDatabase();
  db = connectedClient.db(DATABASE_NAME);
  console.log(`✓ Using database: ${DATABASE_NAME}`);
  return db;
}

/**
 * Retrieve all roster data from MongoDB
 * @returns Array of roster documents
 */
export async function getRosterData(): Promise<any[]> {
  try {
    if (!db) {
      await initializeDatabase();
    }

    const rosterCollection: Collection = db!.collection(COLLECTION_NAME);
    const rosterData = await rosterCollection.find({}).toArray();

    console.log(`✓ Retrieved ${rosterData.length} roster entries`);
    return rosterData;
  } catch (error) {
    console.error('✗ Failed to retrieve roster data:', error);
    throw error;
  }
}

/**
 * Retrieve roster data with filtering
 * @param filter MongoDB filter object
 * @returns Array of filtered roster documents
 */
export async function getRosterDataFiltered(filter: any = {}): Promise<any[]> {
  try {
    if (!db) {
      await initializeDatabase();
    }

    const rosterCollection: Collection = db!.collection(COLLECTION_NAME);
    const rosterData = await rosterCollection.find(filter).toArray();

    console.log(`✓ Retrieved ${rosterData.length} filtered roster entries`);
    return rosterData;
  } catch (error) {
    console.error('✗ Failed to retrieve filtered roster data:', error);
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('✓ Disconnected from MongoDB');
  }
}
