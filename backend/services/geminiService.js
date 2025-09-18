const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    console.log('Initializing Gemini service with API key:', apiKey ? 'Present' : 'Missing');
    
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY environment variable is required');
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.chatSessions = new Map(); // Store chat sessions per user
      console.log('Gemini service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini service:', error);
      throw error;
    }
  }

  // Get or create chat session for a user
  getChatSession(userId) {
    if (!this.chatSessions.has(userId)) {
      const chat = this.model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: 'You are KrishiBot, an AI assistant for KrishiSetu - a contract farming platform that connects farmers with buyers. You help with agricultural advice, contract farming guidance, crop information, market prices, farming techniques, and platform-related questions. Always be helpful, accurate, and supportive. Respond in a friendly and professional manner.' }]
          },
          {
            role: 'model',
            parts: [{ text: 'Hello! I\'m KrishiBot, your AI assistant for KrishiSetu. I\'m here to help you with agricultural advice, contract farming guidance, crop information, market insights, and any questions about our platform. How can I assist you today?' }]
          }
        ]
      });
      this.chatSessions.set(userId, chat);
    }
    return this.chatSessions.get(userId);
  }

  // Send message to Gemini and get response
  async sendMessage(userId, message, userContext = {}) {
    try {
      // For simplicity, use direct model generation instead of chat sessions
      let contextualMessage = message;
      if (userContext.role) {
        contextualMessage = `You are KrishiBot, an AI assistant for farmers and buyers. The user is a ${userContext.role}. Please respond helpfully to: ${message}`;
      } else {
        contextualMessage = `You are KrishiBot, an AI assistant for farmers and buyers. Please respond helpfully to: ${message}`;
      }

      // Set timeout for the request
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 20000); // 20 seconds
      });

      const requestPromise = this.model.generateContent(contextualMessage);
      
      const result = await Promise.race([requestPromise, timeoutPromise]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      if (error.message === 'Request timeout') {
        throw new Error('AI response took too long. Please try again with a shorter message.');
      }
      if (error.message.includes('API key')) {
        throw new Error('AI service configuration error. Please contact support.');
      }
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  // Get farming advice based on crop and location
  async getFarmingAdvice(cropType, location, season) {
    try {
      console.log(`Getting farming advice for ${cropType} in ${location} during ${season}`);
      
      const prompt = `Give brief farming advice for ${cropType} in ${location} during ${season}. Include: cultivation tips, soil prep, irrigation, pests, fertilizers. Keep it under 150 words.`;

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 15000);
      });

      console.log('Sending request to Gemini API...');
      const requestPromise = this.model.generateContent(prompt);
      const result = await Promise.race([requestPromise, timeoutPromise]);
      const response = await result.response;
      const text = response.text();
      
      console.log('Received response from Gemini API:', text.substring(0, 100) + '...');
      return text;
    } catch (error) {
      console.error('Farming advice error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        status: error.status,
        statusText: error.statusText
      });
      
      if (error.message === 'Request timeout') {
        throw new Error('Request took too long. Please try again.');
      }
      if (error.message.includes('API_KEY')) {
        throw new Error('Invalid API key. Please check your Google AI API key.');
      }
      if (error.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      throw new Error(`Failed to get farming advice: ${error.message}`);
    }
  }

  // Get market price predictions
  async getMarketInsights(cropType, location) {
    try {
      const prompt = `Give brief market insights for ${cropType} in ${location}: current trends, price predictions, best selling time. Keep under 100 words.`;

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 15000);
      });

      const requestPromise = this.model.generateContent(prompt);
      const result = await Promise.race([requestPromise, timeoutPromise]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Market insights error:', error);
      if (error.message === 'Request timeout') {
        throw new Error('Request took too long. Please try again.');
      }
      throw new Error('Failed to get market insights');
    }
  }

  // Get contract farming guidance
  async getContractAdvice(cropType, quantity, userRole) {
    try {
      const prompt = `Give brief contract farming advice for ${userRole} dealing with ${cropType} (${quantity} units): pricing, terms, quality, risks. Keep under 100 words.`;

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 15000);
      });

      const requestPromise = this.model.generateContent(prompt);
      const result = await Promise.race([requestPromise, timeoutPromise]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Contract advice error:', error);
      if (error.message === 'Request timeout') {
        throw new Error('Request took too long. Please try again.');
      }
      throw new Error('Failed to get contract advice');
    }
  }

  // Clear chat session for a user
  clearChatSession(userId) {
    this.chatSessions.delete(userId);
  }

  // Get chat history for a user (simplified)
  getChatHistory(userId) {
    const chat = this.chatSessions.get(userId);
    return chat ? chat.getHistory() : [];
  }
}

module.exports = new GeminiService();