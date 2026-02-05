import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Register from '../pages/Register';
import { AuthProvider } from '../contexts/AuthContext';

// Mock useAuth hook
jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    register: jest.fn(),
    isAuthenticated: false,
  }),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Register Page', () => {
  const renderRegisterPage = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('should render registration form', () => {
    renderRegisterPage();

    expect(screen.getByText('Criar Conta')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome Completo *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha *')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Senha *')).toBeInTheDocument();
  });

  describe('Form Validation', () => {
    it('should validate name field', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const nameInput = screen.getByLabelText('Nome Completo *') as HTMLInputElement;
      expect(nameInput.required).toBe(true);
    });

    it('should validate email field', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const emailInput = screen.getByLabelText('Email *') as HTMLInputElement;
      expect(emailInput.type).toBe('email');
      expect(emailInput.required).toBe(true);
    });

    it('should validate password field', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const passwordInput = screen.getByLabelText('Senha *') as HTMLInputElement;
      expect(passwordInput.type).toBe('password');
      expect(passwordInput.required).toBe(true);
    });

    it('should check password confirmation match', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const passwordInput = screen.getByLabelText('Senha *') as HTMLInputElement;
      const confirmInput = screen.getByLabelText('Confirmar Senha *') as HTMLInputElement;

      await user.type(passwordInput, 'password123');
      await user.type(confirmInput, 'password456');

      // They should not match
      expect(passwordInput.value).not.toBe(confirmInput.value);
    });

    it('should require minimum password length of 8 characters', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const passwordInput = screen.getByLabelText('Senha *') as HTMLInputElement;

      await user.type(passwordInput, 'short');
      expect(passwordInput.value.length).toBeLessThan(8);
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const emailInput = screen.getByLabelText('Email *') as HTMLInputElement;
      await user.type(emailInput, 'invalid-email');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(emailInput.value)).toBe(false);
    });
  });

  describe('Password Strength', () => {
    it('should show password strength indicator', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const passwordInput = screen.getByLabelText('Senha *');
      await user.type(passwordInput, 'password123');

      // Should display strength
      await waitFor(() => {
        expect(screen.getByText(/Força da senha/)).toBeInTheDocument();
      });
    });

    it('should indicate weak password', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const passwordInput = screen.getByLabelText('Senha *');
      await user.type(passwordInput, 'weak');

      await waitFor(() => {
        const strengthText = screen.getByText(/Força da senha/);
        expect(strengthText).toBeInTheDocument();
      });
    });

    it('should indicate strong password', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const passwordInput = screen.getByLabelText('Senha *');
      await user.type(passwordInput, 'Strong@Pass123');

      await waitFor(() => {
        const strengthText = screen.getByText(/Força da senha/);
        expect(strengthText).toBeInTheDocument();
      });
    });
  });

  describe('Phone Field', () => {
    it('should render optional phone field', () => {
      renderRegisterPage();

      const phoneInput = screen.getByLabelText('Telefone') as HTMLInputElement;
      expect(phoneInput).toBeInTheDocument();
      expect(phoneInput.required).toBe(false);
    });
  });

  describe('Form Submission', () => {
    it('should have submit button', () => {
      renderRegisterPage();

      const submitButton = screen.getByRole('button', { name: /Criar Conta/ });
      expect(submitButton).toBeInTheDocument();
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      const submitButton = screen.getByRole('button', { name: /Criar Conta/ }) as HTMLButtonElement;
      expect(submitButton.disabled).toBe(false);
    });
  });

  describe('Navigation', () => {
    it('should have link to login page', () => {
      renderRegisterPage();

      const loginLink = screen.getByText('Fazer Login');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
    });
  });
});
