import { Router } from 'express';
import { DashboardController } from './dashboard.controller';

const router = Router();
const controller = new DashboardController();

// Dashboard routes
router.get('/dashboard/summary', controller.getSummary);
router.get('/dashboard/cost-by-model', controller.getCostByModel);
router.get('/dashboard/usage-by-region', controller.getUsageByRegion);
router.get('/dashboard/daily-trends', controller.getDailyTrends);
router.get('/dashboard/monthly-trends', controller.getMonthlyTrends);
router.get('/dashboard/usage-by-department', controller.getUsageByDepartment);
router.get('/dashboard/token-distribution', controller.getTokenDistribution);
router.get('/dashboard/top-users', controller.getTopUsers);
router.get('/dashboard/usage-by-company', controller.getUsageByCompany);
router.get('/dashboard/regions', controller.getRegions);
router.get('/dashboard/date-range', controller.getDateRange);

export default router;

