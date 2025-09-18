const express = require('express');
const { auth } = require('../middleware/auth');
const geminiService = require('../services/geminiService');
const { Message } = require('../models/Chat');

const router = express.Router();

// Send message to AI chatbot
router.post('/message', auth, async (req, res) => {
  try {
    const { message, context } = req.body;
    const userId = req.user._id.toString();

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get user context for better responses
    const userContext = {
      role: req.user.role,
      username: req.user.username,
      ...context
    };

    // Send message to Gemini AI
    const aiResponse = await geminiService.sendMessage(userId, message, userContext);

    // Save both user message and AI response to database
    const userMessage = new Message({
      senderId: req.user._id,
      receiverId: null, // AI messages don't have a receiver
      message: message,
      messageType: 'ai-user',
      isAIMessage: true
    });

    const aiMessage = new Message({
      senderId: null, // AI messages don't have a sender
      receiverId: req.user._id,
      message: aiResponse,
      messageType: 'ai-bot',
      isAIMessage: true
    });

    await Promise.all([userMessage.save(), aiMessage.save()]);

    res.json({
      userMessage: {
        _id: userMessage._id,
        message: userMessage.message,
        messageType: userMessage.messageType,
        createdAt: userMessage.createdAt,
        isOwn: true
      },
      aiResponse: {
        _id: aiMessage._id,
        message: aiMessage.message,
        messageType: aiMessage.messageType,
        createdAt: aiMessage.createdAt,
        isOwn: false
      }
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ 
      message: 'Failed to get AI response',
      error: error.message 
    });
  }
});

// Get AI chat history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, isAIMessage: true },
        { receiverId: req.user._id, isAIMessage: true }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Group messages by conversation pairs
    const conversations = [];
    for (let i = 0; i < messages.length; i += 2) {
      const aiMessage = messages[i];
      const userMessage = messages[i + 1];
      
      if (userMessage && aiMessage) {
        conversations.push({
          userMessage: {
            _id: userMessage._id,
            message: userMessage.message,
            createdAt: userMessage.createdAt,
            isOwn: true
          },
          aiResponse: {
            _id: aiMessage._id,
            message: aiMessage.message,
            createdAt: aiMessage.createdAt,
            isOwn: false
          }
        });
      }
    }

    res.json(conversations.reverse());
  } catch (error) {
    console.error('AI chat history error:', error);
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
});

// Get farming advice
router.post('/farming-advice', auth, async (req, res) => {
  try {
    const { cropType, location, season } = req.body;

    if (!cropType || !location) {
      return res.status(400).json({ message: 'Crop type and location are required' });
    }

    const advice = await geminiService.getFarmingAdvice(cropType, location, season || 'current');

    res.json({
      advice,
      cropType,
      location,
      season: season || 'current',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Farming advice error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    });
    res.status(500).json({ 
      message: 'Failed to get farming advice',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get market insights
router.post('/market-insights', auth, async (req, res) => {
  try {
    const { cropType, location } = req.body;

    if (!cropType || !location) {
      return res.status(400).json({ message: 'Crop type and location are required' });
    }

    const insights = await geminiService.getMarketInsights(cropType, location);

    res.json({
      insights,
      cropType,
      location,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Market insights error:', error);
    res.status(500).json({ 
      message: 'Failed to get market insights',
      error: error.message 
    });
  }
});

// Get contract farming advice
router.post('/contract-advice', auth, async (req, res) => {
  try {
    const { cropType, quantity } = req.body;

    if (!cropType || !quantity) {
      return res.status(400).json({ message: 'Crop type and quantity are required' });
    }

    const advice = await geminiService.getContractAdvice(cropType, quantity, req.user.role);

    res.json({
      advice,
      cropType,
      quantity,
      userRole: req.user.role,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Contract advice error:', error);
    res.status(500).json({ 
      message: 'Failed to get contract advice',
      error: error.message 
    });
  }
});

// Clear AI chat session
router.delete('/session', auth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    geminiService.clearChatSession(userId);

    res.json({ message: 'Chat session cleared successfully' });
  } catch (error) {
    console.error('Clear session error:', error);
    res.status(500).json({ message: 'Failed to clear chat session' });
  }
});

module.exports = router;