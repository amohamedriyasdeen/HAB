// app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const routes = require('./routes/index');
const errorHandler = require('./middleware/error.middleware');
const connectDB = require('./config/db');
const env = require('./config/appConfig');
const passport = require('./config/passport');
const { globalLimiter, authLimiter, getCorsOptions } = require('./config/security');
const apiResponse = require('./utils/apiResponse');

const app = express();

// Connect DB with error handling
connectDB().catch(err => {
  console.log('Database connection failed:', err);
  process.exit(1);
});

// CORS configuration for development
const allowedOrigins = env.FRONTEND_URL ?? [];
app.use(cors(getCorsOptions(allowedOrigins)));

// Body parser with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(passport.initialize());

// Serve static files
app.use('/uploads', express.static('public/uploads'));

// JSON parsing error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return apiResponse.error(res, 'Invalid JSON format in request body', [err.message], 400);
  }
  next(err);
});

// Apply global rate limiter
app.use(globalLimiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// API Routes with auth rate limiter
app.use('/api/auth', authLimiter);
app.use('/api', routes);

// Handle 404 for API routes
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.name = 'ROUTE_NOT_FOUND';
  error.statusCode = 404;
  next(error);
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;