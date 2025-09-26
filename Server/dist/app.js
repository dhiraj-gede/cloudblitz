"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const security_1 = require("./middlewares/security");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const enquiry_routes_1 = __importDefault(require("./routes/enquiry.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
const envPath = path.resolve(process.cwd(), envFile);
// Check if env file exists
if (fs.existsSync(envPath)) {
    console.log(`🌍 Loading environment from ${envFile}`);
    dotenv.config({ path: envPath });
}
else {
    console.log(`⚠️ ${envFile} not found, using default .env file`);
    dotenv.config();
}
// Log current environment
console.log(`🚀 Running in ${process.env.NODE_ENV} mode`);
// Create Express application
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};
// Basic middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Apply security middleware conditionally
if (process.env.NODE_ENV !== 'test') {
    (0, security_1.setupSecurity)(app);
    console.log('🛡️ Full security middleware applied');
}
else {
    console.log('🧪 Running with minimal security for testing');
}
// Import routes
// API root endpoint
app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'Welcome to CloudBlitz Enquiry Management API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            enquiries: '/api/enquiries',
            users: '/api/users',
        },
    });
});
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'CloudBlitz API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});
// Mount route handlers with rate limiting for auth routes based on environment
if (process.env.NODE_ENV === 'test') {
    // Skip rate limiting in test environment
    app.use('/api/auth', auth_routes_1.default);
    app.use('/api/enquiries', enquiry_routes_1.default);
    app.use('/api/users', user_routes_1.default);
}
else {
    app.use('/api/auth', security_1.authRateLimit, auth_routes_1.default);
    app.use('/api/enquiries', security_1.authRateLimit, enquiry_routes_1.default);
    app.use('/api/users', security_1.authRateLimit, user_routes_1.default);
}
// 404 handler - removed for now due to Express routing issue
// Global error handler
app.use((err, req, res, _next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
});
// Database connection
const connectDB = async () => {
    try {
        // Return if already connected
        if (mongoose_1.default.connection.readyState !== 0) {
            return;
        }
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudblitz';
        await mongoose_1.default.connect(mongoUri);
        // Log connection details based on environment
        if (process.env.NODE_ENV === 'test') {
            console.log(`✅ Test MongoDB connected at: ${mongoUri}`);
        }
        else {
            console.log('✅ MongoDB connected successfully');
        }
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1); // Only exit in non-test environments
        }
        else {
            throw error; // In test environment, throw the error to be caught by the test runner
        }
    }
};
// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err.message);
    process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});
// Start the server only if this is not a test environment
if (process.env.NODE_ENV !== 'test') {
    startServer();
}
exports.default = app;
