/**
 * FILE OVERVIEW:
 *   Purpose: Base model interface and utilities for Sequelize models
 *   Key Concepts: Sequelize Model, DataTypes, Timestamps, UUID
 *   Module Type: Interface and Utilities
 *   @ai_context: Reusable model base for any entity with standard fields and methods
 */

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export interface BaseModelAttributes {
  id: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface BaseModelCreationAttributes extends Omit<BaseModelAttributes, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
}

export const baseModelFields = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
};

export const baseModelOptions = {
  sequelize,
  timestamps: true,
  underscored: true,
  paranoid: false, // Set to true if you want soft deletes
};

export class ModelUtils {
  static getTableName(modelName: string): string {
    return modelName.toLowerCase() + 's';
  }
  static async createWithValidation<T extends Model>(model: { create: (data: Record<string, unknown>) => Promise<T> }, data: Record<string, unknown>): Promise<T> {
    return await model.create(data);
  }
  static async findByIdSafe<T extends Model>(model: { findByPk: (id: string) => Promise<T | null> }, id: string): Promise<T | null> {
    try {
      return await model.findByPk(id);
    } catch (error) {
      console.error('Error finding record by ID:', error);
      return null;
    }
  }
  static toPublicJSON(instance: Model): Record<string, unknown> {
    const data = instance.toJSON() as Record<string, unknown>;
    if ('password' in data) delete data['password'];
    if ('token' in data) delete data['token'];
    return data;
  }
  static isNew(instance: Model): boolean {
    const data = instance.toJSON() as Record<string, unknown>;
    return !('created_at' in data) || data['created_at'] === undefined || data['created_at'] === null;
  }
  static getAgeInDays(instance: Model): number {
    const data = instance.toJSON() as Record<string, unknown>;
    const created = data['created_at'];
    if (!created || typeof created !== 'string') return 0;
    const now = new Date();
    const createdDate = new Date(created);
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
} 