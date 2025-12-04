/**
 * Collection name identifiers for MongoDB collections
 */
export enum COLLECTION_NAMES {
  USERS = 'users',
  TRANSACTIONS = 'transactions',
}

/**
 * Collection names as object (alternative export)
 */
export const IDENTIFIERS_COLLECTION_NAMES = {
  USERS: COLLECTION_NAMES.USERS,
  TRANSACTIONS: COLLECTION_NAMES.TRANSACTIONS,
} as const;

