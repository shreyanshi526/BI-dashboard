import { Router } from 'express';
import { TransactionController } from './transaction.controller';

const router = Router();
const controller = new TransactionController();

// Transaction routes
router.post('/transactions', controller.createTransaction);
router.get('/transactions', controller.getAllTransactions);
router.get('/transactions/date-range', controller.getDateRange);
router.get('/transactions/aggregate/model', controller.aggregateByModel);
router.get('/transactions/user/:userId', controller.getTransactionsByUser);
router.get('/transactions/conversation/:conversationId', controller.getTransactionsByConversation);
router.get('/transactions/:id', controller.getTransactionById);
router.put('/transactions/:id', controller.updateTransaction);
router.delete('/transactions/:id', controller.deleteTransaction);

export default router;

