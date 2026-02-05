// Authentication Controller

import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.utils.js';
import type {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  AuthResponse,
  UserResponse,
} from '../types/auth.types.js';

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

/**
 * Helper function to format user response (exclude sensitive data)
 */
function formatUserResponse(user: any): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    agency: user.agency,
    licenseNumber: user.licenseNumber,
    avatarUrl: user.avatarUrl,
    language: user.language,
    timezone: user.timezone,
    currency: user.currency,
    theme: user.theme,
    createdAt: user.createdAt,
  };
}

/**
 * Register new user
 * POST /api/auth/register
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name, phone } = req.body as RegisterRequest;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'Registration failed' });
      return;
    }

    // Hash password with bcrypt (cost 12)
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
      },
    });

    // Return success response (do not return password hash)
    res.status(201).json({
      message: 'User registered successfully',
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as LoginRequest;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Compare password with bcrypt
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: 'corretor', // Default role
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Update last_login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Return tokens and user profile
    const response: AuthResponse = {
      accessToken,
      refreshToken,
      user: formatUserResponse(user),
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export async function refreshAccessToken(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { refreshToken } = req.body as RefreshTokenRequest;

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    if (error instanceof Error && error.message.includes('expired')) {
      res.status(401).json({ error: 'Refresh token expired' });
      return;
    }
    res.status(401).json({ error: 'Invalid refresh token' });
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 */
export async function logout(req: Request, res: Response): Promise<void> {
  // In a stateless JWT setup, logout is handled client-side by removing tokens
  // For enhanced security, you could implement a token blacklist here
  res.json({ message: 'Logged out successfully' });
}
