import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { MongoClient } from 'mongodb';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// MongoDB configuration
const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017';
const DATABASE_NAME = 'manchester_seals';
const COLLECTION_NAME = 'roster';

let mongoClient: MongoClient | null = null;

/**
 * Initialize MongoDB connection
 */
async function initializeMongoConnection(): Promise<MongoClient> {
  if (mongoClient) {
    try {
      await mongoClient.db('admin').admin().ping();
      return mongoClient as MongoClient;
    } catch (error) {
      mongoClient = null;
    }
  }

  mongoClient = new MongoClient(MONGODB_URI);
  try {
    await mongoClient.connect();
    console.log('✓ MongoDB connected successfully');
    return mongoClient;
  } catch (error) {
    console.error('✗ Failed to connect to MongoDB:', error);
    mongoClient = null;
    throw error;
  }
}

/**
 * Roster API Routes
 */

// GET /api/roster - Retrieve all roster data
app.get('/api/roster', async (req, res) => {
  try {
    const client = await initializeMongoConnection();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const rosterData = await collection.find({}).toArray();

    res.json({
      success: true,
      data: rosterData,
      count: rosterData.length
    });
  } catch (error) {
    console.error('Error fetching roster:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/roster/position/:position - Retrieve roster by position
app.get('/api/roster/position/:position', async (req, res) => {
  try {
    const client = await initializeMongoConnection();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const { position } = req.params;
    const rosterData = await collection.find({ position }).toArray();

    res.json({
      success: true,
      data: rosterData,
      count: rosterData.length,
      filter: { position }
    });
  } catch (error) {
    console.error('Error fetching roster by position:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/roster/number/:number - Retrieve roster by player number
app.get('/api/roster/number/:number', async (req, res) => {
  try {
    const client = await initializeMongoConnection();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const { number } = req.params;
    const rosterData = await collection.find({ number }).toArray();

    res.json({
      success: true,
      data: rosterData,
      count: rosterData.length,
      filter: { number }
    });
  } catch (error) {
    console.error('Error fetching roster by number:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Set Content Security Policy header to allow inline styles
 */
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'"
  );
  next();
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
