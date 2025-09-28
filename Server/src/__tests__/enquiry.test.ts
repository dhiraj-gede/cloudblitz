// filepath: h:/Gremio/cloudblitz/Server/src/__tests__/enquiry.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';
import { Enquiry } from '../models/Enquiry';
import { generateAccessToken } from '../lib/jwt';

let adminToken: string;
let staffToken: string;
let userToken: string;
let adminUser: any;
let staffUser: any;
let regularUser: any;
let testEnquiryId: string;

describe('Enquiry API', () => {
  beforeAll(async () => {
    // Create test users
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    });

    staffUser = await User.create({
      name: 'Staff User',
      email: 'staff@test.com',
      password: 'password123',
      role: 'staff',
    });

    regularUser = await User.create({
      name: 'Regular User',
      email: 'user@test.com',
      password: 'password123',
      role: 'user',
    });

    // Generate tokens
    adminToken = generateAccessToken(adminUser).token;
    staffToken = generateAccessToken(staffUser).token;
    userToken = generateAccessToken(regularUser).token;
  });

  afterAll(async () => {
    // Clean up
    await User.deleteMany({});
    await Enquiry.deleteMany({});
  });

  describe('POST /api/enquiries', () => {
    it('should create a new enquiry successfully', async () => {
      const res = await request(app)
        .post('/api/enquiries')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
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
      const res = await request(app)
        .post('/api/enquiries')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
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
      const res = await request(app).get('/api/enquiries');
      expect(res.status).toBe(401);
    });

    it('should return enquiries for admin user', async () => {
      const res = await request(app)
        .get('/api/enquiries')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter enquiries by status', async () => {
      const res = await request(app)
        .get('/api/enquiries?status=new')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');

      // All enquiries should have status 'new'
      const allStatusNew = res.body.data.every((e: any) => e.status === 'new');
      expect(allStatusNew).toBe(true);
    });
  });

  describe('GET /api/enquiries/:id', () => {
    it('should require authentication', async () => {
      const res = await request(app).get(`/api/enquiries/${testEnquiryId}`);
      expect(res.status).toBe(401);
    });

    it('should return a specific enquiry', async () => {
      const res = await request(app)
        .get(`/api/enquiries/${testEnquiryId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('id', testEnquiryId);
    });

    it('should return 404 for non-existent enquiry', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/enquiries/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/enquiries/:id', () => {
    it('should update an enquiry', async () => {
      const res = await request(app)
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
      expect(res.body.data.assignedTo).toHaveProperty('id', staffUser.id);
    });

    it('should prevent regular users from updating status', async () => {
      // First assign the enquiry to the regular user
      await request(app)
        .put(`/api/enquiries/${testEnquiryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          assignedTo: regularUser.id,
        });

      // Try to update status as regular user
      const res = await request(app)
        .put(`/api/enquiries/${testEnquiryId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          status: 'closed',
        });
      console.log(res.body);
      // Status should not change
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe(
        'You do not have permission to update this enquiry'
      );
    });
  });

  describe('PUT /api/enquiries/:id/assign', () => {
    it('should allow admin to manually assign enquiry to staff', async () => {
      const res = await request(app)
        .put(`/api/enquiries/${testEnquiryId}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userId: staffUser.id });
      expect(res.status).toBe(200);
      expect(res.body.data.assignedTo).toBe(staffUser.id);
      expect(res.body.message).toMatch(/assigned successfully/i);
    });

    it('should prevent regular user from assigning enquiry', async () => {
      const res = await request(app)
        .put(`/api/enquiries/${testEnquiryId}/assign`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ userId: staffUser.id });
      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/do not have permission/i);
    });

    it('should return 400 for invalid userId', async () => {
      const res = await request(app)
        .put(`/api/enquiries/${testEnquiryId}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userId: 'invalidid' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/invalid enquiry or user id/i);
    });
  });

  describe('DELETE /api/enquiries/:id', () => {
    it('should soft delete an enquiry', async () => {
      const res = await request(app)
        .delete(`/api/enquiries/${testEnquiryId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      // Verify it's been soft deleted
      const enquiry = await Enquiry.findById(testEnquiryId);
      expect(enquiry).not.toBeNull();
      expect(enquiry?.deletedAt).not.toBeNull();
    });
  });
});
