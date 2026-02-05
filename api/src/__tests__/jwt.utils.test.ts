import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt.utils';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JWT Utils', () => {
  const mockPayload = {
    userId: '123',
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate an access token with correct payload', () => {
      const mockToken = 'mock_access_token';
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const token = generateAccessToken(mockPayload);

      expect(jwt.sign).toHaveBeenCalled();
      expect(token).toBe(mockToken);
    });

    it('should set token expiration to 15 minutes', () => {
      (jwt.sign as jest.Mock).mockReturnValue('token');

      generateAccessToken(mockPayload);

      const callArgs = (jwt.sign as jest.Mock).mock.calls[0];
      expect(callArgs[2]).toHaveProperty('expiresIn', '15m');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token with correct payload', () => {
      const mockToken = 'mock_refresh_token';
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const token = generateRefreshToken(mockPayload);

      expect(jwt.sign).toHaveBeenCalled();
      expect(token).toBe(mockToken);
    });

    it('should set token expiration to 7 days', () => {
      (jwt.sign as jest.Mock).mockReturnValue('token');

      generateRefreshToken(mockPayload);

      const callArgs = (jwt.sign as jest.Mock).mock.calls[0];
      expect(callArgs[2]).toHaveProperty('expiresIn', '7d');
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and decode a valid access token', () => {
      const mockDecoded = { userId: '123', email: 'test@example.com' };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const result = verifyAccessToken('valid_token');

      expect(jwt.verify).toHaveBeenCalled();
      expect(result).toEqual(mockDecoded);
    });

    it('should throw on invalid token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => verifyAccessToken('invalid_token')).toThrow('Invalid token');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and decode a valid refresh token', () => {
      const mockDecoded = { userId: '123', email: 'test@example.com' };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const result = verifyRefreshToken('valid_token');

      expect(jwt.verify).toHaveBeenCalled();
      expect(result).toEqual(mockDecoded);
    });

    it('should throw on expired token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token expired');
      });

      expect(() => verifyRefreshToken('expired_token')).toThrow('Token expired');
    });
  });
});
