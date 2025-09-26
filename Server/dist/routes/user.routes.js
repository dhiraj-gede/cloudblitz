"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// filepath: h:/Gremio/cloudblitz/Server/src/routes/user.routes.ts
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const validation_2 = require("../lib/validation");
const router = (0, express_1.Router)();
/**
 * User Management Routes
 * @route /api/users
 */
// Get all users - admin only
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), user_controller_1.UserController.getUsers);
// Get user by ID - admin can get any user, users can get themselves
router.get('/:id', auth_1.authenticate, user_controller_1.UserController.getUserById);
// Create user - admin only
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), (0, validation_1.validate)(validation_2.registerSchema), user_controller_1.UserController.createUser);
// Update user - admin can update anyone, users can update themselves
router.put('/:id', auth_1.authenticate, (0, validation_1.validate)(validation_2.updateUserSchema), user_controller_1.UserController.updateUser);
// Delete user - admin only
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('admin'), user_controller_1.UserController.deleteUser);
exports.default = router;
