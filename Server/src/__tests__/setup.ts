// Test setup file
// Basic setup for testing without MongoDB for now

// Global test setup
beforeAll(async () => {
  // Setup code before all tests
  console.log('🧪 Starting test suite...');
});

afterAll(async () => {
  // Cleanup code after all tests
  console.log('✅ Test suite completed');
});

afterEach(async () => {
  // Cleanup after each test
  jest.clearAllMocks();
});