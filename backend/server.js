const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contractRoutes = require('./routes/contracts');
const walletRoutes = require('./routes/wallet');
const { seedTestUsers } = require('./controllers/seedData');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/contracts', express.static(path.join(__dirname, 'contracts')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/krishisetu')
  .then(() => {
    console.log('MongoDB connected');
    // Seed test users
    seedTestUsers();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/wallet', walletRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'KrishiSetu API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});