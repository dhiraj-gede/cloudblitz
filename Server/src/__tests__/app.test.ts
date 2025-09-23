import request from 'supertest';

// Create a simple test app without starting the server
import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const testApp: Application = express();

testApp.use(cors());
testApp.use(express.json());

testApp.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'CloudBlitz API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

testApp.get('/api', (req: Request, res: Response) => {
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
    const response = await request(testApp)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('message', 'CloudBlitz API is running');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('version', '1.0.0');
  });

  test('GET /api should return API info', async () => {
    const response = await request(testApp)
      .get('/api')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Welcome to CloudBlitz Enquiry Management API');
    expect(response.body).toHaveProperty('version', '1.0.0');
    expect(response.body).toHaveProperty('endpoints');
  });

  test('GET /nonexistent should return 404', async () => {
    await request(testApp)
      .get('/nonexistent')
      .expect(404);
  });
});