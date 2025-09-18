const axios = require('axios');

async function testConnection() {
  console.log('🔍 Testing backend connection...');
  
  // Wait a bit for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check passed:', healthResponse.data.message);
    
    // Test login with test credentials
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'farmer@test.com',
      password: 'farmer123'
    });
    console.log('✅ Login test passed for user:', loginResponse.data.user.username);
    console.log('🎉 Backend is working correctly!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    if (error.response) {
      console.error('📋 Response status:', error.response.status);
      console.error('📋 Response data:', error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Backend server is not running on port 5000');
    }
    console.log('⚠️  Please check if the backend server started correctly');
  }
}

testConnection();