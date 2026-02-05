# Testing Instructions - Story 1.1: User Registration & Login

## Overview

This document covers all test implementations for Tasks 13-15 of Story 1.1. The project uses:
- **Backend:** Jest with ts-jest
- **Frontend:** Vitest with React Testing Library

## Test Files Created

### Backend Tests (api/src/__tests__/)

1. **auth.controller.test.ts** - Task 13
   - Tests for register, login, refresh, logout controllers
   - Validates input validation and JWT generation
   - Tests password hashing and bcrypt integration

2. **jwt.utils.test.ts** - Task 13
   - Tests for generateAccessToken and generateRefreshToken
   - Token verification functions
   - Expiration time validation (15m access, 7d refresh)

3. **rateLimiter.test.ts** - Task 13
   - Rate limiter configuration tests
   - Login attempt limits (5 per 15 minutes)
   - General API rate limiting (100 per 15 minutes)

### Frontend Tests (src/__tests__/)

1. **AuthContext.test.tsx** - Task 14
   - Tests for AuthProvider and useAuth hook
   - Authentication state management
   - Login, register, logout functions
   - Token persistence and restoration

2. **api.client.test.ts** - Task 14
   - Tests for Axios configuration
   - Request interceptor (Authorization header)
   - Response interceptor (401 handling, token refresh)
   - Token management in memory

3. **Register.test.tsx** - Task 14
   - Tests for Register page component
   - Form validation (email, password, confirmation)
   - Password strength indicator
   - Form submission and error handling

4. **LoginSimple.test.tsx** - Task 14
   - Tests for LoginSimple page component
   - Email and password input validation
   - Form submission
   - Navigation to register and forgot password

5. **ProtectedRoute.test.tsx** - Task 14
   - Tests for ProtectedRoute component
   - Authentication check and redirect
   - Loading state display
   - Content access control

6. **integration.test.tsx** - Task 15
   - End-to-end authentication flow tests
   - Registration flow validation
   - Login flow validation
   - Token refresh on 401
   - Rate limiting verification
   - Form validation across components
   - Protected route access control

## Running Tests

### Frontend Tests

```bash
# Install dependencies (if not already installed)
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Backend Tests

```bash
# Navigate to backend directory
cd api

# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# With coverage (if configured)
npm test -- --coverage
```

## Test Coverage

### Backend Coverage

- **Auth Controller:** Register, Login, Refresh Token, Logout
- **JWT Utilities:** Token generation, verification, expiration times
- **Rate Limiting:** Login limits, general API limits
- **Validation:** Email format, password requirements, input validation
- **Password Hashing:** Bcrypt integration, hash verification

### Frontend Coverage

- **Authentication Context:** State management, token storage, user info
- **API Client:** Request/response interceptors, token management, error handling
- **Register Page:** Form validation, password strength, submission
- **Login Page:** Email/password validation, error display, navigation
- **Protected Routes:** Auth check, loading state, redirect logic
- **Integration:** Full auth flows, token refresh, form interactions

## Test Configuration

### Frontend (vitest.config.ts)

```typescript
- Environment: jsdom (browser simulation)
- Setup file: src/__tests__/setup.ts
- Coverage provider: v8
- Test files: src/**/__tests__/**/*.test.{ts,tsx}
```

### Backend (jest.config.js)

```javascript
- Preset: ts-jest (TypeScript support)
- Environment: node
- Setup file: src/__tests__/setup.ts
- Test files: src/**/__tests__/**/*.test.ts
```

## Running Specific Tests

```bash
# Frontend - specific test file
npm test RegisterPage

# Frontend - specific test suite
npm test -- --reporter=verbose

# Backend - specific test file
cd api && npm test auth.controller

# Backend - specific test
cd api && npm test -- -t "should register a new user"
```

## Continuous Integration

To run tests in CI/CD pipelines:

```bash
# Frontend
npm run test -- --reporter=junit --reporter=default

# Backend
cd api && npm test -- --coverage --reporters=default --reporters=junit
```

## Troubleshooting

### Frontend Tests

**Issue:** Tests fail with "Cannot find module"
- **Solution:** Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Issue:** jsdom environment errors
- **Solution:** Ensure jsdom is installed: `npm install --save-dev jsdom`

**Issue:** React Testing Library not finding elements
- **Solution:** Verify render wrapper includes providers (AuthProvider, BrowserRouter, etc.)

### Backend Tests

**Issue:** Database connection errors in tests
- **Solution:** Tests use mocked Prisma, but ensure DATABASE_URL is set in .env

**Issue:** Module resolution errors
- **Solution:** Ensure tsconfig.json paths are correct for ts-jest

**Issue:** JWT secret not found
- **Solution:** Verify setup.ts defines mock environment variables

## Test Best Practices

### Adding New Tests

1. Follow existing test structure and naming conventions
2. Mock external dependencies (API calls, database operations)
3. Test both happy path and error scenarios
4. Use descriptive test names that explain what is tested
5. Keep tests isolated and independent
6. Clean up after tests (e.g., clear mocks, DOM cleanup)

### Test Examples

**Unit Test:**
```typescript
describe('jwt.utils', () => {
  it('should generate access token with 15m expiration', () => {
    const token = generateAccessToken({ userId: '123' });
    expect(token).toBeDefined();
  });
});
```

**Integration Test:**
```typescript
it('should complete registration and login flow', async () => {
  const user = userEvent.setup();
  render(<TestApp />);

  // Register
  await user.type(emailInput, 'test@example.com');
  await user.click(registerButton);

  // Login
  await user.type(emailInput, 'test@example.com');
  await user.click(loginButton);

  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

## Next Steps

1. **Install test dependencies:**
   ```bash
   npm install
   cd api && npm install
   ```

2. **Run tests to verify setup:**
   ```bash
   npm test
   cd api && npm test
   ```

3. **Generate coverage reports:**
   ```bash
   npm run test:coverage
   cd api && npm test -- --coverage
   ```

4. **Fix database configuration** (for integration tests):
   - See BACKEND_SETUP_INSTRUCTIONS.md
   - Configure PostgreSQL (Supabase, Docker, or local)
   - Run migrations

5. **Manual testing:**
   - Start backend: `cd api && npm run dev`
   - Start frontend: `npm run dev`
   - Test registration and login flows

## CI/CD Integration

Add to your CI/CD pipeline (.github/workflows/test.yml):

```yaml
- name: Run Frontend Tests
  run: npm test -- --coverage

- name: Run Backend Tests
  run: cd api && npm test -- --coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

---

**Story:** 1.1: User Registration & Login
**Tasks:** 13 (Backend Tests), 14 (Frontend Tests), 15 (Integration Tests)
**Status:** ✅ All Tests Implemented
