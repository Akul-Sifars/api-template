/**
 * FILE OVERVIEW:
 *   Purpose: Type-safe environment variable management with validation
 *   Key Concepts: Environment Variables, TypeScript Interface, Validation
 *   Module Type: Utility
 *   @ai_context: Interface-based configuration with required variable validation
 */

import dotenv from 'dotenv';

dotenv.config();

interface IEnvConfig {
  NODE_ENV: string;
  PORT: number;
  HOST: string;
  CORS_ORIGIN: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_NAME: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: IEnvConfig = {
  NODE_ENV: process.env['NODE_ENV'] || 'development',
  PORT: parseInt(process.env['PORT'] || '3000', 10),
  HOST: process.env['HOST'] || 'localhost',
  CORS_ORIGIN: process.env['CORS_ORIGIN'] || 'http://localhost:3000',

  DATABASE_HOST: process.env['DATABASE_HOST'] || 'localhost',
  DATABASE_PORT: parseInt(process.env['DATABASE_PORT'] || '5432', 10),
  DATABASE_NAME: process.env['DATABASE_NAME'] || 'api_template',
  DATABASE_USER: process.env['DATABASE_USER'] || 'postgres',
  DATABASE_PASSWORD: process.env['DATABASE_PASSWORD'] || 'password',

  isDevelopment: (process.env['NODE_ENV'] || 'development') === 'development',
  isProduction: (process.env['NODE_ENV'] || 'development') === 'production',
};

const requiredEnvVars = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_NAME',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
];

for (const key of requiredEnvVars) {
  if (!process.env[key] && !config[key as keyof IEnvConfig]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

export default config;
