const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000/api';
const TEST_USER = {
  email: 'farmer@test.com',
  password: 'password123'
};

let authToken = '';

// Test login and get token
async function testLogin() {
  try {
    console.log('🔐 Testing login...');
    const response = await axios.post(`${BASE_URL}/auth/login`, TEST_USER);
    authToken = response.data.token;
    console.log('✅ Login successful');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test AI chatbot
async function testChatbot() {
  try {
    console.log('🤖 Testing AI chatbot...');
    const response = await axios.post(`${BASE_URL}/ai-chat/message`, {
      message: 'Hello, can you help me with farming?',
      context: { userRole: 'farmer' }
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Chatbot response received');
    console.log('Response:', response.data.aiResponse.message.substring(0, 100) + '...');
    return true;
  } catch (error) {
    console.error('❌ Chatbot test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test farming advice
async function testFarmingAdvice() {
  try {
    console.log('🌱 Testing farming advice...');
    const response = await axios.post(`${BASE_URL}/ai-chat/farming-advice`, {
      cropType: 'rice',
      location: 'Maharashtra',
      season: 'kharif'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Farming advice received');
    console.log('Advice:', response.data.advice.substring(0, 100) + '...');
    return true;
  } catch (error) {
    console.error('❌ Farming advice test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test contract creation and PDF
async function testContractPDF() {
  try {
    console.log('📄 Testing contract PDF...');
    
    // First create a test contract
    const contractData = {
      cropType: 'rice',
      quantity: 100,
      unit: 'kg',
      price: 50,
      deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      terms: 'Test contract terms',
      category: 'crops',
      deliveryLocation: {
        address: 'Test Address',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }
    };
    
    const contractResponse = await axios.post(`${BASE_URL}/contracts/create`, contractData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const contractId = contractResponse.data.contract._id;
    console.log('✅ Test contract created:', contractId);
    
    // Now test PDF generation
    const pdfResponse = await axios.get(`${BASE_URL}/contracts/download/${contractId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ PDF generation successful');
    console.log('Download URL:', pdfResponse.data.downloadUrl);
    return true;
  } catch (error) {
    console.error('❌ Contract PDF test failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting KrishiSetu functionality tests...\n');
  
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without login');
    return;
  }
  
  console.log('');
  await testChatbot();
  
  console.log('');
  await testFarmingAdvice();
  
  console.log('');
  await testContractPDF();
  
  console.log('\n🎉 All tests completed!');
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled error:', error.message);
});

// Run tests
runTests();