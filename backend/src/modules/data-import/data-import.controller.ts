import { Request, Response } from 'express';
import { DataImportService } from './data-import.service';
import { asyncHandler } from '../../middleware/error.handler';
import { successResponse, errorResponse } from '../../utils/response.dto';
import multer from 'multer';


const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

export class DataImportController {
  private service: DataImportService;

  constructor() {
    this.service = new DataImportService();
  }

  importUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const file = (req as any).file;
    if (!file) {
      res.status(400).json(errorResponse('No file uploaded', 400));
      return;
    }

    try {
      // Use buffer from memory storage instead of file path
      const result = await this.service.importUsersFromBuffer(file.buffer);
      
      const response = successResponse(
        `Users imported successfully. Imported: ${result.imported}, Errors: ${result.errors}`,
        result
      );
      res.status(200).json(response);
    } catch (error) {
      throw error;
    }
  });

  importTransactions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const file = (req as any).file;
    if (!file) {
      res.status(400).json(errorResponse('No file uploaded', 400));
      return;
    }

    try {
      // Use buffer from memory storage instead of file path
      const result = await this.service.importTransactionsFromBuffer(file.buffer);
      
      const response = successResponse(
        `Transactions imported successfully. Imported: ${result.imported}, Errors: ${result.errors}`,
        result
      );
      res.status(200).json(response);
    } catch (error) {
      throw error;
    }
  });

  importAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const files = (req as any).files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const usersFile = files?.users?.[0] || null;
    const transactionsFile = files?.transactions?.[0] || null;

    if (!usersFile || !transactionsFile) {
      res.status(400).json(errorResponse('Both users and transactions files are required', 400));
      return;
    }

    try {
      // Use buffers from memory storage instead of file paths
      const result = await this.service.importAllFromBuffers(usersFile.buffer, transactionsFile.buffer);

      const response = successResponse('Data imported successfully', result);
      res.status(200).json(response);
    } catch (error) {
      throw error;
    }
  });
}

export const uploadUsers = upload.single('users');
export const uploadTransactions = upload.single('transactions');
export const uploadAll = upload.fields([
  { name: 'users', maxCount: 1 },
  { name: 'transactions', maxCount: 1 },
]);
