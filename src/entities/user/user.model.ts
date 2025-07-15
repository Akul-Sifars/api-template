/**
 * FILE OVERVIEW:
 *   Purpose: User model definition extending base model fields
 *   Key Concepts: Sequelize Model, Inheritance, User Entity
 *   Module Type: Model
 *   @ai_context: User entity model using base model fields and options
 */

import { DataTypes, Model } from 'sequelize';
import { baseModelFields, baseModelOptions } from '@/entities/base/base.model';

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel extends Model<UserAttributes> implements UserAttributes {
  declare id: string;
  declare name: string;
  declare email: string;
  declare created_at: Date;
  declare updated_at: Date;
}

UserModel.init(
  {
    ...baseModelFields,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Unknown',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    ...baseModelOptions,
    modelName: 'User',
    tableName: 'users',
  }
);
