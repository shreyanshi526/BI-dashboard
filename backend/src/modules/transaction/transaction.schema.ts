import mongoose, { Schema, Model } from 'mongoose';
import { Transaction } from './transaction.model';
import { COLLECTION_NAMES } from '../../constants/collections';

const TransactionSchema = new Schema(
  {
    RowId: String,
    User_ID: String,
    Conversation_ID: String,
    Model_Name: String,
    Token_Type: String,
    Token_Count: Number,
    Rate_Per_1k: Number,
    Calculated_Cost: Number,
    Timestamp: Date,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAMES.TRANSACTIONS,
    strict: false, // Allow fields not defined in schema
  }
);

// Indexes for better query performance
TransactionSchema.index({ RowId: 1 });
TransactionSchema.index({ User_ID: 1, Timestamp: -1 });
TransactionSchema.index({ Conversation_ID: 1 });
TransactionSchema.index({ Model_Name: 1 });
TransactionSchema.index({ Timestamp: -1 });
TransactionSchema.index({ User_ID: 1, Timestamp: -1, Model_Name: 1 });

export const TransactionModel: Model<Transaction> =
  mongoose.models.Transaction || mongoose.model<Transaction>('Transaction', TransactionSchema);

