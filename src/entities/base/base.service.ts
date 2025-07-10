/**
 * FILE OVERVIEW:
 *   Purpose: Base CRUD service providing common database operations with Sequelize
 *   Key Concepts: Sequelize ORM, Generic Types, Error Handling, Pagination
 *   Module Type: Service
 *   @ai_context: Reusable CRUD operations for any Sequelize model
 */

import { Model, FindOptions, WhereOptions, ModelStatic } from 'sequelize';
import { logger } from '../../shared/utils/logger';
import chalk from 'chalk';

export interface BaseEntity {
  id: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateEntityData {
  [key: string]: unknown;
}

export interface UpdateEntityData {
  [key: string]: unknown;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  where?: Record<string, any>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export abstract class BaseCrudService<T extends Model> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async create(data: CreateEntityData): Promise<T> {
    try {
      const result = await this.model.create(data as never) as T;
      logger.info(chalk.green(`✓ Created ${this.model.name} record with ID: ${(result as any).id}`));
      return result;
    } catch (error) {
      logger.error(chalk.red(`Error creating ${this.model.name} record:`), error);
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const result = await this.model.findByPk(id) as T | null;
      return result;
    } catch (error) {
      logger.error(chalk.red(`Error finding ${this.model.name} by ID:`), error);
      throw error;
    }
  }

  async findAll(options: QueryOptions = {}): Promise<PaginatedResult<T>> {
    try {
      const { limit = 10, offset = 0, orderBy = 'created_at', orderDirection = 'DESC', where = {} } = options;
      const findOptions: FindOptions = {
        where: where as WhereOptions,
        limit,
        offset,
        order: [[orderBy, orderDirection]],
      };
      const [data, total] = await Promise.all([
        this.model.findAll(findOptions) as Promise<T[]>,
        this.model.count({ where: where as WhereOptions }),
      ]);
      const totalPages = Math.ceil(total / limit);
      const page = Math.floor(offset / limit) + 1;
      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      logger.error(chalk.red(`Error finding ${this.model.name} records:`), error);
      throw error;
    }
  }

  async update(id: string, data: UpdateEntityData): Promise<T | null> {
    try {
      const record = await this.model.findByPk(id);
      if (!record) {
        return null;
      }
      await record.update(data);
      logger.info(chalk.green(`✓ Updated ${this.model.name} record with ID: ${id}`));
      return record as T;
    } catch (error) {
      logger.error(chalk.red(`Error updating ${this.model.name} record:`), error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const record = await this.model.findByPk(id);
      if (!record) {
        return false;
      }
      await record.destroy();
      logger.info(chalk.green(`✓ Deleted ${this.model.name} record with ID: ${id}`));
      return true;
    } catch (error) {
      logger.error(chalk.red(`Error deleting ${this.model.name} record:`), error);
      throw error;
    }
  }

  async findOne(criteria: Record<string, any>): Promise<T | null> {
    try {
      const result = await this.model.findOne({ where: criteria }) as T | null;
      return result;
    } catch (error) {
      logger.error(chalk.red(`Error finding ${this.model.name} record:`), error);
      throw error;
    }
  }

  async exists(criteria: Record<string, any>): Promise<boolean> {
    try {
      const count = await this.model.count({ where: criteria });
      return count > 0;
    } catch (error) {
      logger.error(chalk.red(`Error checking ${this.model.name} existence:`), error);
      throw error;
    }
  }

  async bulkCreate(records: CreateEntityData[]): Promise<T[]> {
    try {
      if (records.length === 0) return [];
      const result = await this.model.bulkCreate(records as never[]) as T[];
      logger.info(chalk.green(`✓ Bulk created ${result.length} ${this.model.name} records`));
      return result;
    } catch (error) {
      logger.error(chalk.red(`Error bulk creating ${this.model.name} records:`), error);
      throw error;
    }
  }

  async findWithFilter(filter: {
    where?: WhereOptions;
    order?: [string, 'ASC' | 'DESC'][];
    limit?: number;
    offset?: number;
    include?: any[];
  }): Promise<T[]> {
    try {
      const result = await this.model.findAll(filter) as T[];
      return result;
    } catch (error) {
      logger.error(chalk.red(`Error finding ${this.model.name} with filter:`), error);
      throw error;
    }
  }

  async count(criteria: Record<string, any> = {}): Promise<number> {
    try {
      return await this.model.count({ where: criteria });
    } catch (error) {
      logger.error(chalk.red(`Error counting ${this.model.name} records:`), error);
      throw error;
    }
  }

  async findOrCreate(criteria: Record<string, unknown>, defaults: CreateEntityData = {}): Promise<[T, boolean]> {
    try {
      const [record, created] = await this.model.findOrCreate({
        where: criteria as never,
        defaults: defaults as never,
      }) as [T, boolean];
      if (created) {
        logger.info(chalk.green(`✓ Created new ${this.model.name} record`));
      }
      return [record, created];
    } catch (error) {
      logger.error(chalk.red(`Error in findOrCreate for ${this.model.name}:`), error);
      throw error;
    }
  }
} 