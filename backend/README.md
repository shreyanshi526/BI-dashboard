# TDK BI Dashboard Backend

Backend API for TDK Business Intelligence Dashboard built with TypeScript, Express, and MongoDB.

## Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or remote instance)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend root:
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=tdk_dashboard
PORT=3001
NODE_ENV=development
```

3. Build TypeScript:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

For development with hot reload:
```bash
npm run dev
```

## MongoDB Connection

The MongoDB connection is managed through a connection pool utility located in `src/utils/mongodb.ts`.

### Features:
- Connection pooling (min: 5, max: 10 connections)
- Automatic reconnection
- Health check (ping) functionality
- Graceful connection closing

### Usage:

```typescript
import { initMongoDB, getDatabase, connectMongoDB } from './utils/mongodb';

// Initialize connection
const mongoConnection = initMongoDB({
  uri: process.env.MONGODB_URI,
  dbName: process.env.MONGODB_DB_NAME,
});

// Connect
await connectMongoDB();

// Get database instance
const db = getDatabase();

// Use database
const collection = db.collection('your_collection');
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts      # Database initialization
│   ├── utils/
│   │   ├── mongodb.ts       # MongoDB connection utility
│   │   └── index.ts         # Utils exports
│   ├── index.ts             # Main server file
│   └── seed.ts              # Database seeding
├── dist/                    # Compiled JavaScript
├── tsconfig.json           # TypeScript configuration
└── package.json
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run dev` - Start development server with hot reload
- `npm run seed` - Seed the database
- `npm run type-check` - Type check without building

