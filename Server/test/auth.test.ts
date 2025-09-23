import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import { User } from '../src/models/User';

// Add jest typings
import '@types/jest';

describe('Auth API', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clean up users collection before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('data.user.name', 'Test User');
      expect(res.body).toHaveProperty('data.user.email', 'test@example.com');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
    });

    it('should not register a user with an existing email', async () => {
      // Create a user first
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123'
      });

      // Try to register with the same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'existing@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('status', 'error');
    });

    it('should validate input data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'T',  // Too short
          email: 'invalid-email',
          password: '123'  // Too short
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('status', 'error');
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user successfully', async () => {
      // Create a user
      await User.create({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123'
      });

      // Login
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
      expect(res.body.data.user).toHaveProperty('email', 'login@example.com');
    });

    it('should not login with invalid credentials', async () => {
      // Create a user
      await User.create({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123'
      });

      // Try login with wrong password
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('status', 'error');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get the current user profile', async () => {
      // Create a user
      const user = await User.create({
        name: 'Profile User',
        email: 'profile@example.com',
        password: 'password123'
      });

      // Login to get token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'profile@example.com',
          password: 'password123'
        });

      // Get profile with token
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${loginRes.body.data.accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('id', expect.any(String));
      expect(res.body.data).toHaveProperty('name', 'Profile User');
      expect(res.body.data).toHaveProperty('email', 'profile@example.com');
    });

    it('should not allow access without a token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('status', 'error');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      // Create a user
      const user = await User.create({
        name: 'Refresh User',
        email: 'refresh@example.com',
        password: 'password123'
      });

      // Login to get tokens
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'refresh@example.com',
          password: 'password123'
        });

      // Refresh token
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: loginRes.body.data.refreshToken
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('expiresIn');
    });

    it('should reject invalid refresh tokens', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid-token'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('status', 'error');
    });
  });

  describe('POST /api/auth/change-password', () => {
    it('should change password with valid credentials', async () => {
      // Create a user
      await User.create({
        name: 'Password User',
        email: 'password@example.com',
        password: 'oldpassword123'
      });

      // Login to get token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'password@example.com',
          password: 'oldpassword123'
        });

      // Change password
      const changeRes = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${loginRes.body.data.accessToken}`)
        .send({
          currentPassword: 'oldpassword123',
          newPassword: 'newpassword456'
        });

      expect(changeRes.status).toBe(200);
      expect(changeRes.body).toHaveProperty('status', 'success');

      // Try login with new password
      const newLoginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'password@example.com',
          password: 'newpassword456'
        });

      expect(newLoginRes.status).toBe(200);
      expect(newLoginRes.body).toHaveProperty('status', 'success');
    });

    it('should not change password with incorrect current password', async () => {
      // Create a user
      await User.create({
        name: 'Password User',
        email: 'password2@example.com',
        password: 'correctpassword'
      });

      // Login to get token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'password2@example.com',
          password: 'correctpassword'
        });

      // Try change password with wrong current password
      const res = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${loginRes.body.data.accessToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('status', 'error');
    });
  });
});