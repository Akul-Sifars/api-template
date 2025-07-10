/**
 * FILE OVERVIEW:
 *   Purpose: Base controller providing common HTTP endpoints for CRUD operations
 *   Key Concepts: Express.js, REST API, Error Handling, Response Standardization
 *   Module Type: Controller
 *   @ai_context: Reusable HTTP controller for any entity with standard CRUD endpoints
 */

import { Request, Response } from 'express';
import { BaseCrudService, CreateEntityData, UpdateEntityData, QueryOptions } from './base.service';
import { Model } from 'sequelize';
import { logger } from '../../shared/utils/logger';
import chalk from 'chalk';

export abstract class BaseController<T extends Model> {
  protected service: BaseCrudService<T>;

  constructor(service: BaseCrudService<T>) {
    this.service = service;
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateEntityData = req.body;
      const result = await this.service.create(data);
      res.status(201).json({
        success: true,
        data: result,
        message: 'Record created successfully'
      });
    } catch (error) {
      logger.error(chalk.red('Controller create error:'), error);
      res.status(500).json({
        success: false,
        message: 'Failed to create record',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: 'ID parameter is required' });
        return;
      }
      const result = await this.service.findById(id);
      if (!result) {
        res.status(404).json({ success: false, message: 'Record not found' });
        return;
      }
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      logger.error(chalk.red('Controller getById error:'), error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve record',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '10', orderBy = 'created_at', orderDirection = 'DESC', ...whereParams } = req.query;
      const options: QueryOptions = {
        limit: parseInt(limit as string),
        offset: (parseInt(page as string) - 1) * parseInt(limit as string),
        orderBy: orderBy as string,
        orderDirection: orderDirection as 'ASC' | 'DESC',
        where: whereParams
      };
      const result = await this.service.findAll(options);
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      logger.error(chalk.red('Controller getAll error:'), error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve records',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: 'ID parameter is required' });
        return;
      }
      const data: UpdateEntityData = req.body;
      const result = await this.service.update(id, data);
      if (!result) {
        res.status(404).json({ success: false, message: 'Record not found' });
        return;
      }
      res.status(200).json({ success: true, data: result, message: 'Record updated successfully' });
    } catch (error) {
      logger.error(chalk.red('Controller update error:'), error);
      res.status(500).json({
        success: false,
        message: 'Failed to update record',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: 'ID parameter is required' });
        return;
      }
      const success = await this.service.delete(id);
      if (!success) {
        res.status(404).json({ success: false, message: 'Record not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Record deleted successfully' });
    } catch (error) {
      logger.error(chalk.red('Controller delete error:'), error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete record',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 