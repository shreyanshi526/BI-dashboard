import { TransactionRepository } from './transaction.repository';
import { Transaction, CreateTransactionDto, UpdateTransactionDto, TransactionQueryParams } from './transaction.model';
import { NotFoundError, ValidationError } from '../../middleware/error.handler';
import { AppMessages } from '../../utils/app.messages';

export class TransactionService {
  private repository: TransactionRepository;

  constructor() {
    this.repository = new TransactionRepository();
  }

  async createTransaction(transactionData: CreateTransactionDto): Promise<Transaction> {
    const existingTransaction = await this.repository.findByRowId(transactionData.rowId);
    if (existingTransaction) {
      throw new ValidationError(AppMessages.TRANSACTION_ALREADY_EXISTS);
    }

    return this.repository.create(transactionData);
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    const transaction = await this.repository.findById(id);
    if (!transaction) {
      throw new NotFoundError(AppMessages.TRANSACTION_NOT_FOUND);
    }
    return transaction;
  }

  async getTransactionByRowId(rowId: string): Promise<Transaction | null> {
    return this.repository.findByRowId(rowId);
  }

  async getAllTransactions(query: TransactionQueryParams = {}): Promise<{ transactions: Transaction[]; total: number }> {
    const transactions = await this.repository.findAll(query);
    const total = await this.repository.count(query);
    return { transactions, total };
  }

  async updateTransaction(id: string, updateData: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.repository.findById(id);
    if (!transaction) {
      throw new NotFoundError(AppMessages.TRANSACTION_NOT_FOUND);
    }

    const updatedTransaction = await this.repository.update(id, updateData);
    if (!updatedTransaction) {
      throw new Error(`Failed to update transaction with id ${id}`);
    }

    return updatedTransaction;
  }

  async deleteTransaction(id: string): Promise<void> {
    const transaction = await this.repository.findById(id);
    if (!transaction) {
      throw new NotFoundError(AppMessages.TRANSACTION_NOT_FOUND);
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new Error(`Failed to delete transaction with id ${id}`);
    }
  }

  async getTransactionsByUser(userId: string, query: TransactionQueryParams = {}): Promise<{ transactions: Transaction[]; total: number }> {
    return this.getAllTransactions({ ...query, userId });
  }

  async getTransactionsByConversation(conversationId: string, query: TransactionQueryParams = {}): Promise<{ transactions: Transaction[]; total: number }> {
    return this.getAllTransactions({ ...query, conversationId });
  }

  async aggregateByModel(query: TransactionQueryParams = {}): Promise<any[]> {
    return this.repository.aggregateByModel(query);
  }

  async getDateRange(): Promise<{ minDate: string; maxDate: string } | null> {
    return this.repository.getDateRange();
  }
}

