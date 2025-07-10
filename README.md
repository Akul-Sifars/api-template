# Express TypeScript API Template

A comprehensive Express TypeScript API template with **PostgreSQL**, Swagger documentation, Sequelize ORM, and reusable CRUD base classes.

## 🚀 Features

- **PostgreSQL Only**: Simple, production-ready configuration via environment variables
- **Sequelize ORM**: Full TypeScript support with models and migrations
- **Swagger Documentation**: Auto-generated API documentation
- **Base CRUD Classes**: Reusable CRUD operations for any entity
- **Colorful Logging**: Chalk integration for beautiful console output
- **Docker Support**: Docker Compose for PostgreSQL and pgAdmin
- **TypeScript**: Full type safety and IntelliSense support
- **Security**: Helmet, CORS, and rate limiting
- **Validation**: Zod schema validation
- **Environment Configuration**: Flexible environment-based setup

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (local or Docker)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd express-typescript-api-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env as needed
   ```

## 🗄️ Database Setup

### PostgreSQL (Recommended)
```bash
# Using Docker (easiest)
npm run docker:up

# Or install PostgreSQL locally
# 1. Install PostgreSQL
# 2. Create database: CREATE DATABASE api_template;
# 3. Update .env with your credentials
```

## 🚀 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/health

## 🏗️ Project Structure

```
src/
├── config/
│   ├── database.ts          # PostgreSQL database configuration
│   └── database-setup.ts    # Database setup utilities
├── entities/
│   ├── base/
│   │   ├── base.model.ts
│   │   ├── base.service.ts
│   │   ├── base.controller.ts
│   │   ├── base.routes.ts
│   │   └── index.ts
│   └── user/
│       ├── user.controller.ts
│       ├── user.model.ts
│       ├── user.routes.ts
│       └── user.service.ts
├── shared/
│   └── utils/
│       └── logger.ts        # Chalk-based logging
└── index.ts                # Main application entry point
```

## 🔧 Database Configuration

All configuration is via environment variables:

```bash
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
import { baseModelFields, baseModelOptions } from '../base/base.model.js';

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
import { BaseCrudService } from '../base/base.service.js';
export class UserService extends BaseCrudService<UserModel> {
  constructor() { super(UserModel); }
}

// user.controller.ts
import { BaseController } from '../base/base.controller.js';
import { UserService } from './user.service.js';
export class UserController extends BaseController<UserModel> {
  constructor() { super(new UserService()); }
}

// user.routes.ts
import { BaseRoutes } from '../base/base.routes.js';
import { UserController } from './user.controller.js';
export class UserRoutes extends BaseRoutes<UserModel> {
  constructor() { super(new UserController(), 'users'); }
}
```

Register the routes in your app:
```typescript
import { UserRoutes } from './entities/user/user.routes.js';
app.use('/users', new UserRoutes().getRouter());
```

## 📝 Notes
- Only PostgreSQL is supported out of the box.
- All configuration is via environment variables.
- Session management is not included by default (stateless API).
- All CRUD endpoints use PATCH for updates (partial updates).
- Swagger/OpenAPI docs are generated from JSDoc annotations.

## 🐳 Docker Compose

- **Postgres**: Exposed on port 5432 (container 5432)
- **pgAdmin**: Exposed on port 5050
