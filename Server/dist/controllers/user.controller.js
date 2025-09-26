"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
const response_1 = require("../lib/response");
const mongoose_1 = __importDefault(require("mongoose"));
class UserController {
    /**
     * Get all users
     * @route GET /api/users
     */
    static async getUsers(req, res) {
        try {
            // Get pagination params
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            // Build query - exclude password field
            const query = {};
            const total = await User_1.User.countDocuments(query);
            const users = await User_1.User.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .select('-password');
            response_1.ResponseHelper.paginated(res, users, page, limit, total);
        }
        catch (error) {
            response_1.ResponseHelper.error(res, error instanceof Error ? error.message : 'Error fetching users');
        }
    }
    /**
     * Get user by ID
     * @route GET /api/users/:id
     */
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                response_1.ResponseHelper.badRequest(res, 'Invalid user ID');
                return;
            }
            const user = await User_1.User.findById(id).select('-password');
            if (!user) {
                response_1.ResponseHelper.notFound(res, 'User not found');
                return;
            }
            response_1.ResponseHelper.success(res, user);
        }
        catch (error) {
            response_1.ResponseHelper.error(res, error instanceof Error ? error.message : 'Error fetching user');
        }
    }
    /**
     * Create a new user (admin only)
     * @route POST /api/users
     */
    static async createUser(req, res) {
        try {
            // Check for existing user
            const existingUser = await User_1.User.findOne({ email: req.body.email });
            if (existingUser) {
                response_1.ResponseHelper.conflict(res, 'User with this email already exists');
                return;
            }
            // Create new user
            const user = new User_1.User(req.body);
            await user.save();
            // Return user without password
            const userResponse = user.toJSON();
            response_1.ResponseHelper.created(res, userResponse, 'User created successfully');
        }
        catch (error) {
            response_1.ResponseHelper.error(res, error instanceof Error ? error.message : 'Error creating user');
        }
    }
    /**
     * Update user
     * @route PUT /api/users/:id
     */
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                response_1.ResponseHelper.badRequest(res, 'Invalid user ID');
                return;
            }
            // Find user
            const user = await User_1.User.findById(id);
            if (!user) {
                response_1.ResponseHelper.notFound(res, 'User not found');
                return;
            }
            // Check permissions - users can update only themselves unless admin
            if (req.user &&
                req.user.role !== 'admin' &&
                req.user._id.toString() !== id) {
                response_1.ResponseHelper.forbidden(res, 'You do not have permission to update this user');
                return;
            }
            // Don't allow role changes unless admin
            if (req.user &&
                req.user.role !== 'admin' &&
                updateData.role &&
                updateData.role !== user.role) {
                delete updateData.role;
            }
            // Update user
            const updatedUser = await User_1.User.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).select('-password');
            response_1.ResponseHelper.success(res, updatedUser, 'User updated successfully');
        }
        catch (error) {
            response_1.ResponseHelper.error(res, error instanceof Error ? error.message : 'Error updating user');
        }
    }
    /**
     * Delete user
     * @route DELETE /api/users/:id
     */
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                response_1.ResponseHelper.badRequest(res, 'Invalid user ID');
                return;
            }
            // Don't allow deleting the last admin
            const adminCount = await User_1.User.countDocuments({ role: 'admin' });
            const userToDelete = await User_1.User.findById(id);
            if (userToDelete?.role === 'admin' && adminCount <= 1) {
                response_1.ResponseHelper.badRequest(res, 'Cannot delete the last admin user');
                return;
            }
            const deletedUser = await User_1.User.findByIdAndDelete(id);
            if (!deletedUser) {
                response_1.ResponseHelper.notFound(res, 'User not found');
                return;
            }
            response_1.ResponseHelper.success(res, null, 'User deleted successfully');
        }
        catch (error) {
            response_1.ResponseHelper.error(res, error instanceof Error ? error.message : 'Error deleting user');
        }
    }
}
exports.UserController = UserController;
