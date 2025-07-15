/**
 * FILE OVERVIEW:
 *   Purpose: User routes extending base routes
 *   Key Concepts: Inheritance, Express Router, User Entity
 *   Module Type: Routes
 *   @ai_context: User routes using base routes logic
 */

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Create a user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *   patch:
 *     summary: Update a user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */

import { BaseRoutes } from '@/entities/base/base.routes';
import { UserModel } from '@/entities/user/user.model';
import { UserController } from '@/entities/user/user.controller';

export class UserRoutes extends BaseRoutes<UserModel> {
  constructor() {
    super(new UserController(), 'users');
  }
}
