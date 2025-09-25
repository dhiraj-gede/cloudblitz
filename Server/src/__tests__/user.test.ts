// filepath: h:/Gremio/cloudblitz/Server/src/__tests__/user.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';
import { generateAccessToken } from '../lib/jwt';

let adminToken: string;
let userToken: string;
let adminUser: any;
let regularUser: any;
let testUserId: string;

describe('User API', () => {
  beforeAll(async () => {
    // Create test users
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    });

    regularUser = await User.create({
      name: 'Regular User',
      email: 'user@test.com',
      password: 'password123',
      role: 'user',
    });

    // Generate tokens
    adminToken = generateAccessToken(adminUser).token;
    userToken = generateAccessToken(regularUser).token;
  });

  afterAll(async () => {
    // Clean up
    await User.deleteMany({});
  });

  describe('GET /api/users', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(401);
    });

    it('should allow admin to get all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should not allow regular users to get all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/users', () => {
    it('should allow admin to create a user', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Test User',
          email: 'newtest@example.com',
          password: 'password123',
          role: 'staff',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('name', 'New Test User');
      expect(res.body.data).toHaveProperty('email', 'newtest@example.com');
      expect(res.body.data).toHaveProperty('role', 'staff');

      // Save ID for later tests
      testUserId = res.body.data.id;
    });

    it('should not allow regular users to create users', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Another User',
          email: 'another@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should allow admin to update any user', async () => {
      const res = await request(app)
        .put(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Name',
          role: 'user',
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('name', 'Updated Name');
      expect(res.body.data).toHaveProperty('role', 'user');
    });

    it('should allow users to update themselves', async () => {
      const res = await request(app)
        .put(`/api/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Self Updated',
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('name', 'Self Updated');
    });

    it('should not allow regular users to update others', async () => {
      const res = await request(app)
        .put(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Hacker Update',
        });

      expect(res.status).toBe(403);
    });

    it('should not allow regular users to change their role', async () => {
      const res = await request(app)
        .put(`/api/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          role: 'admin',
        });

      // Should succeed but role shouldn't change
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('role', 'user');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should not allow regular users to delete users', async () => {
      const res = await request(app)
        .delete(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow admin to delete users', async () => {
      const res = await request(app)
        .delete(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      // Verify deletion
      const deletedUser = await User.findById(testUserId);
      expect(deletedUser).toBeNull();
    });

    it('should not allow deleting the last admin', async () => {
      const res = await request(app)
        .delete(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Cannot delete the last admin user');
    });
  });
});
