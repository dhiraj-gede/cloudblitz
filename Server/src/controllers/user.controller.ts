// filepath: h:/Gremio/cloudblitz/Server/src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { User } from '../models/User';
import { ResponseHelper } from '../lib/response';
import { AuthRequest } from '../middlewares/auth';
import { UpdateUserInput } from '../lib/validation';
import mongoose from 'mongoose';

export class UserController {
  /**
   * Get all users
   * @route GET /api/users
   */
  static async getUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Get pagination params
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Build query - exclude password field
      const query = {};

      const total = await User.countDocuments(query);

      const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-password');

      ResponseHelper.paginated(res, users, page, limit, total);
    } catch (error) {
      ResponseHelper.error(
        res,
        error instanceof Error ? error.message : 'Error fetching users'
      );
    }
  }

  /**
   * Get user by ID
   * @route GET /api/users/:id
   */
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        ResponseHelper.badRequest(res, 'Invalid user ID');
        return;
      }

      const user = await User.findById(id).select('-password');

      if (!user) {
        ResponseHelper.notFound(res, 'User not found');
        return;
      }

      ResponseHelper.success(res, user);
    } catch (error) {
      ResponseHelper.error(
        res,
        error instanceof Error ? error.message : 'Error fetching user'
      );
    }
  }

  /**
   * Create a new user (admin only)
   * @route POST /api/users
   */
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      // Check for existing user
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        ResponseHelper.conflict(res, 'User with this email already exists');
        return;
      }

      // Create new user
      const user = new User(req.body);
      await user.save();

      // Return user without password
      const userResponse = user.toJSON();

      ResponseHelper.created(res, userResponse, 'User created successfully');
    } catch (error) {
      ResponseHelper.error(
        res,
        error instanceof Error ? error.message : 'Error creating user'
      );
    }
  }

  /**
   * Update user
   * @route PUT /api/users/:id
   */
  static async updateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateUserInput = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        ResponseHelper.badRequest(res, 'Invalid user ID');
        return;
      }

      // Find user
      const user = await User.findById(id);

      if (!user) {
        ResponseHelper.notFound(res, 'User not found');
        return;
      }

      // Check permissions - users can update only themselves unless admin
      if (
        req.user &&
        req.user.role !== 'admin' &&
        req.user._id.toString() !== id
      ) {
        ResponseHelper.forbidden(
          res,
          'You do not have permission to update this user'
        );
        return;
      }

      // Don't allow role changes unless admin
      if (
        req.user &&
        req.user.role !== 'admin' &&
        updateData.role &&
        updateData.role !== user.role
      ) {
        delete updateData.role;
      }

      // Only allow users to update their own hasSeenTutorial flag
      if (
        req.user &&
        req.user.role !== 'admin' &&
        Object.prototype.hasOwnProperty.call(updateData, 'hasSeenTutorial') &&
        req.user._id.toString() !== id
      ) {
        delete updateData.hasSeenTutorial;
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      ResponseHelper.success(res, updatedUser, 'User updated successfully');
    } catch (error) {
      ResponseHelper.error(
        res,
        error instanceof Error ? error.message : 'Error updating user'
      );
    }
  }

  /**
   * Delete user
   * @route DELETE /api/users/:id
   */
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        ResponseHelper.badRequest(res, 'Invalid user ID');
        return;
      }

      // Don't allow deleting the last admin
      const adminCount = await User.countDocuments({ role: 'admin' });
      const userToDelete = await User.findById(id);

      if (userToDelete?.role === 'admin' && adminCount <= 1) {
        ResponseHelper.badRequest(res, 'Cannot delete the last admin user');
        return;
      }

      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        ResponseHelper.notFound(res, 'User not found');
        return;
      }

      ResponseHelper.success(res, null, 'User deleted successfully');
    } catch (error) {
      ResponseHelper.error(
        res,
        error instanceof Error ? error.message : 'Error deleting user'
      );
    }
  }
}
