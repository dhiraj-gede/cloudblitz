import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validation';
import { 
  loginSchema, 
  registerSchema, 
  refreshTokenSchema, 
  changePasswordSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from '../lib/validation';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * Authentication Routes
 * @route /api/auth
 */

// Public routes
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', validate(refreshTokenSchema), AuthController.refreshToken);
router.post('/forgot-password', validate(forgotPasswordSchema), (req, res) => {
  // TODO: Implement forgot password functionality
  res.status(501).json({ message: 'Not implemented' });
});
router.post('/reset-password', validate(resetPasswordSchema), (req, res) => {
  // TODO: Implement reset password functionality
  res.status(501).json({ message: 'Not implemented' });
});

// Protected routes
router.get('/me', authenticate, AuthController.getCurrentUser);
router.post('/change-password', authenticate, validate(changePasswordSchema), AuthController.changePassword);
router.post('/logout', authenticate, AuthController.logout);

export default router;