import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { Application } from 'express';

// Rate limiting configurations
export const createRateLimiter = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 'error',
      message: message || 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limiting
export const generalRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again in 15 minutes.'
);

// Strict rate limiting for auth endpoints
export const authRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 auth requests per windowMs
  'Too many authentication attempts from this IP, please try again in 15 minutes.'
);

// Security middleware setup
export const setupSecurity = (app: Application): void => {
  // Helmet for security headers
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  // Sanitize user input from malicious HTML
  app.use(mongoSanitize({
    replaceWith: '_',
  }));

  // Apply general rate limiting to all requests
  app.use('/api/', generalRateLimit);
  
  console.log('🛡️  Security middleware configured');
};