import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import seedData from './database/seed.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app'] // Replace with your actual frontend URL
    : ['http://localhost:3000', 'http://127.0.0.1:3000'], // Local development
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const method = req.method;
  const url = req.url;
  
  // Log request
  console.log(`📨 ${method} ${url} - ${new Date().toISOString()}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusIcon = status >= 400 ? '❌' : status >= 300 ? '⚠️' : '✅';
    
    console.log(`${statusIcon} ${method} ${url} ${status} - ${duration}ms`);
  });
  
  next();
});

// Health check route (before API routes)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HeyFood Clone API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      restaurants: '/api/restaurants',
      tags: '/api/tags',
      health: '/api/health'
    }
  });
});

// API routes
app.use('/api', apiRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /api/restaurants',
      'GET /api/restaurants/:id',
      'GET /api/tags',
      'GET /api/tags/:id',
      'GET /api/health',
      'POST /api/restaurants',
      'POST /api/tags'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err);
  
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🚀 Starting HeyFood Clone API...');
    
    // Initialize database with seed data
    console.log('📊 Initializing database...');
    await seedData();
    
    // Start server
    const PORT = process.env.PORT || 5000;
    const HOST = '0.0.0.0'; // Important for deployment
    
    app.listen(PORT, HOST, () => {
      console.log(`✅ Server running on http://${HOST}:${PORT}`);
      console.log(`📚 API Documentation available at http://${HOST}:${PORT}`);
      console.log(`🏥 Health check: http://${HOST}:${PORT}/api/health`);
      console.log(`🍴 Restaurants: http://${HOST}:${PORT}/api/restaurants`);
      console.log(`🏷️  Tags: http://${HOST}:${PORT}/api/tags`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();