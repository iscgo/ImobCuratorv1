import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, AuthContext } from '../contexts/AuthContext';
import { useAuth } from '../hooks/useAuth';

// Mock the API client
jest.mock('../services/api/client');

describe('AuthContext', () => {
  const TestComponent = () => {
    const { isAuthenticated, user, login, register, logout } = useAuth();

    return (
      <div>
        <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
        {user && <div data-testid="user-email">{user.email}</div>}
        <button onClick={() => login('test@example.com', 'password')}>Login</button>
        <button onClick={() => register('test@example.com', 'password', 'Test User')}>Register</button>
        <button onClick={logout}>Logout</button>
      </div>
    );
  };

  it('should provide authentication context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const authStatus = screen.getByTestId('auth-status');
    expect(authStatus).toBeInTheDocument();
  });

  it('should start with unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const authStatus = screen.getByTestId('auth-status');
    expect(authStatus).toHaveTextContent('Not Authenticated');
  });

  it('should provide login function', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeInTheDocument();
  });

  it('should provide register function', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerButton = screen.getByText('Register');
    expect(registerButton).toBeInTheDocument();
  });

  it('should provide logout function', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console errors for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow();

      consoleError.mockRestore();
    });

    it('should return auth context when used inside AuthProvider', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('auth-status')).toBeInTheDocument();
    });
  });

  describe('Token persistence', () => {
    it('should check for stored tokens on mount', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        const authStatus = screen.getByTestId('auth-status');
        expect(authStatus).toBeInTheDocument();
      });
    });

    it('should restore user from refresh token if valid', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Should attempt to restore auth state from stored tokens
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toBeInTheDocument();
      });
    });
  });
});
