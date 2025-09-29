import express, { Application, Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDefinition from './swaggerDef';
import cors from 'cors';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { setupSecurity, authRateLimit } from './middlewares/security';
import * as path from 'path';
import * as fs from 'fs';
import authRoutes from './routes/auth.routes';
import enquiryRoutes from './routes/enquiry.routes';
import userRoutes from './routes/user.routes';
import { OpenAPIV3 } from 'openapi-types';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
const envPath = path.resolve(process.cwd(), envFile);

// Check if env file exists
if (fs.existsSync(envPath)) {
  console.log(`🌍 Loading environment from ${envFile}`);
  dotenv.config({ path: envPath });
} else {
  console.log(`⚠️ ${envFile} not found, using default .env file`);
  dotenv.config();
}

// Log current environment
console.log(`🚀 Running in ${process.env.NODE_ENV} mode`);

// Create Express application
const app: Application = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

// Basic middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

let swaggerSpec: OpenAPIV3.Document & {
  servers?: Array<{
    url: string;
    description?: string;
  }>;
};
const isProduction =
  process.env.NODE_ENV === 'production' || process.env.DOCKER === 'true';

console.log(
  `🌍 Environment detected: ${isProduction ? 'Production/Docker' : 'Development'}`
);

if (isProduction) {
  // Serve static swagger.json in production/Docker
  const staticSwaggerPath = path.resolve(__dirname, 'swagger.json');
  console.log(`📁 Looking for static Swagger at: ${staticSwaggerPath}`);

  if (fs.existsSync(staticSwaggerPath)) {
    swaggerSpec = JSON.parse(fs.readFileSync(staticSwaggerPath, 'utf-8'));
    console.log('✅ Serving static Swagger spec');
  } else {
    console.warn('❌ Static swagger.json not found, generating dynamically...');

    // Fallback: generate dynamically from compiled JS files
    try {
      const swaggerOptions = {
        definition: swaggerDefinition,
        apis: [
          './dist/routes/*.js',
          './dist/controllers/*.js',
          './dist/controllers/**/*.js',
        ],
      };
      swaggerSpec = swaggerJsdoc(swaggerOptions) as OpenAPIV3.Document;
      console.log(
        `✅ Generated dynamic Swagger with ${Object.keys((swaggerSpec as OpenAPIV3.Document).paths || {}).length} paths`
      );
    } catch (error) {
      console.error('❌ Failed to generate Swagger spec:', error);
      // Create minimal valid Swagger spec as fallback
      swaggerSpec = {
        openapi: '3.0.0',
        info: {
          title: 'CloudBlitz API',
          version: '1.0.0',
        },
        servers: [{ url: '/', description: 'Current Server' }],
        paths: {},
      };
    }
  }
} else {
  // Development: always generate dynamically from TypeScript files
  try {
    const swaggerOptions = {
      definition: swaggerDefinition,
      apis: [
        './src/routes/*.ts',
        './src/controllers/*.ts',
        './src/controllers/**/*.ts',
      ],
    };
    swaggerSpec = swaggerJsdoc(swaggerOptions) as OpenAPIV3.Document;
    console.log(
      `✅ Generated development Swagger with ${Object.keys((swaggerSpec as OpenAPIV3.Document).paths || {}).length} paths`
    );
  } catch (error) {
    console.error('❌ Failed to generate development Swagger spec:', error);
    swaggerSpec = {
      openapi: '3.0.0',
      info: {
        title: 'CloudBlitz API',
        version: '1.0.0',
      },
      servers: [{ url: '/', description: 'Current Server' }],
      paths: {},
    };
  }
}

// Debug: Log Swagger servers configuration
console.log('🔗 Swagger servers configured:');
if (swaggerSpec.servers && Array.isArray(swaggerSpec.servers)) {
  swaggerSpec.servers.forEach(
    (server: OpenAPIV3.ServerObject, index: number) => {
      console.log(
        `  ${index + 1}. ${server.url} (${server.description || 'no description'})`
      );
    }
  );
} else {
  console.log('  No servers configured, adding default...');
  swaggerSpec.servers = [{ url: '/', description: 'Current Server' }];
}

// Add explicit Swagger JSON endpoint for debugging
app.get('/api-docs/json', (req: Request, res: Response) => {
  res.json(swaggerSpec);
});

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[API] ${req.method} ${req.originalUrl}`);
  next();
});

// Apply security middleware conditionally
if (process.env.NODE_ENV !== 'test') {
  setupSecurity(app);
  console.log('🛡️ Full security middleware applied');
} else {
  console.log('🧪 Running with minimal security for testing');
}

// API root endpoint
app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to CloudBlitz Enquiry Management API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      enquiries: '/api/enquiries',
      users: '/api/users',
      swagger: '/api-docs',
      swaggerJson: '/api-docs/json',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'CloudBlitz API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV,
  });
});

// Mount route handlers with rate limiting for auth routes based on environment
if (process.env.NODE_ENV === 'test') {
  // Skip rate limiting in test environment
  app.use('/api/auth', authRoutes);
  app.use('/api/enquiries', enquiryRoutes);
  app.use('/api/users', userRoutes);
} else {
  app.use('/api/auth', authRateLimit, authRoutes);
  app.use('/api/enquiries', authRateLimit, enquiryRoutes);
  app.use('/api/users', authRateLimit, userRoutes);
}

console.log('📚 Swagger docs available at /api-docs');
console.log('📄 Swagger JSON available at /api-docs/json');

// Swagger UI endpoint info
console.log('📚 Swagger docs available at /api-docs');

// 404 handler - removed for now due to Express routing issue

// Global error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    status: 'error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Database connection
const connectDB = async (): Promise<void> => {
  try {
    // Return if already connected
    if (mongoose.connection.readyState !== 0) {
      return;
    }

    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudblitz';
    console.log(`🔗 MongoDB URI: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    // Log connection details based on environment
    if (process.env.NODE_ENV === 'test') {
      console.log(`✅ Test MongoDB connected at: ${mongoUri}`);
    } else {
      console.log('✅ MongoDB connected successfully');
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1); // Only exit in non-test environments
    } else {
      throw error; // In test environment, throw the error to be caught by the test runner
    }
  }
};

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

// Start the server only if this is not a test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
