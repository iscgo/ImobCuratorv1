// Authentication Service

import apiClient, { setTokens, clearTokens } from './client';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  agency?: string;
  licenseNumber?: string;
  avatarUrl?: string;
  language: string;
  timezone: string;
  currency: string;
  theme: string;
  createdAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<{ message: string; user: User }> {
  try {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || 'Registration failed';
    throw new Error(message);
  }
}

/**
 * Login user
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    const { accessToken, refreshToken, user } = response.data;

    // Store tokens in memory
    setTokens(accessToken, refreshToken);

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || 'Login failed';
    throw new Error(message);
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Even if API call fails, clear tokens locally
    console.error('Logout error:', error);
  } finally {
    clearTokens();
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(token: string): Promise<string> {
  try {
    const response = await apiClient.post('/auth/refresh', {
      refreshToken: token,
    });
    return response.data.accessToken;
  } catch (error: any) {
    const message = error.response?.data?.error || 'Token refresh failed';
    throw new Error(message);
  }
}
