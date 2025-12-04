import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
import { successResponse } from '../../utils/response.dto';
import { AppMessages } from '../../utils/app.messages';
import { asyncHandler } from '../../middleware/error.handler';

export class DashboardController {
  private service: DashboardService;

  constructor() {
    this.service = new DashboardService();
  }

  getSummary = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      region: req.query.region as string | undefined,
    };

    const result = await this.service.getSummary(query);
    const response = successResponse(AppMessages.SUCCESS, result);
    res.status(200).json(response);
  });

  getCostByModel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      region: req.query.region as string | undefined,
    };

    const result = await this.service.getCostByModel(query);
    const response = successResponse(AppMessages.SUCCESS, result);
    res.status(200).json(response);
  });

  getUsageByRegion = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    };

    const result = await this.service.getUsageByRegion(query);
    const response = successResponse(AppMessages.SUCCESS, result);
    res.status(200).json(response);
  });

  getDailyTrends = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      region: req.query.region as string | undefined,
    };

    const result = await this.service.getDailyTrends(query);
    const response = successResponse(AppMessages.SUCCESS, result);
    res.status(200).json(response);
  });

  getMonthlyTrends = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      region: req.query.region as string | undefined,
    };

    const result = await this.service.getMonthlyTrends(query);
    const response = successResponse(AppMessages.SUCCESS, result);
    res.status(200).json(response);
  });

  getUsageByDepartment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      region: req.query.region as string | undefined,
    };

    const result = await this.service.getUsageByDepartment(query);
    const response = successResponse(AppMessages.SUCCESS, result);
    res.status(200).json(response);
  });

  getTokenDistribution = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      region: req.query.region as string | undefined,
    };

    const result = await this.service.getTokenDistribution(query);
    const response = successResponse(AppMessages.SUCCESS, result);
    res.status(200).json(response);
  });

  getTopUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      region: req.query.region as string | undefined,
    };
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await this.service.getTopUsers(query, limit);
    const response = successResponse(AppMessages.SUCCESS, result);
    res.status(200).json(response);
  });

  getUsageByCompany = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      region: req.query.region as string | undefined,
    };

    const result = await this.service.getUsageByCompany(query);
    const response = successResponse(AppMessages.SUCCESS, result);
    res.status(200).json(response);
  });

  getRegions = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const result = await this.service.getRegions();
    const response = successResponse(AppMessages.SUCCESS, result);
    res.status(200).json(response);
  });

  getDateRange = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const result = await this.service.getDateRange();
    const response = successResponse(AppMessages.SUCCESS, result);
    res.status(200).json(response);
  });
}

