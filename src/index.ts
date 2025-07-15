/**
 * FILE OVERVIEW:
 *   Purpose: Main application entry point with Express server setup
 *   Key Concepts: Express Server, Middleware, Route Registration, Database Setup
 *   Module Type: Application Entry Point
 *   @ai_context: Central server configuration with colorful logging and database integration
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { logger } from '@/utils/logger';
import { testConnection, syncDatabase, sequelize } from '@/config/database';
import { specs, swaggerUi } from '@/config/swagger';
import { UserRoutes } from '@/entities/user/user.routes';
import config from '@/utils/env';

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger documentation route
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Documentation',
  })
);

// Register user routes
app.use('/users', new UserRoutes().getRouter());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
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
app.use((err: unknown, req: express.Request, res: express.Response) => {
  logger.error(chalk.red('Unhandled error:'), err);
  res.status((err as any).status || 500).json({
    error:
      config.NODE_ENV === 'production'
        ? 'Internal server error'
        : (err as any).message,
    ...(config.NODE_ENV !== 'production' && { stack: (err as any).stack }),
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error(
        chalk.red(
          'Failed to connect to database. Please check your configuration.'
        )
      );
      process.exit(1);
    }

    // Sync database (create tables)
    await syncDatabase();

    app.listen(config.PORT, () => {
      logger.info(
        chalk.green(`🚀 Server running on http://${config.HOST}:${config.PORT}`)
      );
      logger.info(
        chalk.blue(
          `📚 API Documentation: http://${config.HOST}:${config.PORT}/docs`
        )
      );
      logger.info(
        chalk.cyan(
          `🔍 Health Check: http://${config.HOST}:${config.PORT}/health`
        )
      );
      logger.info(chalk.gray(`Environment: ${config.NODE_ENV}`));
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
