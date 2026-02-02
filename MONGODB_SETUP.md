# MongoDB Setup Guide - Manchester Seals Baseball

## Overview
This guide helps you set up MongoDB connection for the Manchester Seals Baseball application to retrieve roster data from a MongoDB database.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (v4.4 or higher)
3. **npm** or **yarn** package manager

## Installation

### Step 1: Install MongoDB Driver
```bash
cd manchester-seals
npm install mongodb
npm install --save-dev @types/mongodb
```

### Step 2: MongoDB Setup

#### Option A: Local MongoDB Installation
```bash
# macOS with Homebrew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify MongoDB is running
mongo --version
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`

### Step 3: Create Database and Collection

Connect to MongoDB and run these commands:

```javascript
// Use or create the manchester_seals database
use manchester_seals;

// Create roster collection
db.createCollection("roster");

// Insert sample roster data
db.roster.insertMany([
  { "name": "Joe Hanily", "position": "Manager", "number": "20" },
  { "name": "Sam Smith", "position": "Pitcher", "number": "12" },
  { "name": "Tom Johnson", "position": "Catcher", "number": "8" },
  { "name": "Alex Rivera", "position": "First Base", "number": "5" },
  { "name": "Chris Lee", "position": "Shortstop", "number": "3" },
  { "name": "Matt Brown", "position": "Outfield", "number": "11" }
]);

// Verify data insertion
db.roster.find().pretty();
```

## Configuration

### Environment Variables
Create a `.env` file in the `manchester-seals` directory:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017

# Or for MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/?retryWrites=true&w=majority
```

## Usage

### 1. Direct Node.js Script (get-roster.ts)

Run the example script:
```bash
npx ts-node get-roster.ts
```

### 2. Using in Express Server

Import and use the roster service in your `server.ts`:

```typescript
import express from 'express';
import { setupRosterRoutes } from './src/app/common/roster.service.js';

const app = express();

// Setup roster API routes
setupRosterRoutes(app);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### 3. API Endpoints

Once the Express server is running:

```bash
# Get all roster data
curl http://localhost:3000/api/roster

# Get roster by position
curl http://localhost:3000/api/roster/position/Pitcher
curl http://localhost:3000/api/roster/position/Outfield

# Get roster by player number
curl http://localhost:3000/api/roster/number/20
```

### 4. Using in Angular Component

```typescript
import { getRosterData, initializeDatabase } from './common/mongodb-connection';

export class RosterComponent implements OnInit {
  roster: any[] = [];

  async ngOnInit() {
    try {
      await initializeDatabase();
      this.roster = await getRosterData();
    } catch (error) {
      console.error('Failed to load roster:', error);
    }
  }
}
```

## Module Functions

### `mongodb-connection.ts`

- **`connectToDatabase()`** - Establish MongoDB connection
- **`initializeDatabase()`** - Initialize and get database instance
- **`getRosterData()`** - Retrieve all roster documents
- **`getRosterDataFiltered(filter)`** - Retrieve filtered roster data
- **`disconnectDatabase()`** - Close MongoDB connection

### `roster.service.ts`

Express routes for roster API:
- `GET /api/roster` - Get all roster
- `GET /api/roster/position/:position` - Get by position
- `GET /api/roster/number/:number` - Get by number

## Troubleshooting

### Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB service is running
```bash
brew services start mongodb-community
```

### Authentication Error
```
Error: authentication failed
```
**Solution**: Check MONGODB_URI credentials and ensure user has database access

### Collection Not Found
```
Error: ns does not exist
```
**Solution**: Ensure you've created the `roster` collection with sample data

## Database Schema

The roster collection documents have the following structure:

```json
{
  "_id": ObjectId,
  "name": "Player Name",
  "position": "Position",
  "number": "Jersey Number"
}
```

## Next Steps

1. Integrate roster API into your Angular components
2. Add data validation and error handling
3. Implement caching for performance
4. Add roster management (create, update, delete)
5. Implement authentication for API endpoints

## Resources

- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [MongoDB Node Driver](https://docs.mongodb.com/drivers/node/)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
