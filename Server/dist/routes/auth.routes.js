"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_1 = require("../middlewares/validation");
const validation_2 = require("../lib/validation");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/**
 * Authentication Routes
 * @route /api/auth
 */
// Public routes
router.post('/register', (0, validation_1.validate)(validation_2.registerSchema), auth_controller_1.AuthController.register);
router.post('/login', (0, validation_1.validate)(validation_2.loginSchema), auth_controller_1.AuthController.login);
router.post('/refresh', (0, validation_1.validate)(validation_2.refreshTokenSchema), auth_controller_1.AuthController.refreshToken);
router.post('/forgot-password', (0, validation_1.validate)(validation_2.forgotPasswordSchema), (req, res) => {
    // TODO: Implement forgot password functionality
    res.status(501).json({ message: 'Not implemented' });
});
router.post('/reset-password', (0, validation_1.validate)(validation_2.resetPasswordSchema), (req, res) => {
    // TODO: Implement reset password functionality
    res.status(501).json({ message: 'Not implemented' });
});
// Protected routes
router.get('/me', auth_1.authenticate, auth_controller_1.AuthController.getCurrentUser);
router.post('/change-password', auth_1.authenticate, (0, validation_1.validate)(validation_2.changePasswordSchema), auth_controller_1.AuthController.changePassword);
router.post('/logout', auth_1.authenticate, auth_controller_1.AuthController.logout);
exports.default = router;
