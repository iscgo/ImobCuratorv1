// Main API Server Entry Point

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import { apiRateLimiter } from './middleware/rateLimiter.middleware.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS Configuration - Allow multiple origins in development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://192.168.1.111:3000',
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, Postman, or file://)
    if (!origin || NODE_ENV === 'development') {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply global rate limiter
app.use('/api', apiRateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ImobCurator API running on port ${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
  if (NODE_ENV === 'development') {
    console.log(`🌐 CORS: All origins allowed (development mode)`);
  } else {
    console.log(`🌐 CORS: Restricted to: ${allowedOrigins.join(', ')}`);
  }
});

export default app;
