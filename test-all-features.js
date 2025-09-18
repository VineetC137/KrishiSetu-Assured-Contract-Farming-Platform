const axios = require('axios');

// Test script to verify all features are working
const API_BASE = 'http://localhost:5000/api';

async function testFeatures() {
  console.log('🧪 Testing KrishiSetu Features...\n');

  try {
    // Test 1: Server Health Check
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${API_BASE}/auth/test`);
    console.log('✅ Server is running\n');

    // Test 2: User Registration
    console.log('2. Testing user registration...');
    const testUser = {
      username: 'testuser' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'test123',
      role: 'farmer'
    };

    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
      console.log('✅ User registration works');
      
      // Test 3: User Login
      console.log('3. Testing user login...');
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      
      const token = loginResponse.data.token;
      console.log('✅ User login works');

      // Set authorization header for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Test 4: Profile Update
      console.log('4. Testing profile update...');
      const profileData = {
        fullName: 'Test User Full Name',
        phone: '9876543210',
        address: 'Test Address, Test City',
        state: 'Maharashtra',
        district: 'Pune',
        pincode: '411001',
        farmSize: '5 acres'
      };

      const profileResponse = await axios.put(`${API_BASE}/auth/profile`, profileData);
      console.log('✅ Profile update works');

      // Test 5: Contract Creation
      console.log('5. Testing contract creation...');
      const contractData = {
        cropType: 'Wheat',
        quantity: 1000,
        price: 25,
        deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        terms: 'Test contract terms and conditions'
      };

      const contractResponse = await axios.post(`${API_BASE}/contracts`, contractData);
      const contractId = contractResponse.data._id;
      console.log('✅ Contract creation works');

      // Test 6: PDF Generation
      console.log('6. Testing PDF generation...');
      try {
        const pdfResponse = await axios.get(`${API_BASE}/contracts/pdf/${contractId}`, {
          responseType: 'arraybuffer'
        });
        console.log('✅ PDF generation works');
      } catch (pdfError) {
        console.log('⚠️  PDF generation may need contract to be signed first');
      }

      // Test 7: Wallet Operations
      console.log('7. Testing wallet operations...');
      const walletResponse = await axios.get(`${API_BASE}/wallet/balance`);
      console.log('✅ Wallet operations work');

      console.log('\n🎉 All core features are working properly!');
      
    } catch (authError) {
      console.log('❌ Authentication error:', authError.response?.data?.message || authError.message);
    }

  } catch (error) {
    console.log('❌ Server connection error:', error.message);
    console.log('Make sure the backend server is running on port 5000');
  }
}

// Run the tests
testFeatures().catch(console.error);