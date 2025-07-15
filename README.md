# Express TypeScript API Template

A comprehensive Express TypeScript API template with **PostgreSQL**, Swagger documentation, Sequelize ORM, and reusable CRUD base classes.

## 🚀 Features

- **PostgreSQL**: Production-ready configuration with optimized environment management
- **Sequelize ORM**: Full TypeScript support with models and migrations
- **Swagger Documentation**: Auto-generated API documentation
- **Base CRUD Classes**: Reusable CRUD operations for any entity
- **Optimized Environment**: Cached environment variables for performance
- **Path Aliases**: Clean imports with `@` prefix
- **Docker Support**: Docker Compose for PostgreSQL
- **TypeScript**: Full type safety and IntelliSense support
- **Colorful Logging**: Chalk integration for beautiful console output

## 📋 Prerequisites

Before setting up this project, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Docker & Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/) (optional, for database)

## 🛠️ Getting Started

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd express-typescript-api-template
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your configuration
# You can use any text editor or IDE
```

**Required Environment Variables:**
```bash
# Server Configuration
PORT=3000
HOST=localhost
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database Configuration (PostgreSQL)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=api_template
DATABASE_USER=postgres
DATABASE_PASSWORD=password

### Step 4: Database Setup

**Option A: Using Docker (Recommended)**
```bash
# Start PostgreSQL with Docker
npm run docker:up

# Check if containers are running
docker ps
```

**Option B: Local PostgreSQL**
1. Install PostgreSQL on your system
2. Create a database: `CREATE DATABASE api_template;`
3. Update `.env` with your local PostgreSQL credentials

### Step 5: Build and Run

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

### Step 6: Verify Setup

Once the server is running, visit:
- **API Documentation**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/health
- **Users API**: http://localhost:3000/users

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Database
npm run docker:up    # Start Docker services
npm run docker:down  # Stop Docker services
npm run docker:logs  # View Docker logs

# Utilities
npm run clean        # Clean build directory
```

## 🏗️ Project Structure

```
src/
├── config/
│   ├── database.ts          # PostgreSQL database configuration
│   └── swagger.ts          # Swagger documentation setup
├── entities/
│   ├── base/
│   │   ├── base.model.ts   # Base model with common fields
│   │   ├── base.service.ts # Base CRUD service
│   │   ├── base.controller.ts # Base HTTP controller
│   │   └── base.routes.ts  # Base Express routes
│   └── user/
│       ├── user.model.ts   # User entity model
│       ├── user.service.ts # User-specific service
│       ├── user.controller.ts # User HTTP controller
│       └── user.routes.ts  # User Express routes
├── utils/
│   ├── env.ts             # Optimized environment configuration
│   └── logger.ts          # Chalk-based logging utility
└── index.ts               # Main application entry point
```

## 🔧 Environment Configuration

All configuration is via environment variables in `src/utils/env.ts`:

```bash
# Server Configuration
PORT=3000
HOST=localhost
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=api_template
DATABASE_USER=postgres
DATABASE_PASSWORD=password
```

## 🧩 Usage Example: Creating a New Entity

1. **Model**: Extend the base model fields
2. **Service**: Extend `BaseCrudService`
3. **Controller**: Extend `BaseController`
4. **Routes**: Extend `BaseRoutes`

```typescript
// user.model.ts
import { DataTypes, Model } from 'sequelize';
import { baseModelFields, baseModelOptions } from '@/entities/base/base.model';

export class UserModel extends Model {}
UserModel.init({
  ...baseModelFields,
  name: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Unknown' },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  ...baseModelOptions,
  modelName: 'User',
  tableName: 'users',
});

// user.service.ts
import { BaseCrudService } from '@/entities/base/base.service';
export class UserService extends BaseCrudService<UserModel> {
  constructor() { super(UserModel); }
}

// user.controller.ts
import { BaseController } from '@/entities/base/base.controller';
import { UserService } from './user.service';
export class UserController extends BaseController<UserModel> {
  constructor() { super(new UserService()); }
}

// user.routes.ts
import { BaseRoutes } from '@/entities/base/base.routes';
import { UserController } from './user.controller';
export class UserRoutes extends BaseRoutes<UserModel> {
  constructor() { super(new UserController(), 'users'); }
}
```

Register the routes in your app:
```typescript
import { UserRoutes } from '@/entities/user/user.routes';
app.use('/users', new UserRoutes().getRouter());
```

## 🔒 Git Hooks

This project includes pre-commit hooks that automatically run:
- **Code formatting** with Prettier
- **Linting** with ESLint
- **Type checking** and build verification

## 📝 Notes

- **Optimized Environment**: Uses caching for better performance
- **Path Aliases**: All imports use `@` prefix for cleaner code
- **PostgreSQL Only**: Simplified to focus on one database type
- **Type Safety**: Full TypeScript support throughout
- **CRUD Endpoints**: Standard REST endpoints with PATCH for updates
- **Swagger Docs**: Auto-generated from JSDoc annotations

## 🐳 Docker Compose

- **PostgreSQL**: Exposed on port 5432
- **Network**: Uses `api_network` bridge network

```yaml
services:
  postgres:
    image: postgres:latest
    environment:
      POSTGRES_DB: ${DATABASE_NAME}
      POSTGRES_USER: ${DATABASE_USER}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
    ports:
      - "5432:5432"
    networks:
      - api_network
```

## 🆘 Troubleshooting

**Common Issues:**

1. **Port already in use**: Change `PORT` in `.env` file
2. **Database connection failed**: Check PostgreSQL is running and credentials in `.env`
3. **Build errors**: Run `npm run clean && npm install && npm run build`
4. **Lint errors**: Run `npm run lint:fix`
5. **Docker issues**: Restart Docker Desktop and run `npm run docker:down && npm run docker:up`

**Getting Help:**
- Check the logs: `npm run docker:logs`
- Verify environment: `npm run docker:up && npm run dev`
- Test database: Visit http://localhost:3000/health
