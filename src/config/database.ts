/**
 * FILE OVERVIEW:
 *   Purpose: PostgreSQL database configuration with Sequelize ORM
 *   Key Concepts: Sequelize ORM, PostgreSQL, Environment Configuration
 *   Module Type: Configuration
 *   @ai_context: PostgreSQL-specific database setup with environment-based configuration
 */

import { Sequelize, DataTypes, Model } from 'sequelize';
import { logger } from '@/utils/logger';
import chalk from 'chalk';
import config from '@/utils/env';

// PostgreSQL database configuration
const getDatabaseConfig = () => {
  return {
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    database: config.DATABASE_NAME,
    username: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    logging:
      config.NODE_ENV === 'development'
        ? (msg: string) => logger.debug(chalk.gray(`[DB] ${msg}`))
        : false,
  };
};

// Create Sequelize instance with PostgreSQL configuration
const dbConfig = getDatabaseConfig();
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'postgres',
    logging: dbConfig.logging,
  }
);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    logger.info(chalk.green('✓ Database connection successful (PostgreSQL)'));
    return true;
  } catch (error) {
    logger.error(
      chalk.red('✗ Database connection failed (PostgreSQL):'),
      error
    );
    return false;
  }
};

// Sync database (create tables)
export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    logger.info(
      chalk.green(`✓ Database synced ${force ? '(forced)' : ''} (PostgreSQL)`)
    );
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
