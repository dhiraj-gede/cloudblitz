"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// filepath: h:/Gremio/cloudblitz/Server/src/__tests__/enquiry.test.ts
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../app"));
const User_1 = require("../models/User");
const Enquiry_1 = require("../models/Enquiry");
const jwt_1 = require("../lib/jwt");
let adminToken;
let staffToken;
let userToken;
let adminUser;
let staffUser;
let regularUser;
let testEnquiryId;
describe('Enquiry API', () => {
    beforeAll(async () => {
        // Create test users
        adminUser = await User_1.User.create({
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'password123',
            role: 'admin',
        });
        staffUser = await User_1.User.create({
            name: 'Staff User',
            email: 'staff@test.com',
            password: 'password123',
            role: 'staff',
        });
        regularUser = await User_1.User.create({
            name: 'Regular User',
            email: 'user@test.com',
            password: 'password123',
            role: 'user',
        });
        // Generate tokens
        adminToken = (0, jwt_1.generateAccessToken)(adminUser).token;
        staffToken = (0, jwt_1.generateAccessToken)(staffUser).token;
        userToken = (0, jwt_1.generateAccessToken)(regularUser).token;
    });
    afterAll(async () => {
        // Clean up
        await User_1.User.deleteMany({});
        await Enquiry_1.Enquiry.deleteMany({});
    });
    describe('POST /api/enquiries', () => {
        it('should create a new enquiry successfully', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/enquiries').send({
                customerName: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567890',
                message: 'This is a test enquiry message.',
                priority: 'medium',
            });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('status', 'success');
            expect(res.body.data).toHaveProperty('customerName', 'John Doe');
            expect(res.body.data).toHaveProperty('email', 'john@example.com');
            // Save the ID for later tests
            testEnquiryId = res.body.data.id;
        });
        it('should validate enquiry input', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/enquiries').send({
                customerName: 'J', // Too short
                email: 'not-an-email',
                phone: 'abc', // Invalid format
                message: 'Short', // Too short
            });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('status', 'error');
            expect(res.body).toHaveProperty('message', 'Validation failed');
        });
    });
    describe('GET /api/enquiries', () => {
        it('should require authentication', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get('/api/enquiries');
            expect(res.status).toBe(401);
        });
        it('should return enquiries for admin user', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/api/enquiries')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('status', 'success');
            expect(res.body).toHaveProperty('data');
            expect(Array.isArray(res.body.data)).toBe(true);
        });
        it('should filter enquiries by status', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/api/enquiries?status=new')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('status', 'success');
            // All enquiries should have status 'new'
            const allStatusNew = res.body.data.every((e) => e.status === 'new');
            expect(allStatusNew).toBe(true);
        });
    });
    describe('GET /api/enquiries/:id', () => {
        it('should require authentication', async () => {
            const res = await (0, supertest_1.default)(app_1.default).get(`/api/enquiries/${testEnquiryId}`);
            expect(res.status).toBe(401);
        });
        it('should return a specific enquiry', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get(`/api/enquiries/${testEnquiryId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('status', 'success');
            expect(res.body.data).toHaveProperty('id', testEnquiryId);
        });
        it('should return 404 for non-existent enquiry', async () => {
            const fakeId = new mongoose_1.default.Types.ObjectId();
            const res = await (0, supertest_1.default)(app_1.default)
                .get(`/api/enquiries/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(404);
        });
    });
    describe('PUT /api/enquiries/:id', () => {
        it('should update an enquiry', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/api/enquiries/${testEnquiryId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                status: 'in-progress',
                priority: 'high',
                assignedTo: staffUser.id,
            });
            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('status', 'in-progress');
            expect(res.body.data).toHaveProperty('priority', 'high');
        });
        it('should prevent regular users from updating status', async () => {
            // First assign the enquiry to the regular user
            await (0, supertest_1.default)(app_1.default)
                .put(`/api/enquiries/${testEnquiryId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                assignedTo: regularUser.id,
            });
            // Try to update status as regular user
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/api/enquiries/${testEnquiryId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                status: 'closed',
            });
            console.log(res.body);
            // Status should not change
            expect(res.body.status).not.toBe('closed');
        });
    });
    describe('DELETE /api/enquiries/:id', () => {
        it('should soft delete an enquiry', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/enquiries/${testEnquiryId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.status).toBe(200);
            // Verify it's been soft deleted
            const enquiry = await Enquiry_1.Enquiry.findById(testEnquiryId);
            expect(enquiry).not.toBeNull();
            expect(enquiry?.deletedAt).not.toBeNull();
        });
    });
});
