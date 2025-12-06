# Database API Server

This Express server provides a REST API for PostgreSQL database operations, allowing the browser-based Vite app to connect to your PostgreSQL database at 192.168.86.27.

## Why is this needed?

The `pg` (node-postgres) package only works in Node.js environments, not in browsers. This server acts as a proxy between your browser app and the PostgreSQL database.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Configure environment variables in the root `.env` file (already configured)

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will run on port 3001 by default.

## Running Both Client and Server

In separate terminals:

**Terminal 1 - API Server:**
```bash
cd server
npm start
```

**Terminal 2 - Vite App:**
```bash
npm run dev
```

## API Endpoints

### POST /api/query
Execute a single query
```json
{
  "text": "SELECT * FROM users WHERE id = $1",
  "params": [1],
  "useReplica": false
}
```

### POST /api/transaction
Execute multiple queries in a transaction
```json
{
  "queries": [
    { "text": "INSERT INTO users (name) VALUES ($1)", "params": ["John"] },
    { "text": "UPDATE stats SET count = count + 1", "params": [] }
  ]
}
```

### GET /api/health
Health check endpoint
