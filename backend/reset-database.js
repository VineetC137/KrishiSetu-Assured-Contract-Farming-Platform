const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Contract = require('./models/Contract');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const { Message, ChatRoom } = require('./models/Chat');

async function resetDatabase() {
  try {
    console.log('🔄 Resetting KrishiSetu Database...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/krishisetu');
    console.log('✅ Connected to MongoDB');
    
    // Delete all data
    await Contract.deleteMany({});
    await Transaction.deleteMany({});
    await Message.deleteMany({});
    await ChatRoom.deleteMany({});
    await User.deleteMany({});
    
    console.log('🗑️  Cleared all existing data');
    
    // Create fresh test users (let the User model handle password hashing)
    const farmer = new User({
      username: 'Test Farmer',
      email: 'farmer@test.com',
      password: 'farmer123', // Plain text - will be hashed by pre-save hook
      role: 'farmer',
      walletBalance: 5000,
      profile: {
        phone: '9876543210',
        address: 'Test Farm, Mumbai'
      }
    });
    
    const buyer = new User({
      username: 'Test Buyer',
      email: 'buyer@test.com',
      password: 'buyer123', // Plain text - will be hashed by pre-save hook
      role: 'buyer',
      walletBalance: 50000,
      profile: {
        phone: '9876543211',
        address: 'Test Company, Mumbai'
      }
    });
    
    await farmer.save();
    await buyer.save();
    
    console.log('👥 Created fresh test users:');
    console.log('   Farmer: farmer@test.com / farmer123 (₹5,000)');
    console.log('   Buyer: buyer@test.com / buyer123 (₹50,000)');
    
    await mongoose.disconnect();
    console.log('\n🎉 Database reset complete!');
    console.log('\n🚀 Ready to start fresh:');
    console.log('   1. Run: start-dev.bat');
    console.log('   2. Access: http://localhost:3000');
    console.log('   3. Login with test accounts above');
    
  } catch (error) {
    console.error('❌ Reset failed:', error);
  }
}

resetDatabase();