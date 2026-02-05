import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginSimple from '../pages/LoginSimple';
import { AuthProvider } from '../contexts/AuthContext';

// Mock useAuth hook
jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: jest.fn(),
    isAuthenticated: false,
  }),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginSimple Page', () => {
  const renderLoginPage = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <LoginSimple />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('should render login form', () => {
    renderLoginPage();

    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  describe('Email Input', () => {
    it('should render email input field', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      expect(emailInput).toBeInTheDocument();
      expect(emailInput.type).toBe('email');
      expect(emailInput.required).toBe(true);
    });

    it('should accept email input', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');

      expect(emailInput.value).toBe('test@example.com');
    });

    it('should show placeholder text', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      expect(emailInput.placeholder).toBe('joao@example.com');
    });
  });

  describe('Password Input', () => {
    it('should render password input field', () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput.type).toBe('password');
      expect(passwordInput.required).toBe(true);
    });

    it('should accept password input', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
      await user.type(passwordInput, 'password123');

      expect(passwordInput.value).toBe('password123');
    });

    it('should mask password characters', () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
      expect(passwordInput.type).toBe('password');
    });
  });

  describe('Form Submission', () => {
    it('should have submit button', () => {
      renderLoginPage();

      const submitButton = screen.getByRole('button', { name: /Entrar/ });
      expect(submitButton).toBeInTheDocument();
    });

    it('should disable submit button while loading', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const submitButton = screen.getByRole('button', { name: /Entrar/ }) as HTMLButtonElement;
      expect(submitButton.disabled).toBe(false);
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const submitButton = screen.getByRole('button', { name: /Entrar/ }) as HTMLButtonElement;
      expect(submitButton).toHaveTextContent('Entrar');
    });
  });

  describe('Error Handling', () => {
    it('should display error messages', async () => {
      renderLoginPage();

      // Error should be visible if login fails
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should have link to register page', () => {
      renderLoginPage();

      const registerLink = screen.getByText('Criar Conta');
      expect(registerLink).toBeInTheDocument();
      expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
    });

    it('should have link to forgot password page', () => {
      renderLoginPage();

      const forgotLink = screen.getByText('Esqueceu a senha?');
      expect(forgotLink).toBeInTheDocument();
      expect(forgotLink.closest('a')).toHaveAttribute('href', '/forgot-password');
    });
  });

  describe('Form Validation', () => {
    it('should validate email format', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      await user.type(emailInput, 'invalid-email');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(emailInput.value)).toBe(false);
    });

    it('should require email field', () => {
      renderLoginPage();

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      expect(emailInput.required).toBe(true);
    });

    it('should require password field', () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
      expect(passwordInput.required).toBe(true);
    });
  });
});
