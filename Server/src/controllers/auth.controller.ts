import { Request, Response } from 'express';
import { User } from '../models/User';
import { ResponseHelper } from '../lib/response';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { LoginInput, RegisterInput, RefreshTokenInput, ChangePasswordInput } from '../lib/validation';
import { AuthRequest } from '../middlewares/auth';

export class AuthController {
  /**
   * Register a new user
   * @route POST /api/auth/register
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: RegisterInput = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        ResponseHelper.conflict(res, 'User with this email already exists');
        return;
      }
      
      // Create new user
      const user = new User(userData);
      await user.save();
      
      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      
      ResponseHelper.created(res, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
        expiresIn: accessToken.expiresIn
      }, 'User registered successfully');
    } catch (error) {
      console.error('Registration error:', error);
      ResponseHelper.internalError(res, 'Error during registration');
    }
  }
  
  /**
   * Login user
   * @route POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginInput = req.body;
      
      // Find user
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        ResponseHelper.unauthorized(res, 'Invalid email or password');
        return;
      }
      
      // Check if user is active
      if (!user.isActive) {
        ResponseHelper.unauthorized(res, 'Account is deactivated. Please contact support.');
        return;
      }
      
      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        ResponseHelper.unauthorized(res, 'Invalid email or password');
        return;
      }
      
      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      
      ResponseHelper.success(res, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
        expiresIn: accessToken.expiresIn
      }, 'Login successful');
    } catch (error) {
      console.error('Login error:', error);
      ResponseHelper.internalError(res, 'Error during login');
    }
  }
  
  /**
   * Get current user profile
   * @route GET /api/auth/me
   */
  static async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseHelper.unauthorized(res);
        return;
      }
      
      const user = await User.findById(req.user.id);
      if (!user) {
        ResponseHelper.notFound(res, 'User not found');
        return;
      }
      
      ResponseHelper.success(res, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }, 'User profile retrieved');
    } catch (error) {
      console.error('Get current user error:', error);
      ResponseHelper.internalError(res, 'Error fetching user profile');
    }
  }
  
  /**
   * Refresh access token
   * @route POST /api/auth/refresh
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken }: RefreshTokenInput = req.body;
      
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        ResponseHelper.unauthorized(res, 'Invalid refresh token');
        return;
      }
      
      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        ResponseHelper.unauthorized(res, 'User not found or inactive');
        return;
      }
      
      // Generate new access token
      const newAccessToken = generateAccessToken(user);
      
      ResponseHelper.success(res, {
        accessToken: newAccessToken.token,
        expiresIn: newAccessToken.expiresIn
      }, 'Access token refreshed successfully');
    } catch (error) {
      console.error('Refresh token error:', error);
      ResponseHelper.internalError(res, 'Error refreshing token');
    }
  }
  
  /**
   * Logout user
   * @route POST /api/auth/logout
   * @note This is a client-side logout, server doesn't actually invalidate tokens
   * A production app would typically use token invalidation or a token blacklist
   */
  static async logout(_req: Request, res: Response): Promise<void> {
    try {
      ResponseHelper.success(res, null, 'Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      ResponseHelper.internalError(res, 'Error during logout');
    }
  }
  
  /**
   * Change user password
   * @route POST /api/auth/change-password
   */
  static async changePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseHelper.unauthorized(res);
        return;
      }
      
      const { currentPassword, newPassword }: ChangePasswordInput = req.body;
      
      // Get user with password
      const user = await User.findById(req.user.id).select('+password');
      if (!user) {
        ResponseHelper.notFound(res, 'User not found');
        return;
      }
      
      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        ResponseHelper.badRequest(res, 'Current password is incorrect');
        return;
      }
      
      // Update password
      user.password = newPassword;
      await user.save();
      
      ResponseHelper.success(res, null, 'Password changed successfully');
    } catch (error) {
      console.error('Change password error:', error);
      ResponseHelper.internalError(res, 'Error changing password');
    }
  }
}