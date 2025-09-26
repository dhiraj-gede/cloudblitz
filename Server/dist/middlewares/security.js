"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSecurity = exports.authRateLimit = exports.generalRateLimit = exports.createRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
// Rate limiting configurations
const createRateLimiter = (windowMs, max, message) => {
    return (0, express_rate_limit_1.default)({
        windowMs,
        max,
        message: {
            status: 'error',
            message: message || 'Too many requests from this IP, please try again later.',
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};
exports.createRateLimiter = createRateLimiter;
// General API rate limiting
exports.generalRateLimit = (0, exports.createRateLimiter)(15 * 60 * 1000, // 15 minutes
100, // limit each IP to 100 requests per windowMs
'Too many requests from this IP, please try again in 15 minutes.');
// Strict rate limiting for auth endpoints
exports.authRateLimit = (0, exports.createRateLimiter)(15 * 60 * 1000, // 15 minutes
50, // limit each IP to 50 auth requests per windowMs
'Too many authentication attempts from this IP, please try again in 15 minutes.');
// Security middleware setup
const setupSecurity = (app) => {
    // Helmet for security headers
    app.use((0, helmet_1.default)({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
    }));
    // Sanitize user input from malicious HTML
    app.use((req, res, next) => {
        const sanitizedData = express_mongo_sanitize_1.default.sanitize({ query: req.query, body: req.body, params: req.params }, { replaceWith: '_', dryRun: true });
        req.sanitizedQuery = sanitizedData.query;
        req.sanitizedBody = sanitizedData.body;
        req.sanitizedParams = sanitizedData.params;
        next();
    });
    // Apply general rate limiting to all requests
    app.use('/api/', exports.generalRateLimit);
    console.log('🛡️  Security middleware configured');
};
exports.setupSecurity = setupSecurity;
