const axios = require('axios');

async function quickTest() {
  console.log('🧪 Running Quick Test Suite...\n');
  
  try {
    // Test 1: Backend Health Check
    console.log('1️⃣ Testing backend health...');
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend is healthy:', health.data.message);
    
    // Test 2: Test Login
    console.log('\n2️⃣ Testing farmer login...');
    const login = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'farmer@test.com',
      password: 'farmer123'
    });
    console.log('✅ Login successful for:', login.data.user.username);
    
    // Test 3: Test Protected Route
    console.log('\n3️⃣ Testing protected route...');
    const token = login.data.token;
    const profile = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieved:', profile.data.email);
    
    console.log('\n🎉 All tests passed! Your KrishiSetu backend is working perfectly!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the frontend: cd frontend && npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Login with: farmer@test.com / farmer123');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Solution: Start the backend server first:');
      console.log('   cd backend && npm start');
    }
  }
}

quickTest();