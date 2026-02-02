/**
 * Example External REST Service
 * Run with: node example-external-server.mjs
 * This demonstrates a simple REST service that the Angular app can connect to
 */

import http from 'http';

const PORT = 8080;

// Sample roster data
const rosterData = [
  { name: 'John Smith', position: 'Pitcher', number: '12', team: 'External Service' },
  { name: 'Mike Johnson', position: 'Catcher', number: '5', team: 'External Service' },
  { name: 'Tom Wilson', position: 'First Base', number: '3', team: 'External Service' },
  { name: 'Dave Brown', position: 'Outfield', number: '7', team: 'External Service' }
];

// Sample stats data
const statsData = {
  games: 25,
  wins: 15,
  losses: 10,
  average: '.600'
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  const url = req.url;
  const method = req.method;
  
  console.log(`${new Date().toISOString()} - ${method} ${url}`);
  
  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    console.log('Preflight request handled');
    return;
  }
  
  // Route handling
  if (url === '/roster' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rosterData));
  }
  else if (url === '/stats' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(statsData));
  }
  else if (url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
  }
  else if (url.startsWith('/roster/') && req.method === 'GET') {
    const id = url.split('/')[2];
    const player = rosterData.find((p, index) => index.toString() === id);
    if (player) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(player));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Player not found' }));
    }
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Not found',
      availableEndpoints: ['/roster', '/stats', '/health', '/roster/:id']
    }));
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 External REST Service running at http://localhost:${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log(`  GET http://localhost:${PORT}/roster`);
  console.log(`  GET http://localhost:${PORT}/stats`);
  console.log(`  GET http://localhost:${PORT}/health`);
  console.log(`  GET http://localhost:${PORT}/roster/:id`);
  console.log('\nPress Ctrl+C to stop\n');
});
