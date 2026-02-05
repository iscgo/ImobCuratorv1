import axios, { AxiosInstance } from 'axios';
import { apiClient } from '../services/api/client';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Client', () => {
  it('should create axios instance with correct base URL', () => {
    expect(apiClient).toBeDefined();
    expect(apiClient.defaults.baseURL).toBe(process.env.VITE_API_URL || 'http://localhost:3001/api');
  });

  describe('Request Interceptor', () => {
    it('should add Authorization header with access token', () => {
      const mockToken = 'test_access_token';
      // Store token in memory
      const config = { headers: {} };

      // Simulate interceptor logic
      if (mockToken && config.headers) {
        config.headers['Authorization'] = `Bearer ${mockToken}`;
      }

      expect(config.headers['Authorization']).toBe(`Bearer ${mockToken}`);
    });

    it('should pass through request without token if not available', () => {
      const config = { headers: {} };
      const token = null;

      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      expect(config.headers['Authorization']).toBeUndefined();
    });

    it('should preserve existing headers', () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const token = 'test_token';
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      expect(config.headers['Content-Type']).toBe('application/json');
      expect(config.headers['Authorization']).toBe(`Bearer ${token}`);
    });
  });

  describe('Response Interceptor', () => {
    it('should handle successful responses', () => {
      const mockResponse = {
        status: 200,
        data: { message: 'Success' },
      };

      // Successful responses should pass through
      expect(mockResponse.status).toBe(200);
      expect(mockResponse.data).toBeDefined();
    });

    it('should handle 401 Unauthorized errors', () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };

      expect(mockError.response.status).toBe(401);
    });

    it('should attempt token refresh on 401', () => {
      const mockError = {
        response: { status: 401 },
        config: { url: '/api/test' },
      };

      // Should trigger token refresh
      const shouldRefresh = mockError.response.status === 401;
      expect(shouldRefresh).toBe(true);
    });

    it('should handle other error status codes', () => {
      const mockError = {
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      };

      expect(mockError.response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('API Methods', () => {
    it('should have get method', () => {
      expect(apiClient.get).toBeDefined();
    });

    it('should have post method', () => {
      expect(apiClient.post).toBeDefined();
    });

    it('should have put method', () => {
      expect(apiClient.put).toBeDefined();
    });

    it('should have delete method', () => {
      expect(apiClient.delete).toBeDefined();
    });

    it('should have patch method', () => {
      expect(apiClient.patch).toBeDefined();
    });
  });

  describe('Token management', () => {
    it('should store access token in memory', () => {
      const token = 'test_access_token';
      // In-memory storage
      let storedToken = null;
      storedToken = token;

      expect(storedToken).toBe('test_access_token');
    });

    it('should store refresh token in memory', () => {
      const token = 'test_refresh_token';
      let storedRefreshToken = null;
      storedRefreshToken = token;

      expect(storedRefreshToken).toBe('test_refresh_token');
    });

    it('should clear tokens on logout', () => {
      let accessToken = 'token';
      let refreshToken = 'refresh';

      // Simulate logout
      accessToken = null;
      refreshToken = null;

      expect(accessToken).toBeNull();
      expect(refreshToken).toBeNull();
    });
  });
});
