const User = require('../models/User');
const Contract = require('../models/Contract');

const seedTestUsers = async () => {
  try {
    // Check if test users already exist
    const existingFarmer = await User.findOne({ email: 'farmer@test.com' });
    const existingBuyer = await User.findOne({ email: 'buyer@test.com' });

    if (!existingFarmer) {
      const farmer = new User({
        username: 'TestFarmer',
        email: 'farmer@test.com',
        password: 'farmer123',
        role: 'farmer',
        profile: {
          fullName: 'Test Farmer',
          phone: '+91-9876543210',
          address: 'Village Test, District Test, State Test',
          farmSize: '5 acres'
        }
      });
      await farmer.save();
      console.log('Test farmer created');
    }

    if (!existingBuyer) {
      const buyer = new User({
        username: 'TestBuyer',
        email: 'buyer@test.com',
        password: 'buyer123',
        role: 'buyer',
        profile: {
          fullName: 'Test Buyer',
          phone: '+91-9876543211',
          address: 'City Test, State Test',
          businessType: 'Wholesale Trading'
        }
      });
      await buyer.save();
      console.log('Test buyer created');
    }

    console.log('Test users setup complete');
  } catch (error) {
    console.error('Error seeding test users:', error);
  }
};

module.exports = { seedTestUsers };