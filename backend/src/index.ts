import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateEnv } from './utils/env';
import { initializeDatabase, closeDatabase } from './utils/mongoose';
import appRoutes from './app.route';
import { errorHandler, notFoundHandler } from './middleware/error.handler';

dotenv.config();
validateEnv();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

initializeDatabase().catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

app.use(appRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await closeDatabase();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
  console.log(`Database: ${process.env.MONGODB_DB_NAME}`);
});
