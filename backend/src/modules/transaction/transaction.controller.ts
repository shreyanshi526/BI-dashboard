import { Request, Response } from 'express';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto, UpdateTransactionDto } from './transaction.model';
import { successResponse } from '../../utils/response.dto';
import { AppMessages } from '../../utils/app.messages';
import { asyncHandler, NotFoundError } from '../../middleware/error.handler';

export class TransactionController {
  private service: TransactionService;

  constructor() {
    this.service = new TransactionService();
  }

  createTransaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const transactionData: CreateTransactionDto = req.body;
    const transaction = await this.service.createTransaction(transactionData);
    const response = successResponse(AppMessages.TRANSACTION_CREATED, transaction, 201);
    res.status(201).json(response);
  });

  getTransactionById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const transaction = await this.service.getTransactionById(id);
    if (!transaction) {
      throw new NotFoundError(AppMessages.TRANSACTION_NOT_FOUND);
    }
    const response = successResponse(AppMessages.TRANSACTION_FETCHED, transaction);
    res.status(200).json(response);
  });

  getAllTransactions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = {
      userId: req.query.userId as string | undefined,
      conversationId: req.query.conversationId as string | undefined,
      modelName: req.query.modelName as string | undefined,
      tokenType: req.query.tokenType as 'prompt' | 'completion' | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      skip: req.query.skip ? parseInt(req.query.skip as string) : undefined,
    };

    const result = await this.service.getAllTransactions(query);
    const response = successResponse(AppMessages.TRANSACTIONS_FETCHED, {
      transactions: result.transactions,
      total: result.total,
    });
    res.status(200).json(response);
  });

  updateTransaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: UpdateTransactionDto = req.body;
    const transaction = await this.service.updateTransaction(id, updateData);
    const response = successResponse(AppMessages.TRANSACTION_UPDATED, transaction);
    res.status(200).json(response);
  });

  deleteTransaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.service.deleteTransaction(id);
    const response = successResponse(AppMessages.TRANSACTION_DELETED, null);
    res.status(200).json(response);
  });

  getTransactionsByUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const query = {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      skip: req.query.skip ? parseInt(req.query.skip as string) : undefined,
    };

    const result = await this.service.getTransactionsByUser(userId, query);
    const response = successResponse(AppMessages.TRANSACTIONS_FETCHED, {
      transactions: result.transactions,
      total: result.total,
    });
    res.status(200).json(response);
  });

  getTransactionsByConversation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { conversationId } = req.params;
    const query = {
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      skip: req.query.skip ? parseInt(req.query.skip as string) : undefined,
    };

    const result = await this.service.getTransactionsByConversation(conversationId, query);
    const response = successResponse(AppMessages.TRANSACTIONS_FETCHED, {
      transactions: result.transactions,
      total: result.total,
    });
    res.status(200).json(response);
  });

  aggregateByModel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    };

    const result = await this.service.aggregateByModel(query);
    const response = successResponse(AppMessages.SUCCESS, result);
    res.status(200).json(response);
  });

  getDateRange = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const result = await this.service.getDateRange();
    const response = successResponse(AppMessages.SUCCESS, result || { minDate: '', maxDate: '' });
    res.status(200).json(response);
  });
}

