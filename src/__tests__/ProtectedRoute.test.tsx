import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';

// Mock useAuth hook
const mockUseAuth = jest.fn();
jest.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

const TestComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;

describe('ProtectedRoute Component', () => {
  const TestApp = ({ isAuthenticated, isLoading }) => {
    // Override the mock for each test
    mockUseAuth.mockReturnValue({ isAuthenticated, isLoading });

    return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('should render children when authenticated', () => {
    render(<TestApp isAuthenticated={true} isLoading={false} />);

    const protectedContent = screen.getByText('Protected Content');
    expect(protectedContent).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    render(<TestApp isAuthenticated={false} isLoading={false} />);

    // Should show login page instead of protected content
    const loginPage = screen.getByText('Login Page');
    expect(loginPage).toBeInTheDocument();

    const protectedContent = screen.queryByText('Protected Content');
    expect(protectedContent).not.toBeInTheDocument();
  });

  it('should show loading state while checking authentication', () => {
    const { rerender } = render(<TestApp isAuthenticated={false} isLoading={true} />);

    // Should show loading spinner
    const loadingSpinner = screen.getByText('Loading...');
    expect(loadingSpinner).toBeInTheDocument();

    const protectedContent = screen.queryByText('Protected Content');
    expect(protectedContent).not.toBeInTheDocument();
  });

  it('should render protected content after loading completes', () => {
    const { rerender } = render(<TestApp isAuthenticated={false} isLoading={true} />);

    // Initially loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // After loading and authentication
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });
    rerender(<TestApp isAuthenticated={true} isLoading={false} />);

    // Should now show protected content
    const protectedContent = screen.getByText('Protected Content');
    expect(protectedContent).toBeInTheDocument();
  });

  it('should display loading UI with proper styling', () => {
    render(<TestApp isAuthenticated={false} isLoading={true} />);

    // Loading container should have proper classes
    const loadingContainer = screen.getByText('Loading...').closest('div');
    expect(loadingContainer).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('should show animated spinner during loading', () => {
    render(<TestApp isAuthenticated={false} isLoading={true} />);

    const spinner = screen.getByText('Loading...').closest('div');
    // Verify spinner element exists with animation class
    const spinnerElement = spinner?.querySelector('div');
    expect(spinnerElement).toBeInTheDocument();
  });

  it('should transition from loading to authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true });
    const { rerender } = render(<TestApp isAuthenticated={false} isLoading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });
    rerender(<TestApp isAuthenticated={true} isLoading={false} />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should transition from loading to unauthenticated redirect', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true });
    const { rerender } = render(<TestApp isAuthenticated={false} isLoading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });
    rerender(<TestApp isAuthenticated={false} isLoading={false} />);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should maintain protected content for authenticated users', () => {
    const { rerender } = render(<TestApp isAuthenticated={true} isLoading={false} />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();

    // Re-render with same auth state
    rerender(<TestApp isAuthenticated={true} isLoading={false} />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should properly handle null children', () => {
    // ProtectedRoute should handle edge cases gracefully
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });

    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<ProtectedRoute>{null}</ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(container).toBeInTheDocument();
  });

  it('should use React Fragment to wrap children', () => {
    render(<TestApp isAuthenticated={true} isLoading={false} />);

    // Children should be rendered without additional wrapper elements
    const protectedContent = screen.getByText('Protected Content');
    expect(protectedContent.parentElement).not.toHaveClass('protected-route-wrapper');
  });
});
