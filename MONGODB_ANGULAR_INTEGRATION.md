# MongoDB Integration with Angular - Setup Summary

## 📋 What Was Configured

### 1. **Express API Routes** (`src/server.ts`)
Added three REST endpoints to retrieve MongoDB roster data:

- **GET `/api/roster`** - Retrieve all roster data
- **GET `/api/roster/position/:position`** - Filter by position (e.g., Pitcher, Outfield)
- **GET `/api/roster/number/:number`** - Filter by player number

### 2. **Angular Service** (`src/app/common/roster-api.service.ts`)
Created a service to communicate with MongoDB API endpoints:

```typescript
// Usage examples:
rosterService.getAllRoster(); // Get all roster
rosterService.getRosterByPosition('Pitcher'); // Get pitchers
rosterService.getRosterByNumber('20'); // Get player #20
```

### 3. **Roster Component** (`src/app/roster/roster.component.ts`)
Enhanced with MongoDB integration:

- `loadRosterFromMongoDB()` - Load all roster data from MongoDB
- `filterByPosition(position)` - Filter by player position
- `filterByNumber(number)` - Filter by player number
- Displays MongoDB data in real-time

### 4. **Component Template** (`src/app/roster/roster.component.html`)
Added MongoDB data section with:

- Refresh button to reload data from MongoDB
- Filter buttons for Pitchers, Outfielders, and All Players
- Live MongoDB data display with MongoDB ObjectID
- Record count display
- Loading and error states

### 5. **Component Styles** (`src/app/roster/roster.component.css`)
Added styling for:

- MongoDB section with green accent border
- Filter buttons with hover effects
- Data loading and error messages
- MongoDB ObjectID display formatting

### 6. **App Configuration** (`src/app/app.config.ts`)
Configured Angular providers:

- Added `provideHttpClient()` for HTTP communication
- Enables REST API calls from components

## 🚀 How to Use

### Start the Server
```bash
cd manchester-seals
npm run build
npm run serve:ssr:manchester-seals
```

Or for development:
```bash
npm start
```

### API Endpoints

The server runs on `http://localhost:4000` (default) or the PORT environment variable.

**Get all roster:**
```bash
curl http://localhost:4000/api/roster
```

**Filter by position:**
```bash
curl http://localhost:4000/api/roster/position/Pitcher
curl http://localhost:4000/api/roster/position/Outfield
```

**Filter by number:**
```bash
curl http://localhost:4000/api/roster/number/20
```

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "name": "Player Name",
      "position": "Position",
      "number": "Jersey Number"
    }
  ],
  "count": 6,
  "filter": { "position": "Pitcher" }
}
```

## 📱 Angular Component Usage

The Roster component automatically loads MongoDB data on initialization and provides:

1. **Buttons to filter data:**
   - "Refresh from MongoDB" - Load all players
   - "Pitchers" - Show only pitchers
   - "Outfielders" - Show only outfielders

2. **MongoDB Data Display:**
   - Live roster table with MongoDB ObjectID
   - Record counter
   - Loading states

3. **Local Data Management:**
   - Add/Edit/Delete players locally
   - Search and sort functionality
   - Original configuration data still available

## 🔧 Environment Configuration

MongoDB connection uses:

```
MONGODB_URI=mongodb://localhost:27017
```

To change the connection string, set the environment variable:

```bash
export MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

## ✅ Features Implemented

- ✓ MongoDB connection in Express server
- ✓ REST API endpoints for roster data
- ✓ Angular HTTP client integration
- ✓ Real-time data loading from MongoDB
- ✓ Position and number filtering
- ✓ Error handling and loading states
- ✓ MongoDB ObjectID display
- ✓ Responsive UI with styling
- ✓ Standalone Angular service for API calls

## 📁 Files Modified/Created

### Created:
- `src/app/common/roster-api.service.ts` - Angular service for API
- `get-roster.mjs` - Standalone Node.js example

### Modified:
- `src/server.ts` - Added Express API routes
- `src/app/roster/roster.component.ts` - Added MongoDB integration
- `src/app/roster/roster.component.html` - Added MongoDB UI section
- `src/app/roster/roster.component.css` - Added MongoDB styles
- `src/app/app.config.ts` - Added HttpClient provider
- `package.json` - Added "type": "module"

## 🔗 Architecture Flow

```
Angular Component
    ↓
RosterService (REST HTTP calls)
    ↓
Express Server (/api/roster endpoints)
    ↓
MongoDB Client
    ↓
manchester_seals Database → roster Collection
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running:
```bash
brew services start mongodb-community
```

### HTTP Errors
If you see HTTP 500 errors, check:
1. MongoDB connection string in `.env` or environment
2. Database and collection exist
3. Server logs for detailed error messages

### CORS Issues
If frontend can't reach API:
1. Ensure API routes are properly defined
2. Check server is running on correct port
3. Verify no firewall blocking localhost access

## 📖 Next Steps

1. **Add Database Mutations:**
   - Implement POST for creating roster entries
   - Implement PUT for updating entries
   - Implement DELETE for removing entries

2. **Add Authentication:**
   - Secure API endpoints with JWT tokens
   - Add user authentication to Angular app

3. **Enhance Filtering:**
   - Add multi-criteria filtering
   - Implement search with MongoDB text search
   - Add pagination for large datasets

4. **Caching:**
   - Implement RxJS caching strategies
   - Reduce unnecessary API calls
   - Add local storage caching

## ✨ Summary

Your Manchester Seals Baseball app now has full MongoDB integration with:
- Real-time data retrieval from MongoDB
- RESTful API endpoints
- Angular service for clean data access
- Beautiful UI displaying live roster data
- Full error handling and loading states
