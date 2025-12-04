import mongoose, { Mongoose } from 'mongoose';

interface MongooseConfig {
  uri?: string;
  dbName?: string;
  options?: mongoose.ConnectOptions;
}

class MongooseConnection {
  private connection: Mongoose | null = null;
  private config: MongooseConfig;
  private isConnected: boolean = false;

  constructor(config: MongooseConfig) {
    this.config = config;
  }

  /**
   * Connect to MongoDB using Mongoose
   */
  async connect(): Promise<Mongoose> {
    if (this.isConnected && this.connection) {
      return this.connection;
    }

    try {
      const defaultOptions: mongoose.ConnectOptions = {
        maxPoolSize: 10,
        minPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        ...this.config.options,
      };

      const mongoUri = this.config.uri || process.env.MONGODB_URI || 'mongodb://localhost:27017';
      this.connection = await mongoose.connect(mongoUri, defaultOptions);
      this.isConnected = true;

      console.log(`Connected to MongoDB: ${this.connection.connection.name}`);
      
      return this.connection;
    } catch (error) {
      console.error('Mongoose connection error:', error);
      this.isConnected = false;
      throw error;
    }
  }

  getConnection(): Mongoose {
    if (!this.connection || !this.isConnected) {
      throw new Error('Mongoose not connected. Call connect() first.');
    }
    return this.connection;
  }

  isConnectionActive(): boolean {
    return this.isConnected && this.connection !== null;
  }

  async close(): Promise<void> {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
      this.isConnected = false;
      console.log('Mongoose connection closed');
    }
  }

      async ping(): Promise<boolean> {
        try {
          if (!this.connection) {
            return false;
          }
          await this.connection.connection.db?.admin().ping();
          return true;
        } catch (error) {
          console.error('Mongoose ping failed:', error);
          return false;
        }
      }
}

let mongooseConnection: MongooseConnection | null = null;

export const initMongoose = (config: MongooseConfig = {}): MongooseConnection => {
  if (!mongooseConnection) {
    let mongoUri = config.uri || process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = config.dbName || process.env.MONGODB_DB_NAME || 'tdk_dashboard';

    try {
      const url = new URL(mongoUri);
      url.pathname = `/${dbName}`;
      mongoUri = url.toString();
    } catch (error) {
      const uriParts = mongoUri.split('/');
      if (uriParts.length >= 4) {
        uriParts[uriParts.length - 1] = dbName;
        mongoUri = uriParts.join('/');
      } else {
        mongoUri = `${mongoUri}/${dbName}`;
      }
    }

    mongooseConnection = new MongooseConnection({
      uri: mongoUri,
      options: config.options,
    });
  }
  return mongooseConnection;
};

export const getMongooseConnection = (): MongooseConnection => {
  if (!mongooseConnection) {
    throw new Error('Mongoose not initialized. Call initMongoose() first.');
  }
  return mongooseConnection;
};

export const connectMongoose = async (): Promise<Mongoose> => {
  return getMongooseConnection().connect();
};

export const closeMongoose = async (): Promise<void> => {
  if (mongooseConnection) {
    await mongooseConnection.close();
    mongooseConnection = null;
  }
};

export const initializeDatabase = async (): Promise<void> => {
  await import('../modules/user/user.schema');
  await import('../modules/transaction/transaction.schema');
  
  // Use environment variable for MongoDB URI (set in docker-compose or .env)
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  
  const mongooseConnection = initMongoose({
    uri: mongoUri,
    options: {
      maxPoolSize: 10,
      minPoolSize: 5,
    },
  });

  await mongooseConnection.connect();
  console.log('Database initialized successfully');
};

export const closeDatabase = async (): Promise<void> => {
  try {
    await closeMongoose();
    console.log('Database connections closed');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
};

export default MongooseConnection;

