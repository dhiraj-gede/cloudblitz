// filepath: h:/Gremio/cloudblitz/Server/src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { registerSchema, updateUserSchema } from '../lib/validation';

const router = Router();

/**
 * User Management Routes
 * @route /api/users
 */

// Get all users - admin only
router.get('/', authenticate, authorize('admin'), UserController.getUsers);

// Get user by ID - admin can get any user, users can get themselves
router.get('/:id', authenticate, UserController.getUserById);

// Create user - admin only
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(registerSchema),
  UserController.createUser
);

// Update user - admin can update anyone, users can update themselves
router.put(
  '/:id',
  authenticate,
  validate(updateUserSchema),
  UserController.updateUser
);

// Delete user - admin only
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  UserController.deleteUser
);

export default router;
