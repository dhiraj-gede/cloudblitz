// filepath: h:/Gremio/cloudblitz/Server/scripts/api-test.js
const spawnSync = require('cross-spawn');
const baseUrl = 'http://localhost:5000/api';

console.log('🚀 CloudBlitz API Test Script');
console.log('------------------------------\n');

// Health check
console.log('1. Testing Health Check Endpoint:');
try {
  const healthResult = spawnSync.sync('curl', ['-s', `${baseUrl}/health`], {
    encoding: 'utf8',
  }).stdout.toString();
  console.log('healthRes: ', healthResult)
  const healthData = JSON.parse(healthResult);
  console.log('Result:', healthData);
  console.log('✅ Health check successful\n');
} catch (error) {
  console.error('❌ Health check failed:', error.message, error.stderr || '');
}

// Register a user
console.log('2. Testing User Registration:');
try {
  const body = {
    name: 'Test User4', // Use unique email to avoid conflicts
    email: 'test4@example.com',
    password: 'password123',
    role: 'admin'
  };
  const registerArgs = [
    '-s',
    '-X',
    'POST',
    `${baseUrl}/auth/register`,
    '-H',
    'Accept: */*',
    '-H',
    'Content-Type: application/json',
    '-d',
    JSON.stringify(body),
  ];
  console.log('Register command:', ['curl', ...registerArgs].join(' ')); // Debug
  const registerResult = spawnSync.sync('curl', registerArgs, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const registerData = JSON.parse(registerResult.stdout);
  if (registerData.status === 'error') {
    throw new Error(`Server error: ${registerData.message}`);
  }
  console.log('Result:', registerData);
  console.log('✅ User registration successful\n');
} catch (error) {
  console.error(
    '❌ User registration failed:',
    error.message,
    error.stderr || ''
  );
}

// Login
console.log('3. Testing User Login:');
let token = null;
try {
  const body = {
    email: 'test4@example.com',
    password: 'password123',
  };
  const loginArgs = [
    '-s',
    '-X',
    'POST',
    `${baseUrl}/auth/login`,
    '-H',
    'Content-Type: application/json',
    '-d',
    JSON.stringify(body),
  ];
  console.log('Login command:', ['curl', ...loginArgs].join(' ')); // Debug
  const loginResult = spawnSync.sync('curl', loginArgs, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const loginData = JSON.parse(loginResult.stdout);
  if (loginData.status === 'error') {
    throw new Error(`Server error: ${loginData.message}`);
  }
  token = loginData.data?.accessToken;
  if (!token) {
    throw new Error('No access token in response');
  }
  console.log('Result:', loginData);
  console.log('✅ User login successful\n');
} catch (error) {
  console.error('❌ User login failed:', error.message, error.stderr || '');
}

// Create an enquiry
if (token) {
  console.log('4. Testing Enquiry Creation:');
  try {
    const body = {
      customerName: 'API Test Customer',
      email: 'customer@example.com',
      phone: '+1234567890',
      message: 'This is a test enquiry created by the API test script.',
    };
    const createEnquiryArgs = [
      '-s',
      '-X',
      'POST',
      `${baseUrl}/enquiries`,
      '-H',
      'Content-Type: application/json',
      '-H',
      `Authorization: Bearer ${token}`,
      '-d',
      JSON.stringify(body),
    ];
    const createEnquiryResult = spawnSync.sync('curl', createEnquiryArgs, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const enquiryData = JSON.parse(createEnquiryResult.stdout);
    const enquiryId = enquiryData.data.id;
    console.log('Result:', enquiryData);
    console.log('✅ Enquiry creation successful\n');

    // Get all enquiries
    console.log('5. Testing Get All Enquiries:');
    try {
      const getEnquiriesArgs = [
        '-s',
        `${baseUrl}/enquiries`,
        '-H',
        `Authorization: Bearer ${token}`,
      ];
      const getEnquiriesResult = spawnSync.sync('curl', getEnquiriesArgs, {
        encoding: 'utf8',
      }).stdout.toString();
      console.log('Result:', JSON.parse(getEnquiriesResult));
      console.log('✅ Get enquiries successful\n');
    } catch (error) {
      console.error(
        '❌ Get enquiries failed:',
        error.message,
        error.stderr || ''
      );
    }

    // Get single enquiry
    console.log('6. Testing Get Single Enquiry:');
    try {
      const getEnquiryArgs = [
        '-s',
        `${baseUrl}/enquiries/${enquiryId}`,
        '-H',
        `Authorization: Bearer ${token}`,
      ];
      const getEnquiryResult = spawnSync.sync('curl', getEnquiryArgs, {
        encoding: 'utf8',
      }).stdout.toString();
      console.log('Result:', JSON.parse(getEnquiryResult));
      console.log('✅ Get single enquiry successful\n');
    } catch (error) {
      console.error(
        '❌ Get single enquiry failed:',
        error.message,
        error.stderr || ''
      );
    }

    // Update enquiry
    console.log('7. Testing Update Enquiry:');
    try {
      const updateBody = { status: 'in-progress', priority: 'high' };
      const updateEnquiryArgs = [
        '-s',
        '-X',
        'PUT',
        `${baseUrl}/enquiries/${enquiryId}`,
        '-H',
        'Content-Type: application/json',
        '-H',
        `Authorization: Bearer ${token}`,
        '-d',
        JSON.stringify(updateBody),
      ];
      const updateEnquiryResult = spawnSync.sync('curl', updateEnquiryArgs, {
        encoding: 'utf8',
      }).stdout.toString();
      console.log('Result:', JSON.parse(updateEnquiryResult));
      console.log('✅ Update enquiry successful\n');
    } catch (error) {
      console.error(
        '❌ Update enquiry failed:',
        error.message,
        error.stderr || ''
      );
    }
  } catch (error) {
    console.error(
      '❌ Enquiry creation failed:',
      error.message,
      error.stderr || ''
    );
  }
}

console.log('API Test Script Completed');
