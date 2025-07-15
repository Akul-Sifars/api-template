/**
 * FILE OVERVIEW:
 *   Purpose: User controller extending base controller
 *   Key Concepts: Inheritance, Controller Layer, User Entity
 *   Module Type: Controller
 *   @ai_context: User controller using base controller logic
 */

import { BaseController } from '@/entities/base/base.controller';
import { UserModel } from '@/entities/user/user.model';
import { UserService } from '@/entities/user/user.service';

export class UserController extends BaseController<UserModel> {
  constructor() {
    super(new UserService());
  }
}
