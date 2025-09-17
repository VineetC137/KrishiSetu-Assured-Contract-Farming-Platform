const User = require('../models/User');
const Contract = require('../models/Contract');

const seedTestUsers = async () => {
  try {
    // Check if test users already exist
    const existingFarmer = await User.findOne({ email: 'farmer@test.com' });
    const existingBuyer = await User.findOne({ email: 'buyer@test.com' });

    if (!existingFarmer) {
      const farmer = new User({
        username: 'RameshPatil',
        email: 'farmer@test.com',
        password: 'farmer123',
        role: 'farmer',
        profile: {
          fullName: 'Ramesh Patil',
          phone: '+91-9876543210',
          address: 'Village Shirdi, Ahmednagar District, Maharashtra',
          farmSize: '5 acres',
          state: 'Maharashtra',
          district: 'Ahmednagar',
          pincode: '423109'
        },
        ratings: {
          average: 4.5,
          count: 12
        }
      });
      await farmer.save();
      console.log('Test farmer created');
    }

    if (!existingBuyer) {
      const buyer = new User({
        username: 'AgriCorpLtd',
        email: 'buyer@test.com',
        password: 'buyer123',
        role: 'buyer',
        profile: {
          fullName: 'AgriCorp Limited',
          phone: '+91-9876543211',
          address: 'Pune, Maharashtra',
          businessType: 'Wholesale Trading & Processing',
          state: 'Maharashtra',
          district: 'Pune',
          pincode: '411001'
        },
        ratings: {
          average: 4.2,
          count: 8
        }
      });
      await buyer.save();
      console.log('Test buyer created');
    }

    // Create additional demo users
    const demoUsers = [
      {
        username: 'SunilSharma',
        email: 'sunil.farmer@demo.com',
        password: 'demo123',
        role: 'farmer',
        profile: {
          fullName: 'Sunil Sharma',
          phone: '+91-9876543212',
          address: 'Village Nashik, Maharashtra',
          farmSize: '3 acres',
          state: 'Maharashtra',
          district: 'Nashik'
        },
        ratings: { average: 4.8, count: 15 }
      },
      {
        username: 'FreshMart',
        email: 'freshmart@demo.com',
        password: 'demo123',
        role: 'buyer',
        profile: {
          fullName: 'FreshMart Pvt Ltd',
          phone: '+91-9876543213',
          address: 'Mumbai, Maharashtra',
          businessType: 'Retail Chain',
          state: 'Maharashtra',
          district: 'Mumbai'
        },
        ratings: { average: 4.0, count: 20 }
      }
    ];

    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`Demo user ${userData.username} created`);
      }
    }

    console.log('Test users setup complete');
  } catch (error) {
    console.error('Error seeding test users:', error);
  }
};

module.exports = { seedTestUsers };