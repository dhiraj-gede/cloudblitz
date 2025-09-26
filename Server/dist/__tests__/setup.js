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
// Test setup for MongoDB tests
const mongoose_1 = __importDefault(require("mongoose"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
const globals_1 = require("@jest/globals");
// Set test environment
process.env.NODE_ENV = 'test';
// Load test environment variables
const envPath = path.resolve(process.cwd(), '.env.test');
dotenv.config({ path: envPath });
// Setup MongoDB before all tests
beforeAll(async () => {
    // Only create a new connection if one doesn't exist
    if (mongoose_1.default.connection.readyState === 0) {
        try {
            await mongoose_1.default.connect(process.env.MONGODB_URI);
            console.log(`🧪 Test setup connected to MongoDB at: ${process.env.MONGODB_URI}`);
            // Drop the entire database to ensure a clean slate
            await mongoose_1.default.connection.dropDatabase();
            console.log('🧹 Database dropped for testing');
        }
        catch (error) {
            console.error('❌ Failed to connect to MongoDB for testing:', error);
            throw error; // Re-throw to fail tests if connection fails
        }
    }
});
// Cleanup after all tests
afterAll(async () => {
    if (mongoose_1.default.connection.readyState !== 0) {
        await mongoose_1.default.disconnect();
        console.log('✅ Test setup disconnected from MongoDB');
    }
});
// Clear all mocks after each test
afterEach(async () => {
    globals_1.jest.clearAllMocks();
});
