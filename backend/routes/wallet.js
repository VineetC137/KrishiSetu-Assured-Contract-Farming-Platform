const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get wallet balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('walletBalance');
    res.json({ balance: user.walletBalance });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Server error fetching balance' });
  }
});

// Add funds to wallet (dummy funding)
router.post('/fund', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (amount > 50000) {
      return res.status(400).json({ message: 'Maximum funding limit is ₹50,000' });
    }

    const user = await User.findById(req.user._id);
    user.walletBalance += amount;
    await user.save();

    res.json({
      message: 'Wallet funded successfully',
      newBalance: user.walletBalance,
      amountAdded: amount
    });
  } catch (error) {
    console.error('Fund wallet error:', error);
    res.status(500).json({ message: 'Server error funding wallet' });
  }
});

// Get transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { buyerId: req.user._id },
        { farmerId: req.user._id }
      ]
    })
      .populate('contractId', 'cropType quantity price')
      .populate('buyerId', 'username')
      .populate('farmerId', 'username')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error fetching transactions' });
  }
});

// Transfer funds (for contract payments)
router.post('/transfer/:contractId', auth, async (req, res) => {
  try {
    const { contractId } = req.params;
    const { amount, recipientId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const sender = await User.findById(req.user._id);
    const recipient = await User.findById(recipientId);

    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    if (sender.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Transfer funds
    sender.walletBalance -= amount;
    recipient.walletBalance += amount;

    await sender.save();
    await recipient.save();

    // Create transaction records
    const debitTransaction = new Transaction({
      contractId,
      buyerId: req.user._id,
      farmerId: recipientId,
      amount,
      type: 'Debit',
      status: 'Completed',
      description: `Transfer to ${recipient.username}`
    });

    const creditTransaction = new Transaction({
      contractId,
      buyerId: req.user._id,
      farmerId: recipientId,
      amount,
      type: 'Credit',
      status: 'Completed',
      description: `Transfer from ${sender.username}`
    });

    await debitTransaction.save();
    await creditTransaction.save();

    res.json({
      message: 'Transfer completed successfully',
      senderBalance: sender.walletBalance,
      recipientBalance: recipient.walletBalance
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ message: 'Server error processing transfer' });
  }
});

module.exports = router;