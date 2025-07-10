/**
 * FILE OVERVIEW:
 *   Purpose: PostgreSQL database configuration with Sequelize ORM
 *   Key Concepts: Sequelize ORM, PostgreSQL, Environment Configuration
 *   Module Type: Configuration
 *   @ai_context: PostgreSQL-specific database setup with environment-based configuration
 */

import { Sequelize, DataTypes, Model } from 'sequelize';
import { logger } from '../shared/utils/logger';
import chalk from 'chalk';

// PostgreSQL database configuration
const getDatabaseConfig = () => {
  return {
    host: process.env['DATABASE_HOST'] || 'localhost',
    port: parseInt(process.env['DATABASE_PORT'] || '5432'),
    database: process.env['DATABASE_NAME'] || 'api_template',
    username: process.env['DATABASE_USER'] || 'postgres',
    password: process.env['DATABASE_PASSWORD'] || 'password',
    dialect: 'postgres' as const,
    dialectOptions: {
      ssl: process.env['NODE_ENV'] === 'production' ? { rejectUnauthorized: false } : false,
    },
    pool: {
      max: parseInt(process.env['DATABASE_MAX_CONNECTIONS'] || '20'),
      min: 0,
      acquire: parseInt(process.env['DATABASE_CONNECTION_TIMEOUT'] || '2000'),
      idle: parseInt(process.env['DATABASE_IDLE_TIMEOUT'] || '30000'),
    },
    logging: process.env['NODE_ENV'] === 'development' 
      ? (msg: string) => logger.debug(chalk.gray(`[DB] ${msg}`))
      : false,
  };
};

// Create Sequelize instance with PostgreSQL configuration
const dbConfig = getDatabaseConfig();
const sequelize = new Sequelize(dbConfig);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    logger.info(chalk.green('✓ Database connection successful (PostgreSQL)'));
    return true;
  } catch (error) {
    logger.error(chalk.red('✗ Database connection failed (PostgreSQL):'), error);
    return false;
  }
};

// Sync database (create tables)
export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    logger.info(chalk.green(`✓ Database synced ${force ? '(forced)' : ''} (PostgreSQL)`));
  } catch (error) {
    logger.error(chalk.red('✗ Database sync failed (PostgreSQL):'), error);
    throw error;
  }
};

// Get database info
export const getDatabaseInfo = () => {
  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
  };
};

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info(chalk.yellow('Closing database connection...'));
  await sequelize.close();
  process.exit(0);
});

export { sequelize, DataTypes, Model }; 