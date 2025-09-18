const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './backend/.env' });

async function testAPIKey() {
  try {
    console.log('🔑 Testing Google AI API Key...');
    
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'Not found');
    
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY not found in environment variables');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('📤 Sending test request...');
    const result = await model.generateContent('Hello, can you respond with "API key is working"?');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API Response:', text);
    console.log('🎉 API Key is working correctly!');
    
  } catch (error) {
    console.error('❌ API Key test failed:');
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    
    if (error.message.includes('API_KEY')) {
      console.log('💡 Suggestion: Check if your API key is valid and has Gemini API access enabled');
    }
    if (error.status === 429) {
      console.log('💡 Suggestion: API rate limit exceeded, try again later');
    }
    if (error.status === 403) {
      console.log('💡 Suggestion: API key may not have permission to access Gemini API');
    }
  }
}

testAPIKey();