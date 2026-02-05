// Authentication Routes

import { Router } from 'express';
import {
  register,
  login,
  refreshAccessToken,
  logout,
} from '../controllers/auth.controller.js';
import {
  validate,
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../middleware/validation.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { loginRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', validate(registerSchema), register);

/**
 * POST /api/auth/login
 * Login user and return JWT tokens
 * Rate limited: 5 attempts per 15 minutes
 */
router.post('/login', loginRateLimiter, validate(loginSchema), login);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', validate(refreshTokenSchema), refreshAccessToken);

/**
 * POST /api/auth/logout
 * Logout user (requires authentication)
 */
router.post('/logout', authenticateToken, logout);

export default router;
