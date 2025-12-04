import { Router, Request, Response } from 'express';
import userRoutes from './modules/user/user.route';
import transactionRoutes from './modules/transaction/transaction.route';
import dashboardRoutes from './modules/dashboard/dashboard.route';
import { successResponse } from './utils/response.dto';

const router = Router();

router.get('/api/health', (_req: Request, res: Response) => {
  const response = successResponse('Server is healthy', {
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
  res.json(response);
});

router.use('/api', userRoutes);
router.use('/api', transactionRoutes);
router.use('/api', dashboardRoutes);

export default router;

