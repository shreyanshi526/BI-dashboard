import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.model';
import { successResponse } from '../../utils/response.dto';
import { AppMessages } from '../../utils/app.messages';
import { asyncHandler, NotFoundError } from '../../middleware/error.handler';

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userData: CreateUserDto = req.body;
    const user = await this.service.createUser(userData);
    const response = successResponse(AppMessages.USER_CREATED, user, 201);
    res.status(201).json(response);
  });

  getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await this.service.getUserById(id);
    if (!user) {
      throw new NotFoundError(AppMessages.USER_NOT_FOUND);
    }
    const response = successResponse(AppMessages.USER_FETCHED, user);
    res.status(200).json(response);
  });

  getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = {
      region: req.query.region as string | undefined,
      department: req.query.department as string | undefined,
      isActiveSub: req.query.isActiveSub === 'true' ? true : req.query.isActiveSub === 'false' ? false : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      skip: req.query.skip ? parseInt(req.query.skip as string) : undefined,
    };

    const result = await this.service.getAllUsers(query);
    const response = successResponse(AppMessages.USERS_FETCHED, {
      users: result.users,
      total: result.total,
    });
    res.status(200).json(response);
  });

  updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: UpdateUserDto = req.body;
    const user = await this.service.updateUser(id, updateData);
    const response = successResponse(AppMessages.USER_UPDATED, user);
    res.status(200).json(response);
  });

  deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.service.deleteUser(id);
    const response = successResponse(AppMessages.USER_DELETED, null);
    res.status(200).json(response);
  });

  getRegions = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const regions = await this.service.getRegions();
    const response = successResponse(AppMessages.SUCCESS, regions);
    res.status(200).json(response);
  });

  getDepartments = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const departments = await this.service.getDepartments();
    const response = successResponse(AppMessages.SUCCESS, departments);
    res.status(200).json(response);
  });
}

