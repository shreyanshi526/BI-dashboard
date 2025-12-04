import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { initializeDatabase } from '../utils/mongoose';
import { DataImportService } from '../modules/data-import/data-import.service';

dotenv.config();

async function importData() {
  try {
    console.log('🚀 Starting data import...\n');

    await initializeDatabase();
    console.log('✅ Database connected\n');

    const service = new DataImportService();


    // Support both local and Docker environments
    // In Docker: CSV files are mounted at /app/data
    // Locally: CSV files are at project root/TDK Case Study Data
    let dataDir: string;
    if (fs.existsSync('/app/data')) {
      // Docker environment
      dataDir = '/app/data';
    } else {
      // Local environment
      const currentDir = process.cwd();
      const isBackendDir = currentDir.endsWith('backend');
      const projectRoot = isBackendDir ? path.resolve(currentDir, '..') : currentDir;
      dataDir = path.join(projectRoot, 'TDK Case Study Data');
    }
    const usersPath = path.join(dataDir, 'users.csv');
    const transactionsPath = path.join(dataDir, 'transactions.csv');

    console.log(`Looking for CSV files in: ${dataDir}\n`);

    // Check if files exist
    if (!fs.existsSync(usersPath)) {
      throw new Error(`Users CSV file not found at: ${usersPath}\nPlease ensure the file exists at: ${dataDir}/users.csv`);
    }
    if (!fs.existsSync(transactionsPath)) {
      throw new Error(`Transactions CSV file not found at: ${transactionsPath}\nPlease ensure the file exists at: ${dataDir}/transactions.csv`);
    }

    console.log('📂 Importing users...');
    const usersResult = await service.importUsers(usersPath);
    console.log(`✅ Users imported: ${usersResult.imported}, Errors: ${usersResult.errors}\n`);

    console.log('📂 Importing transactions...');
    const transactionsResult = await service.importTransactions(transactionsPath);
    console.log(`✅ Transactions imported: ${transactionsResult.imported}, Errors: ${transactionsResult.errors}\n`);

    console.log('✨ Data import completed successfully!');
    console.log(`\nSummary:`);
    console.log(`  Users: ${usersResult.imported} imported, ${usersResult.errors} errors`);
    console.log(`  Transactions: ${transactionsResult.imported} imported, ${transactionsResult.errors} errors`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

importData();

