/**
 * FILE OVERVIEW:
 *   Purpose: User service extending base CRUD service
 *   Key Concepts: Inheritance, Service Layer, User Entity
 *   Module Type: Service
 *   @ai_context: User CRUD service using base CRUD logic
 */

import { BaseCrudService } from '../base/base.service';
import { UserModel } from './user.model';

export class UserService extends BaseCrudService<UserModel> {
  constructor() {
    super(UserModel);
  }
} 