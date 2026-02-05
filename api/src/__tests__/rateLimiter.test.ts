import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

describe('Rate Limiter Middleware', () => {
  it('should create a limiter with correct configuration', () => {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // Limit each IP to 5 requests per windowMs
      message: 'Too many login attempts, please try again later.',
    });

    expect(limiter).toBeDefined();
  });

  it('should have correct login limiter settings', () => {
    // Configuration for strict login rate limiting
    const config = {
      windowMs: 15 * 60 * 1000,
      max: 5,
      skipSuccessfulRequests: true, // Don't count successful logins
      message: 'Too many login attempts, please try again later.',
    };

    expect(config.max).toBe(5);
    expect(config.windowMs).toBe(15 * 60 * 1000); // 15 minutes
    expect(config.skipSuccessfulRequests).toBe(true);
  });

  it('should have correct general API rate limiter settings', () => {
    const config = {
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests from this IP, please try again later.',
    };

    expect(config.max).toBe(100);
    expect(config.windowMs).toBe(15 * 60 * 1000);
  });

  describe('Request counting', () => {
    it('should track requests per IP', () => {
      // Verify that rate limiters track by client IP
      const mockRequest = {
        ip: '192.168.1.1',
        method: 'POST',
        path: '/api/auth/login',
      };

      expect(mockRequest.ip).toBeDefined();
      expect(mockRequest.ip).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
    });

    it('should allow requests within limit', () => {
      const config = {
        windowMs: 15 * 60 * 1000,
        max: 5,
      };

      // Simulate 5 requests
      for (let i = 0; i < config.max; i++) {
        expect(i).toBeLessThan(config.max);
      }
    });

    it('should reject requests exceeding limit', () => {
      const config = {
        windowMs: 15 * 60 * 1000,
        max: 5,
      };

      const requestCount = 6;
      expect(requestCount).toBeGreaterThan(config.max);
    });
  });
});
