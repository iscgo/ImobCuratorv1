// Authentication Context

import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/api/auth';
import { getRefreshToken } from '../services/api/client';
import type { User } from '../services/api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize auth state on app load
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          // If refresh token exists, try to refresh access token
          // This will automatically set the new access token in the client
          await authService.refreshToken(refreshToken);
          // Note: In a real app, you'd need to fetch user profile here
          // For now, we'll set isLoading to false and wait for actual login
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login handler
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register handler
   */
  const register = useCallback(
    async (email: string, password: string, name: string, phone?: string) => {
      setIsLoading(true);
      try {
        const response = await authService.register({ email, password, name, phone });
        // After registration, user needs to login
        // Or we could auto-login here
        await login(email, password);
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    [login]
  );

  /**
   * Logout handler
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear user anyway
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
