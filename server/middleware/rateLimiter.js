const rateLimit = require('express-rate-limit');
const isDevelopment = process.env.NODE_ENV !== 'production';

// General rate limiter: 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: isDevelopment ? 60 * 1000 : 15 * 60 * 1000,
  max: isDevelopment ? 1000 : 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for OpenAI API calls: 30 requests per hour
const openaiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: 'Too many interview analysis requests, please try again later.',
  skipSuccessfulRequests: false,
});

// Auth endpoints limiter: 5 attempts per 15 minutes
const authLimiter = rateLimit({
  // Keep strict limits in production, but allow faster local testing.
  windowMs: isDevelopment ? 60 * 1000 : 15 * 60 * 1000,
  max: isDevelopment ? 100 : 5,
  message: 'Too many login attempts from this IP, please try again later.',
  skipSuccessfulRequests: true, // Only count failed attempts
});

module.exports = { generalLimiter, openaiLimiter, authLimiter };
