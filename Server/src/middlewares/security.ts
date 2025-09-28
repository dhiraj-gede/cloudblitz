import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { Application, Request, Response, NextFunction } from 'express';

// Rate limiting configurations
export const createRateLimiter = (
  windowMs: number,
  max: number,
  message?: string
) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 'error',
      message:
        message || 'Too many requests from this IP, please try again later.',
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
  500, // limit each IP to 50 auth requests per windowMs
  'Too many authentication attempts from this IP, please try again in 15 minutes.'
);

// Security middleware setup
export const setupSecurity = (app: Application): void => {
  // Helmet for security headers
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    })
  );

  // Sanitize user input from malicious HTML
  app.use((req: Request, res: Response, next: NextFunction) => {
    const sanitizedData = mongoSanitize.sanitize(
      { query: req.query, body: req.body, params: req.params },
      { replaceWith: '_', dryRun: true }
    );
    req.sanitizedQuery = sanitizedData.query;
    req.sanitizedBody = sanitizedData.body;
    req.sanitizedParams = sanitizedData.params;
    next();
  });

  // Apply general rate limiting to all requests
  app.use('/api/', generalRateLimit);

  console.log('🛡️  Security middleware configured');
};
