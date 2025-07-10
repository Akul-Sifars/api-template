import 'dotenv/config';
/**
 * FILE OVERVIEW:
 *   Purpose: Main application entry point with Express server setup
 *   Key Concepts: Express Server, Middleware, Route Registration, Database Setup
 *   Module Type: Application Entry Point
 *   @ai_context: Central server configuration with colorful logging and database integration
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { logger } from './shared/utils/logger';
import { testConnection, syncDatabase, sequelize } from './config/database';
import { displayDatabaseConfig } from './config/database-setup';
import { specs, swaggerUi } from './config/swagger';
import { UserRoutes } from './entities/user/user.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3000;
const HOST = process.env['HOST'] || 'localhost';

// Display database configuration on startup
displayDatabaseConfig();

// Middleware
app.use(cors({
  origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger documentation route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Documentation',
}));

// Register user routes
app.use('/users', new UserRoutes().getRouter());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'] || 'development',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(chalk.red('Unhandled error:'), err);
  
  res.status(err.status || 500).json({
    error: process.env['NODE_ENV'] === 'production' ? 'Internal server error' : err.message,
    ...(process.env['NODE_ENV'] !== 'production' && { stack: err.stack }),
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error(chalk.red('Failed to connect to database. Please check your configuration.'));
      process.exit(1);
    }

    // Sync database (create tables)
    await syncDatabase();

    app.listen(PORT, () => {
      logger.info(chalk.green(`🚀 Server running on http://${HOST}:${PORT}`));
      logger.info(chalk.blue(`📚 API Documentation: http://${HOST}:${PORT}/docs`));
      logger.info(chalk.cyan(`🔍 Health Check: http://${HOST}:${PORT}/health`));
      logger.info(chalk.gray(`Environment: ${process.env['NODE_ENV'] || 'development'}`));
    });
  } catch (error) {
    logger.error(chalk.red('Failed to start server:'), error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info(chalk.yellow('SIGTERM received, shutting down gracefully...'));
  sequelize.close().then(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info(chalk.yellow('SIGINT received, shutting down gracefully...'));
  sequelize.close().then(() => {
    process.exit(0);
  });
});

startServer();
