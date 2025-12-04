import { parse } from 'csv-parse/sync';
import * as fs from 'fs';

export interface CSVParseOptions {
  skipEmptyLines?: boolean;
  columns?: boolean;
  trim?: boolean;
}

export class CSVParser {
  static parseFile<T = Record<string, string>>(
    filePath: string,
    options: CSVParseOptions = {}
  ): T[] {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      const defaultOptions: CSVParseOptions = {
        skipEmptyLines: true,
        columns: true,
        trim: true,
        ...options,
      };

      const records = parse(fileContent, {
        skip_empty_lines: defaultOptions.skipEmptyLines,
        columns: defaultOptions.columns,
        trim: defaultOptions.trim,
        cast: true,
        cast_date: false,
      }) as T[];

      return records;
    } catch (error) {
      throw new Error(`Failed to parse CSV file: ${filePath}. Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  static parseString<T = Record<string, string>>(
    content: string,
    options: CSVParseOptions = {}
  ): T[] {
    try {
      const defaultOptions: CSVParseOptions = {
        skipEmptyLines: true,
        columns: true,
        trim: true,
        ...options,
      };

      const records = parse(content, {
        skip_empty_lines: defaultOptions.skipEmptyLines,
        columns: defaultOptions.columns,
        trim: defaultOptions.trim,
        cast: true,
        cast_date: false,
      }) as T[];

      return records;
    } catch (error) {
      throw new Error(`Failed to parse CSV content. Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
