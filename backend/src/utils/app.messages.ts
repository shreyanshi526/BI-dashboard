/**
 * Application-wide message constants
 */
export const AppMessages = {
  // General messages
  SUCCESS: 'Operation completed successfully',
  ERROR: 'An error occurred',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_SERVER_ERROR: 'Internal server error',

  // User messages
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  USERS_FETCHED: 'Users fetched successfully',
  USER_FETCHED: 'User fetched successfully',

  // Transaction messages
  TRANSACTION_CREATED: 'Transaction created successfully',
  TRANSACTION_UPDATED: 'Transaction updated successfully',
  TRANSACTION_DELETED: 'Transaction deleted successfully',
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  TRANSACTION_ALREADY_EXISTS: 'Transaction already exists',
  TRANSACTIONS_FETCHED: 'Transactions fetched successfully',
  TRANSACTION_FETCHED: 'Transaction fetched successfully',

  // Database messages
  DATABASE_CONNECTED: 'Database connected successfully',
  DATABASE_CONNECTION_ERROR: 'Database connection error',
  DATABASE_QUERY_ERROR: 'Database query error',

  // Validation messages
  INVALID_INPUT: 'Invalid input provided',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  INVALID_ID: 'Invalid ID provided',
  INVALID_DATE_FORMAT: 'Invalid date format',

  // Server messages
  SERVER_STARTED: 'Server started successfully',
  SERVER_SHUTTING_DOWN: 'Server shutting down',
} as const;

export type AppMessageKey = keyof typeof AppMessages;

