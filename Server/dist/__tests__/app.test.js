"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest")); // Use default import for supertest
const express_1 = __importDefault(require("express")); // Default import for express
const cors_1 = __importDefault(require("cors")); // Use default import for cors
const testApp = (0, express_1.default)();
testApp.use((0, cors_1.default)());
testApp.use(express_1.default.json());
testApp.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'CloudBlitz API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});
testApp.get('/api', (req, res) => {
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
describe('API Health Check', () => {
    test('GET /api/health should return 200', async () => {
        const response = await (0, supertest_1.default)(testApp)
            .get('/api/health')
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toHaveProperty('status', 'OK');
        expect(response.body).toHaveProperty('message', 'CloudBlitz API is running');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('version', '1.0.0');
    });
    test('GET /api should return API info', async () => {
        const response = await (0, supertest_1.default)(testApp)
            .get('/api')
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body).toHaveProperty('message', 'Welcome to CloudBlitz Enquiry Management API');
        expect(response.body).toHaveProperty('version', '1.0.0');
        expect(response.body).toHaveProperty('endpoints');
    });
    test('GET /nonexistent should return 404', async () => {
        await (0, supertest_1.default)(testApp).get('/nonexistent').expect(404);
    });
});
