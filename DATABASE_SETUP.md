# Database Setup Guide

Your application now uses a backend API server to connect to the PostgreSQL database at 192.168.86.27. This setup was required because the `pg` (node-postgres) package cannot run in browser environments.

## Architecture

```
Browser (Vite App) --> API Server (Express) --> PostgreSQL Database
     :3000                :3001                192.168.86.27:5432
```

## Running the Application

You need to run **both** the API server and the Vite app:

### Terminal 1 - Start the Database API Server
```bash
npm run dev:server
```
This starts the Express server on port 3001.

### Terminal 2 - Start the Vite App
```bash
npm run dev
```
This starts the Vite dev server on port 3000.

## Configuration

All database configuration is in `.env`:
- `VITE_DB_HOST` - PostgreSQL host (192.168.86.27)
- `VITE_DB_PORT` - PostgreSQL port (5432)
- `VITE_DB_NAME` - Database name (wissil_db)
- `VITE_DB_USER` - Database user (slate_user)
- `VITE_DB_PASSWORD` - Your database password
- `VITE_API_URL` - API server URL (http://localhost:3001)

## How It Works

1. The browser app calls the database client functions in `src/lib/database/client.ts`
2. These functions make HTTP requests to the API server
3. The API server (in `server/index.js`) uses the `pg` package to connect to PostgreSQL
4. Results are sent back to the browser

## Production Deployment

For production, you'll need to:
1. Deploy the API server to a Node.js hosting service
2. Update `VITE_API_URL` in production to point to your deployed API server
3. Ensure proper CORS configuration
4. Add authentication/authorization to the API endpoints
5. Use environment-specific configuration for database credentials
