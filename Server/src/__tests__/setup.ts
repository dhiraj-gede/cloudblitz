// Test setup for MongoDB tests
import mongoose from 'mongoose';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { jest } from '@jest/globals';

// Set test environment
process.env.NODE_ENV = 'test';

// Load test environment variables
const envPath = path.resolve(process.cwd(), '.env.test');
dotenv.config({ path: envPath });

// Setup MongoDB before all tests
beforeAll(async () => {
  // Only create a new connection if one doesn't exist
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      console.log(
        `🧪 Test setup connected to MongoDB at: ${process.env.MONGODB_URI}`
      );

      // Drop the entire database to ensure a clean slate
      await mongoose.connection.dropDatabase();
      console.log('🧹 Database dropped for testing');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB for testing:', error);
      throw error; // Re-throw to fail tests if connection fails
    }
  }
});

// Cleanup after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('✅ Test setup disconnected from MongoDB');
  }
});

// Clear all mocks after each test
afterEach(async () => {
  jest.clearAllMocks();
});
