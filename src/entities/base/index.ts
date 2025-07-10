/**
 * FILE OVERVIEW:
 *   Purpose: Export all base entity components for easy importing
 *   Key Concepts: Module Exports, Base Classes, CRUD Operations
 *   Module Type: Index
 *   @ai_context: Central export point for all base entity functionality
 */

// Export CRUD base class and interfaces
export {
  BaseCrudService,
  BaseEntity,
  CreateEntityData,
  UpdateEntityData,
  QueryOptions,
  PaginatedResult
} from './base.service';

// Export controller base class
export { BaseController } from './base.controller';

// Export routes base class
export { BaseRoutes } from './base.routes';

// Export model base fields and options
export {
  baseModelFields,
  baseModelOptions
} from './base.model'; 