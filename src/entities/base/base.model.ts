/**
 * FILE OVERVIEW:
 *   Purpose: Base model interface and utilities for Sequelize models
 *   Key Concepts: Sequelize Model, DataTypes, Timestamps, UUID
 *   Module Type: Interface and Utilities
 *   @ai_context: Reusable model base for any entity with standard fields and methods
 */

import { sequelize } from '@/config/database';
import { DataTypes } from 'sequelize';

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
