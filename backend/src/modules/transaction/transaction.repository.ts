import { Types } from 'mongoose';
import { TransactionModel } from './transaction.schema';
import { Transaction, CreateTransactionDto, UpdateTransactionDto, TransactionQueryParams } from './transaction.model';

export class TransactionRepository {

  async create(transactionData: CreateTransactionDto): Promise<Transaction> {
    const transaction = new TransactionModel(transactionData);
    return (await transaction.save()).toObject();
  }

  async findById(id: string): Promise<Transaction | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const transaction = await TransactionModel.findById(id).lean();
    return this.mapTransaction(transaction);
  }

  async findByRowId(rowId: string): Promise<Transaction | null> {
    const transaction = await TransactionModel.findOne({ RowId: rowId }).lean();
    return this.mapTransaction(transaction);
  }

  private mapTransaction(doc: any): Transaction | null {
    if (!doc) return null;
    const userId = doc.User_ID ? String(doc.User_ID) : doc.User_ID;
    return {
      _id: doc._id,
      rowId: doc.RowId,
      userId: userId,
      conversationId: doc.Conversation_ID,
      modelName: doc.Model_Name,
      tokenType: doc.Token_Type,
      tokenCount: doc.Token_Count,
      ratePer1k: doc.Rate_Per_1k,
      calculatedCost: doc.Calculated_Cost,
      timestamp: doc.Timestamp ? new Date(doc.Timestamp) : new Date(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    } as Transaction;
  }

  async findAll(query: TransactionQueryParams = {}): Promise<Transaction[]> {
    const filter: any = {};

    if (query.userId) {
      filter.User_ID = query.userId;
    }
    if (query.conversationId) {
      filter.Conversation_ID = query.conversationId;
    }
    if (query.modelName) {
      filter.Model_Name = query.modelName;
    }
    if (query.tokenType) {
      filter.Token_Type = query.tokenType;
    }
    if (query.startDate || query.endDate) {
      filter.Timestamp = {};
      if (query.startDate) {
        filter.Timestamp.$gte = new Date(query.startDate);
      }
      if (query.endDate) {
        filter.Timestamp.$lte = new Date(query.endDate + 'T23:59:59Z');
      }
    }

    let queryBuilder = TransactionModel.find(filter).sort({ Timestamp: -1 });
    
    if (query.skip) {
      queryBuilder = queryBuilder.skip(query.skip);
    }
    if (query.limit) {
      queryBuilder = queryBuilder.limit(query.limit);
    }

    const transactions = await queryBuilder.lean();
    return transactions.map(tx => this.mapTransaction(tx)).filter(tx => tx !== null) as Transaction[];
  }

  async update(id: string, updateData: UpdateTransactionDto): Promise<Transaction | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const transaction = await TransactionModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
    return transaction as Transaction | null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await TransactionModel.findByIdAndDelete(id);
    return result !== null;
  }

  async count(query: TransactionQueryParams = {}): Promise<number> {
    const filter: any = {};

    if (query.userId) {
      filter.User_ID = query.userId;
    }
    if (query.conversationId) {
      filter.Conversation_ID = query.conversationId;
    }
    if (query.modelName) {
      filter.Model_Name = query.modelName;
    }
    if (query.tokenType) {
      filter.Token_Type = query.tokenType;
    }
    if (query.startDate || query.endDate) {
      filter.Timestamp = {};
      if (query.startDate) {
        filter.Timestamp.$gte = new Date(query.startDate);
      }
      if (query.endDate) {
        filter.Timestamp.$lte = new Date(query.endDate + 'T23:59:59Z');
      }
    }

    return TransactionModel.countDocuments(filter);
  }

  async aggregateByModel(query: TransactionQueryParams = {}): Promise<any[]> {
    const matchFilter: any = {};

    if (query.startDate || query.endDate) {
      matchFilter.Timestamp = {};
      if (query.startDate) {
        matchFilter.Timestamp.$gte = new Date(query.startDate);
      }
      if (query.endDate) {
        matchFilter.Timestamp.$lte = new Date(query.endDate + 'T23:59:59Z');
      }
    }

    return TransactionModel.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$Model_Name',
          cost: { $sum: '$Calculated_Cost' },
          tokens: { $sum: '$Token_Count' },
          transactions: { $sum: 1 },
        },
      },
      { $sort: { cost: -1 } },
    ]);
  }

  async getDateRange(): Promise<{ minDate: string; maxDate: string } | null> {
    const result = await TransactionModel.aggregate([
      {
        $group: {
          _id: null,
          minDate: { $min: '$Timestamp' },
          maxDate: { $max: '$Timestamp' },
        },
      },
    ]);

    if (result.length === 0) {
      return null;
    }

    return {
      minDate: result[0].minDate ? new Date(result[0].minDate).toISOString().split('T')[0] : '',
      maxDate: result[0].maxDate ? new Date(result[0].maxDate).toISOString().split('T')[0] : '',
    };
  }
}

