const apiResponse = require('../utils/apiResponse');
const env  = require('../config/appConfig');
const rateLimit = require('express-rate-limit');

const isDev = env.NODE_ENV === 'development';

const noopMiddleware = (_req, _res, next) => next();

const globalLimiter = isDev ? noopMiddleware : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`Global rate limit exceeded for IP: ${req.ip}`);
    return apiResponse.error(res, 'Too many requests from this IP, please try again later', null, 429);
  }
});

const authLimiter = isDev ? noopMiddleware : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    console.log(`Auth rate limit exceeded for IP: ${req.ip}`);
    return apiResponse.error(res, 'Too many authentication attempts, please try again later', null, 429);
  }
});

const resetLimiter = isDev ? noopMiddleware : rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    console.log(`Password reset rate limit exceeded for IP: ${req.ip}`);
    return apiResponse.error(res, 'Too many password reset attempts, please try again later', null, 429);
  }
});

const getCorsOptions = (allowedOrigins) => ({
  origin: isDev
    ? true
    : function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        console.log(`CORS blocked request from origin: ${origin}`);
        const error = new Error('Not allowed by CORS');
        error.name = 'CORS_ERROR';
        return callback(error);
      },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600
});

module.exports = { globalLimiter, authLimiter, resetLimiter, getCorsOptions };
