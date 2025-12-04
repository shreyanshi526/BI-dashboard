import { Types } from 'mongoose';

export interface Transaction {
  _id?: Types.ObjectId;
  rowId: string;
  userId: string;
  conversationId: string;
  modelName: string;
  tokenType: 'prompt' | 'completion';
  tokenCount: number;
  ratePer1k: number;
  calculatedCost: number;
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTransactionDto {
  rowId: string;
  userId: string;
  conversationId: string;
  modelName: string;
  tokenType: 'prompt' | 'completion';
  tokenCount: number;
  ratePer1k: number;
  calculatedCost: number;
  timestamp: Date;
}

export interface UpdateTransactionDto {
  modelName?: string;
  tokenType?: 'prompt' | 'completion';
  tokenCount?: number;
  ratePer1k?: number;
  calculatedCost?: number;
  timestamp?: Date;
}

export interface TransactionQueryParams {
  userId?: string;
  conversationId?: string;
  modelName?: string;
  tokenType?: 'prompt' | 'completion';
  startDate?: string;
  endDate?: string;
  region?: string;
  limit?: number;
  skip?: number;
}

export interface TransactionAggregationResult {
  totalTransactions: number;
  totalTokens: number;
  totalCost: number;
  activeUsers: number;
  totalConversations: number;
}

