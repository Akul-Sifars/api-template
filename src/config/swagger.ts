/**
 * FILE OVERVIEW:
 *   Purpose: Swagger/OpenAPI configuration for API documentation
 *   Key Concepts: OpenAPI 3.0, JSDoc Comments, API Documentation
 *   Module Type: Configuration
 *   @ai_context: Centralized API documentation setup with comprehensive schemas
 */

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';

const port = process.env['PORT'] || 3000;
const host = process.env['HOST'] || 'localhost';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express TypeScript API Template',
      version: '1.0.0',
      description:
        'A comprehensive API template with PostgreSQL, Swagger documentation, and CRUD operations',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://${host}:${port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            message: {
              type: 'string',
              description: 'Detailed error message',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            total: {
              type: 'integer',
              description: 'Total number of records',
            },
            page: {
              type: 'integer',
              description: 'Current page number',
            },
            limit: {
              type: 'integer',
              description: 'Number of records per page',
            },
            totalPages: {
              type: 'integer',
              description: 'Total number of pages',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User unique identifier',
            },
            username: {
              type: 'string',
              description: 'User username',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role',
            },
            email_verified: {
              type: 'boolean',
              description: 'Email verification status',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Profile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Profile unique identifier',
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'Associated user ID',
            },
            first_name: {
              type: 'string',
              description: 'User first name',
            },
            last_name: {
              type: 'string',
              description: 'User last name',
            },
            bio: {
              type: 'string',
              description: 'User biography',
            },
            avatar_url: {
              type: 'string',
              description: 'Avatar image URL',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/**/*.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
