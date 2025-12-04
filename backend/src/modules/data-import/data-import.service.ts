import { CSVParser } from '../../utils/csvParser';
import { UserModel } from '../user/user.schema';
import { TransactionModel } from '../transaction/transaction.schema';

interface CSVUser {
  User_ID: string;
  User_Name: string;
  Region: string;
  Is_Active_Sub: string | boolean;
  Signup_Date: string;
  Department: string;
  Company_Name: string;
}

interface CSVTransaction {
  RowId: string;
  User_ID: string;
  Model_Name: string;
  Conversation_ID: string;
  Token_Type: string;
  Token_Count: string | number;
  Rate_Per_1k: string | number;
  Calculated_Cost: string | number;
  Timestamp: string;
}

export class DataImportService {
  constructor() {
    // Service uses models directly for bulk operations
  }

  async importUsers(filePath: string): Promise<{ imported: number; errors: number }> {
    try {
      const csvUsers = CSVParser.parseFile<CSVUser>(filePath);
      let imported = 0;
      let errors = 0;

      for (const csvUser of csvUsers) {
        try {
          const userData = {
            User_ID: csvUser.User_ID?.trim(),
            User_Name: csvUser.User_Name?.trim(),
            Company_Name: csvUser.Company_Name?.trim(),
            Department: csvUser.Department?.trim(),
            Region: csvUser.Region?.trim(),
            Is_Active_Sub: this.parseBoolean(csvUser.Is_Active_Sub),
            Signup_Date: csvUser.Signup_Date?.trim() || '',
          };

          if (!userData.User_ID) {
            errors++;
            continue;
          }

          await UserModel.findOneAndUpdate(
            { User_ID: userData.User_ID },
            userData,
            { upsert: true, new: true }
          );
          imported++;
        } catch (error) {
          console.error(`Error importing user ${csvUser.User_ID}:`, error);
          errors++;
        }
      }

      return { imported, errors };
    } catch (error) {
      throw new Error(`Failed to import users: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async importTransactions(filePath: string): Promise<{ imported: number; errors: number }> {
    try {
      const csvTransactions = CSVParser.parseFile<CSVTransaction>(filePath);
      let imported = 0;
      let errors = 0;

      const batchSize = 100;
      const batches: CSVTransaction[][] = [];

      for (let i = 0; i < csvTransactions.length; i += batchSize) {
        batches.push(csvTransactions.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        const transactionDocs = batch
          .map((csvTx) => {
            try {
              const transactionData = {
                RowId: csvTx.RowId?.trim(),
                User_ID: csvTx.User_ID?.trim(),
                Conversation_ID: csvTx.Conversation_ID?.trim(),
                Model_Name: csvTx.Model_Name?.trim(),
                Token_Type: csvTx.Token_Type?.trim(),
                Token_Count: this.parseNumber(csvTx.Token_Count),
                Rate_Per_1k: this.parseNumber(csvTx.Rate_Per_1k),
                Calculated_Cost: this.parseNumber(csvTx.Calculated_Cost),
                Timestamp: this.parseDate(csvTx.Timestamp),
              };

              if (!transactionData.RowId || !transactionData.User_ID) {
                return null;
              }

              return transactionData;
            } catch (error) {
              console.error(`Error parsing transaction ${csvTx.RowId}:`, error);
              return null;
            }
          })
          .filter((doc) => doc !== null);

        try {
          if (transactionDocs.length > 0) {
            await TransactionModel.insertMany(transactionDocs, {
              ordered: false,
              rawResult: false,
            });
            imported += transactionDocs.length;
          }
        } catch (error: any) {
          if (error.writeErrors) {
            const successful = transactionDocs.length - error.writeErrors.length;
            imported += successful;
            errors += error.writeErrors.length;
          } else {
            errors += transactionDocs.length;
          }
        }
      }

      return { imported, errors };
    } catch (error) {
      throw new Error(`Failed to import transactions: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async importAll(usersPath: string, transactionsPath: string): Promise<{
    users: { imported: number; errors: number };
    transactions: { imported: number; errors: number };
  }> {
    const usersResult = await this.importUsers(usersPath);
    const transactionsResult = await this.importTransactions(transactionsPath);

    return {
      users: usersResult,
      transactions: transactionsResult,
    };
  }

  async importUsersFromBuffer(buffer: Buffer): Promise<{ imported: number; errors: number }> {
    try {
      const csvContent = buffer.toString('utf-8');
      const csvUsers = CSVParser.parseString<CSVUser>(csvContent);
      let imported = 0;
      let errors = 0;

      for (const csvUser of csvUsers) {
        try {
          const userData = {
            User_ID: csvUser.User_ID?.trim(),
            User_Name: csvUser.User_Name?.trim(),
            Company_Name: csvUser.Company_Name?.trim(),
            Department: csvUser.Department?.trim(),
            Region: csvUser.Region?.trim(),
            Is_Active_Sub: this.parseBoolean(csvUser.Is_Active_Sub),
            Signup_Date: csvUser.Signup_Date?.trim() || '',
          };

          if (!userData.User_ID) {
            errors++;
            continue;
          }

          await UserModel.findOneAndUpdate(
            { User_ID: userData.User_ID },
            userData,
            { upsert: true, new: true }
          );
          imported++;
        } catch (error) {
          console.error(`Error importing user ${csvUser.User_ID}:`, error);
          errors++;
        }
      }

      return { imported, errors };
    } catch (error) {
      throw new Error(`Failed to import users: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async importTransactionsFromBuffer(buffer: Buffer): Promise<{ imported: number; errors: number }> {
    try {
      const csvContent = buffer.toString('utf-8');
      const csvTransactions = CSVParser.parseString<CSVTransaction>(csvContent);
      let imported = 0;
      let errors = 0;

      const batchSize = 100;
      const batches: CSVTransaction[][] = [];

      for (let i = 0; i < csvTransactions.length; i += batchSize) {
        batches.push(csvTransactions.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        const transactionDocs = batch
          .map((csvTx) => {
            try {
              const transactionData = {
                RowId: csvTx.RowId?.trim(),
                User_ID: csvTx.User_ID?.trim(),
                Conversation_ID: csvTx.Conversation_ID?.trim(),
                Model_Name: csvTx.Model_Name?.trim(),
                Token_Type: csvTx.Token_Type?.trim(),
                Token_Count: this.parseNumber(csvTx.Token_Count),
                Rate_Per_1k: this.parseNumber(csvTx.Rate_Per_1k),
                Calculated_Cost: this.parseNumber(csvTx.Calculated_Cost),
                Timestamp: this.parseDate(csvTx.Timestamp),
              };

              if (!transactionData.RowId || !transactionData.User_ID) {
                return null;
              }

              return transactionData;
            } catch (error) {
              console.error(`Error parsing transaction ${csvTx.RowId}:`, error);
              return null;
            }
          })
          .filter((doc) => doc !== null);

        try {
          if (transactionDocs.length > 0) {
            await TransactionModel.insertMany(transactionDocs, {
              ordered: false,
              rawResult: false,
            });
            imported += transactionDocs.length;
          }
        } catch (error: any) {
          if (error.writeErrors) {
            const successful = transactionDocs.length - error.writeErrors.length;
            imported += successful;
            errors += error.writeErrors.length;
          } else {
            errors += transactionDocs.length;
          }
        }
      }

      return { imported, errors };
    } catch (error) {
      throw new Error(`Failed to import transactions: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async importAllFromBuffers(usersBuffer: Buffer, transactionsBuffer: Buffer): Promise<{
    users: { imported: number; errors: number };
    transactions: { imported: number; errors: number };
  }> {
    const usersResult = await this.importUsersFromBuffer(usersBuffer);
    const transactionsResult = await this.importTransactionsFromBuffer(transactionsBuffer);

    return {
      users: usersResult,
      transactions: transactionsResult,
    };
  }

  private parseBoolean(value: string | boolean): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      return lower === 'true' || lower === '1' || lower === 'yes';
    }
    return false;
  }

  private parseNumber(value: string | number): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value.trim());
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  private parseDate(dateString: string): Date {
    if (!dateString) return new Date();
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date();
      }
      return date;
    } catch {
      return new Date();
    }
  }
}
