"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.validateEnv = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().transform(val => parseInt(val)).refine(val => val > 0 && val < 65536, 'Invalid port number'),
    MONGODB_URI: zod_1.z.string().min(1, 'MongoDB URI is required'),
    JWT_SECRET: zod_1.z.string().min(32, 'JWT secret must be at least 32 characters'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:3000')
});
const validateEnv = () => {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const errorMessages = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
            console.error('❌ Environment validation failed:');
            errorMessages.forEach(msg => console.error(`  - ${msg}`));
            process.exit(1);
        }
        throw error;
    }
};
exports.validateEnv = validateEnv;
// Validate and export environment configuration
exports.env = (0, exports.validateEnv)();
