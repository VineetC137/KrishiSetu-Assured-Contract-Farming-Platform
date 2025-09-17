const express = require('express');
const { maharashtraCrops, milestoneStages } = require('../data/cropData');

const router = express.Router();

// Get crop categories and types
router.get('/crops', (req, res) => {
  try {
    res.json(maharashtraCrops);
  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({ message: 'Server error fetching crop data' });
  }
});

// Get milestone stages for category
router.get('/milestones/:category', (req, res) => {
  try {
    const { category } = req.params;
    const stages = milestoneStages[category] || milestoneStages.crops;
    res.json({ stages });
  } catch (error) {
    console.error('Get milestones error:', error);
    res.status(500).json({ message: 'Server error fetching milestone data' });
  }
});

// Get payment methods
router.get('/payment-methods', (req, res) => {
  try {
    const paymentMethods = {
      digital: [
        { id: 'upi', name: 'UPI', icon: 'smartphone', description: 'Pay using UPI ID' },
        { id: 'netbanking', name: 'Net Banking', icon: 'globe', description: 'Internet Banking' },
        { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card', description: 'Visa, Mastercard, RuPay' }
      ],
      bank_transfer: [
        { id: 'rtgs', name: 'RTGS', icon: 'building', description: 'Real Time Gross Settlement' },
        { id: 'neft', name: 'NEFT', icon: 'building', description: 'National Electronic Funds Transfer' },
        { id: 'imps', name: 'IMPS', icon: 'zap', description: 'Immediate Payment Service' }
      ],
      wallet: [
        { id: 'wallet', name: 'KrishiSetu Wallet', icon: 'wallet', description: 'Use wallet balance' }
      ],
      other: [
        { id: 'cash', name: 'Cash on Delivery', icon: 'dollar-sign', description: 'Pay in cash' }
      ]
    };
    
    res.json(paymentMethods);
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Server error fetching payment methods' });
  }
});

module.exports = router;