import * as fs from 'fs';
import * as path from 'path';

/**
 * Validate that all required environment variables are present
 */
export const validateEnv = (): void => {
  const envExamplePath = path.join(__dirname, '../../.env.example');
  
  if (!fs.existsSync(envExamplePath)) {
    console.warn('⚠️  .env.example file not found. Skipping validation.');
    return;
  }

  const envExampleContent = fs.readFileSync(envExamplePath, 'utf-8');
  const requiredVars: string[] = [];
  const missingVars: string[] = [];

  // Parse .env.example to get required variables
  envExampleContent.split('\n').forEach((line) => {
    const trimmedLine = line.trim();
    // Skip comments and empty lines
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      // Match variable name with optional = (value can be empty in .env.example)
      const match = trimmedLine.match(/^([A-Z_][A-Z0-9_]*)(=.*)?$/);
      if (match && match[1]) {
        requiredVars.push(match[1]);
      }
    }
  });

  // Check if all required variables are present
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error('\n💡 Please create a .env file based on .env.example');
    process.exit(1);
  }

  console.log('✅ All required environment variables are present');
};
