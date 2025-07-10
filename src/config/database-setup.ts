/**
 * FILE OVERVIEW:
 *   Purpose: Database setup utilities for environment-based configuration
 *   Key Concepts: Environment Variables, PostgreSQL
 *   Module Type: Configuration Utility
 *   @ai_context: Provides a single source of truth for DB config using env vars
 */

import { logger } from '../shared/utils/logger';
import chalk from 'chalk';

export const getDatabaseConfig = () => ({
  type: 'postgres',
  host: process.env['DATABASE_HOST'] || 'localhost',
  port: parseInt(process.env['DATABASE_PORT'] || '5432'),
  database: process.env['DATABASE_NAME'] || 'api_template',
  username: process.env['DATABASE_USER'] || 'postgres',
  password: process.env['DATABASE_PASSWORD'] || 'password',
});

/**
 * Validate database configuration
 */
export const validateDatabaseConfig = (config: { type: string; host?: string; port?: number; database?: string; username?: string; password?: string }): boolean => {
  const errors: string[] = [];

  if (!config.host) errors.push('Missing host');
  if (!config.port) errors.push('Missing port');
  if (!config.database) errors.push('Missing database');
  if (!config.username) errors.push('Missing username');
  if (!config.password) errors.push('Missing password');

  if (errors.length > 0) {
    logger.error(chalk.red('Database config errors:'), errors.join(', '));
    return false;
  }
  return true;
};

/**
 * Display current database configuration
 */
export const displayDatabaseConfig = (): void => {
  const dbInfo = getDatabaseConfig();

  logger.info(chalk.blue('📊 Current Database Configuration:'));
  logger.info(chalk.gray(`  Type: ${dbInfo.type}`));
  logger.info(chalk.gray(`  Host: ${dbInfo.host}`));
  logger.info(chalk.gray(`  Port: ${dbInfo.port}`));
  logger.info(chalk.gray(`  Database: ${dbInfo.database}`));
  logger.info(chalk.gray(`  User: ${dbInfo.username}`));
};

/**
 * Generate environment file template (Postgres only)
 */
export const generateEnvTemplate = (): string => {
  const config = getDatabaseConfig();
  return `DATABASE_TYPE=postgres
DATABASE_HOST=${config.host}
DATABASE_PORT=${config.port}
DATABASE_NAME=${config.database}
DATABASE_USER=${config.username}
DATABASE_PASSWORD=${config.password}
`;
}; 