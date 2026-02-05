# Backend Setup Instructions - Story 1.1

## ✅ What's Been Completed

### Backend (100% Code Complete)
- ✅ Complete backend API structure created in `/api`
- ✅ Prisma schema with users table
- ✅ Authentication routes (register, login, refresh, logout)
- ✅ JWT utilities (access & refresh tokens)
- ✅ Validation middleware with Zod
- ✅ Rate limiting middleware
- ✅ Auth middleware for protected routes
- ✅ Authentication controller with bcrypt
- ✅ TypeScript configuration
- ✅ All dependencies installed

### Frontend (100% Code Complete)
- ✅ Axios API client with interceptors
- ✅ Authentication service
- ✅ AuthContext & useAuth hook
- ✅ Register page with validation
- ✅ LoginSimple page with real API
- ✅ ProtectedRoute component
- ✅ Token refresh logic
- ✅ Axios dependency installed

## ⚠️ What Needs Configuration

### 1. Database Setup (REQUIRED)

You need to set up PostgreSQL. Choose ONE option:

#### Option A: Supabase (Easiest - Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create/access your project
3. Get connection string from Project Settings > Database
4. Update `api/.env`:
   ```
   DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@[REGION].pooler.supabase.com:5432/postgres"
   ```
5. Run migration:
   ```bash
   cd api
   npx prisma migrate dev --name init
   ```

#### Option B: Local PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb imobcurator

# api/.env is already configured for localhost
# Run migration
cd api
npx prisma migrate dev --name init
```

#### Option C: Docker
```bash
docker run -d \
  --name imobcurator-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=imobcurator \
  -p 5432:5432 \
  postgres:15

# Then run migration
cd api
npx prisma migrate dev --name init
```

### 2. Update JWT Secrets (Production)
Edit `api/.env` and change:
```
JWT_SECRET="your-production-secret-min-32-chars"
JWT_REFRESH_SECRET="your-production-refresh-secret-min-32-chars"
```

### 3. Update App.tsx (REQUIRED)

Wrap your app with AuthProvider and configure routes:

```tsx
// src/App.tsx
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginSimple from './pages/LoginSimple';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginSimple />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* ... other protected routes ... */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

## 🚀 How to Run

### Terminal 1 - Backend
```bash
cd api
npm run dev
```
Backend runs on: http://localhost:3001

### Terminal 2 - Frontend
```bash
npm run dev
```
Frontend runs on: http://localhost:5173

## 🧪 Testing

### Manual Testing
1. Start both servers
2. Navigate to http://localhost:5173/register
3. Create an account
4. Login at http://localhost:5173/login
5. Access protected routes (dashboard)

### Automated Tests (TODO - Tasks 13-15)
Unit tests and integration tests still need to be written.

## 📝 API Endpoints

```
POST /api/auth/register - Create account
POST /api/auth/login    - Login
POST /api/auth/refresh  - Refresh token
POST /api/auth/logout   - Logout
```

## 🔍 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in api/.env
- Test connection: `cd api && npx prisma studio`

### CORS Errors
- Ensure CORS_ORIGIN in api/.env matches frontend URL
- Default: http://localhost:5173

### Token Errors
- Clear browser cache/localStorage
- Check JWT secrets are set
- Verify token expiration times

## ✅ Implementation Status

### Completed (Tasks 1-12 + App.tsx Update)
- ✅ Backend API structure with Express
- ✅ Prisma schema and database configuration
- ✅ Authentication routes (register, login, refresh, logout)
- ✅ JWT utilities and token management
- ✅ Validation middleware with Zod
- ✅ Rate limiting middleware
- ✅ Auth middleware for protected routes
- ✅ Authentication controller with bcrypt
- ✅ Frontend Axios client with interceptors
- ✅ Authentication service layer
- ✅ AuthContext & useAuth hook
- ✅ Register page with validation
- ✅ LoginSimple page with real API
- ✅ ProtectedRoute component
- ✅ App.tsx updated with AuthProvider and route protection

### Completed (Tasks 13-15 - Testing)
- ✅ Backend Unit Tests (auth.controller, jwt.utils, rate limiting)
- ✅ Frontend Unit Tests (AuthContext, API client, components)
- ✅ Integration Tests (E2E auth flows)
- ✅ Jest configuration with ts-jest
- ✅ Vitest configuration with React Testing Library
- ✅ Test setup files and mocks

## 🧪 Running Tests

### Frontend Tests
```bash
npm install                # Install dependencies
npm test                  # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Backend Tests
```bash
cd api
npm install              # Install dependencies (if needed)
npm test                 # Run all tests
npm run test:watch      # Watch mode
```

See `TESTING_INSTRUCTIONS.md` for detailed testing guide.

## ✨ Next Steps

1. **Setup database** (choose option below - REQUIRED before running)
2. **Run migrations**
3. **Run tests** to verify everything works
4. **Manual testing** of registration and login flows

### Database Setup (Choose ONE)

#### Option A: Supabase (Easiest - Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create/access your project
3. Get connection string from Project Settings > Database
4. Update `api/.env` with DATABASE_URL
5. Run: `cd api && npx prisma migrate dev --name init`

#### Option B: Local PostgreSQL
```bash
brew install postgresql@15
brew services start postgresql@15
createdb imobcurator
cd api && npx prisma migrate dev --name init
```

#### Option C: Docker
```bash
docker run -d --name imobcurator-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=imobcurator \
  -p 5432:5432 postgres:15

cd api && npx prisma migrate dev --name init
```
