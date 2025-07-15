/**
 * FILE OVERVIEW:
 *   Purpose: Base routes providing standard CRUD endpoints for any entity
 *   Key Concepts: Express.js Router, REST API, Route Standardization
 *   Module Type: Routes
 *   @ai_context: Reusable route definitions for any entity with standard CRUD operations
 */

import { Router } from 'express';
import { BaseController } from '@/entities/base/base.controller';
import { Model } from 'sequelize';

export abstract class BaseRoutes<T extends Model> {
  protected router: Router;
  protected controller: BaseController<T>;
  protected entityName: string;

  constructor(controller: BaseController<T>, entityName: string) {
    this.router = Router();
    this.controller = controller;
    this.entityName = entityName;
    this.setupRoutes();
  }

  protected setupRoutes(): void {
    this.router.post('/', (req, res) => this.controller.create(req, res));
    this.router.get('/', (req, res) => this.controller.getAll(req, res));
    this.router.get('/:id', (req, res) => this.controller.getById(req, res));
    this.router.patch('/:id', (req, res) => this.controller.update(req, res));
    this.router.delete('/:id', (req, res) => this.controller.delete(req, res));
  }

  getRouter(): Router {
    return this.router;
  }

  getEntityName(): string {
    return this.entityName;
  }

  protected addCustomRoutes(): void {
    // Override in child classes to add custom routes
  }
}
