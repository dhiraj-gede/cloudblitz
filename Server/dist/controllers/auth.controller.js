"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = require("../models/User");
const response_1 = require("../lib/response");
const jwt_1 = require("../lib/jwt");
class AuthController {
    /**
     * Register a new user
     * @route POST /api/auth/register
     */
    static async register(req, res) {
        try {
            const userData = req.body;
            // Check if user already exists
            const existingUser = await User_1.User.findOne({ email: userData.email });
            if (existingUser) {
                response_1.ResponseHelper.conflict(res, 'User with this email already exists');
                return;
            }
            // Create new user
            const user = new User_1.User(userData);
            await user.save();
            // Generate tokens
            const accessToken = (0, jwt_1.generateAccessToken)(user);
            const refreshToken = (0, jwt_1.generateRefreshToken)(user);
            response_1.ResponseHelper.created(res, {
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
        }
        catch (error) {
            console.error('Registration error:', error);
            response_1.ResponseHelper.internalError(res, 'Error during registration');
        }
    }
    /**
     * Login user
     * @route POST /api/auth/login
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            // Find user
            const user = await User_1.User.findOne({ email }).select('+password');
            if (!user) {
                response_1.ResponseHelper.unauthorized(res, 'Invalid email or password');
                return;
            }
            // Check if user is active
            if (!user.isActive) {
                response_1.ResponseHelper.unauthorized(res, 'Account is deactivated. Please contact support.');
                return;
            }
            // Check password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                response_1.ResponseHelper.unauthorized(res, 'Invalid email or password');
                return;
            }
            // Generate tokens
            const accessToken = (0, jwt_1.generateAccessToken)(user);
            const refreshToken = (0, jwt_1.generateRefreshToken)(user);
            response_1.ResponseHelper.success(res, {
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
        }
        catch (error) {
            console.error('Login error:', error);
            response_1.ResponseHelper.internalError(res, 'Error during login');
        }
    }
    /**
     * Get current user profile
     * @route GET /api/auth/me
     */
    static async getCurrentUser(req, res) {
        try {
            if (!req.user) {
                response_1.ResponseHelper.unauthorized(res);
                return;
            }
            const user = await User_1.User.findById(req.user.id);
            if (!user) {
                response_1.ResponseHelper.notFound(res, 'User not found');
                return;
            }
            response_1.ResponseHelper.success(res, {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }, 'User profile retrieved');
        }
        catch (error) {
            console.error('Get current user error:', error);
            response_1.ResponseHelper.internalError(res, 'Error fetching user profile');
        }
    }
    /**
     * Refresh access token
     * @route POST /api/auth/refresh
     */
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            // Verify refresh token
            const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
            if (!decoded) {
                response_1.ResponseHelper.unauthorized(res, 'Invalid refresh token');
                return;
            }
            // Find user
            const user = await User_1.User.findById(decoded.userId);
            if (!user || !user.isActive) {
                response_1.ResponseHelper.unauthorized(res, 'User not found or inactive');
                return;
            }
            // Generate new access token
            const newAccessToken = (0, jwt_1.generateAccessToken)(user);
            response_1.ResponseHelper.success(res, {
                accessToken: newAccessToken.token,
                expiresIn: newAccessToken.expiresIn
            }, 'Access token refreshed successfully');
        }
        catch (error) {
            console.error('Refresh token error:', error);
            response_1.ResponseHelper.internalError(res, 'Error refreshing token');
        }
    }
    /**
     * Logout user
     * @route POST /api/auth/logout
     * @note This is a client-side logout, server doesn't actually invalidate tokens
     * A production app would typically use token invalidation or a token blacklist
     */
    static async logout(_req, res) {
        try {
            response_1.ResponseHelper.success(res, null, 'Logged out successfully');
        }
        catch (error) {
            console.error('Logout error:', error);
            response_1.ResponseHelper.internalError(res, 'Error during logout');
        }
    }
    /**
     * Change user password
     * @route POST /api/auth/change-password
     */
    static async changePassword(req, res) {
        try {
            if (!req.user) {
                response_1.ResponseHelper.unauthorized(res);
                return;
            }
            const { currentPassword, newPassword } = req.body;
            // Get user with password
            const user = await User_1.User.findById(req.user.id).select('+password');
            if (!user) {
                response_1.ResponseHelper.notFound(res, 'User not found');
                return;
            }
            // Verify current password
            const isPasswordValid = await user.comparePassword(currentPassword);
            if (!isPasswordValid) {
                response_1.ResponseHelper.badRequest(res, 'Current password is incorrect');
                return;
            }
            // Update password
            user.password = newPassword;
            await user.save();
            response_1.ResponseHelper.success(res, null, 'Password changed successfully');
        }
        catch (error) {
            console.error('Change password error:', error);
            response_1.ResponseHelper.internalError(res, 'Error changing password');
        }
    }
}
exports.AuthController = AuthController;
