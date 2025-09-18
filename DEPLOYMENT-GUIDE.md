# 🚀 KrishiSetu Deployment Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Google AI API Key (Gemini)

## Environment Setup

### 1. Backend Configuration
Copy the example environment file and configure:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set:
```
GOOGLE_AI_API_KEY=your-actual-api-key-here
MONGODB_URI=mongodb://localhost:27017/krishisetu
PORT=5000
```

### 2. Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Start Services
```bash
# Start MongoDB (if not running as service)
mongod --dbpath ./data/db

# Start Backend (in backend/ directory)
npm start

# Start Frontend (in frontend/ directory)
npm run dev
```

## AI Chatbot Features
- 🤖 General farming conversations
- 🌱 Crop-specific farming advice
- 📈 Market insights and predictions
- 📋 Contract farming guidance
- 🌐 Multilingual support (English, Hindi, Marathi)

## Testing
1. Login to the platform
2. Look for floating chat button (bottom-right)
3. Test all chatbot tabs and functionality
4. Verify multilingual support

## Security Notes
- Never commit .env files to version control
- Keep API keys secure and rotate regularly
- Use environment variables for all sensitive data
- Monitor API usage and costs

## Troubleshooting
- Ensure MongoDB is running
- Check API key validity
- Verify network connectivity
- Check browser console for errors
