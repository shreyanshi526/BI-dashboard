import { Router } from 'express';
import { DataImportController, uploadUsers, uploadTransactions, uploadAll } from './data-import.controller';

const router = Router();
const controller = new DataImportController();

router.post('/users', uploadUsers, controller.importUsers);
router.post('/transactions', uploadTransactions, controller.importTransactions);
router.post('/all', uploadAll, controller.importAll);

export default router;
