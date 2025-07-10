/**
 * FILE OVERVIEW:
 *   Purpose: User controller extending base controller
 *   Key Concepts: Inheritance, Controller Layer, User Entity
 *   Module Type: Controller
 *   @ai_context: User controller using base controller logic
 */

import { BaseController } from '../base/base.controller';
import { UserModel } from './user.model';
import { UserService } from './user.service';

export class UserController extends BaseController<UserModel> {
  constructor() {
    super(new UserService());
  }
} 