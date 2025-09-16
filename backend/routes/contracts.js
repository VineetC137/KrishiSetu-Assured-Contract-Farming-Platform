const express = require('express');
const Contract = require('../models/Contract');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { generateContractPDF } = require('../utils/pdfGenerator');

const router = express.Router();

// Create contract (Farmer only)
router.post('/create', auth, authorize('farmer'), async (req, res) => {
  try {
    const { cropType, quantity, price, deliveryDate, terms } = req.body;

    const contract = new Contract({
      farmerId: req.user._id,
      cropType,
      quantity,
      price,
      deliveryDate: new Date(deliveryDate),
      terms: terms || 'Standard contract terms and conditions apply.'
    });

    await contract.save();
    await contract.populate('farmerId', 'username email');

    res.status(201).json({
      message: 'Contract created successfully',
      contract
    });
  } catch (error) {
    console.error('Create contract error:', error);
    res.status(500).json({ message: 'Server error creating contract' });
  }
});

// Get contracts for current user
router.get('/my-contracts', auth, async (req, res) => {
  try {
    let contracts;
    
    if (req.user.role === 'farmer') {
      contracts = await Contract.find({ farmerId: req.user._id })
        .populate('buyerId', 'username email')
        .sort({ createdAt: -1 });
    } else {
      contracts = await Contract.find({ 
        $or: [
          { buyerId: req.user._id },
          { buyerId: null, status: 'Pending' } // Available contracts for buyers
        ]
      })
        .populate('farmerId', 'username email')
        .populate('buyerId', 'username email')
        .sort({ createdAt: -1 });
    }

    res.json(contracts);
  } catch (error) {
    console.error('Get contracts error:', error);
    res.status(500).json({ message: 'Server error fetching contracts' });
  }
});

// Get contract by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('farmerId', 'username email profile')
      .populate('buyerId', 'username email profile');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check if user has access to this contract
    const hasAccess = contract.farmerId._id.toString() === req.user._id.toString() ||
                     (contract.buyerId && contract.buyerId._id.toString() === req.user._id.toString()) ||
                     (req.user.role === 'buyer' && contract.status === 'Pending');

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(contract);
  } catch (error) {
    console.error('Get contract error:', error);
    res.status(500).json({ message: 'Server error fetching contract' });
  }
});

// Sign contract (Buyer only)
router.post('/sign/:id', auth, authorize('buyer'), async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('farmerId', 'username email');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.status !== 'Pending') {
      return res.status(400).json({ message: 'Contract is not available for signing' });
    }

    // Check buyer's wallet balance
    const buyer = await User.findById(req.user._id);
    const contractValue = contract.quantity * contract.price;

    if (buyer.walletBalance < contractValue) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Lock funds in buyer's wallet
    buyer.walletBalance -= contractValue;
    await buyer.save();

    // Update contract
    contract.buyerId = req.user._id;
    contract.status = 'Signed';
    contract.signedDate = new Date();

    // Generate PDF contract
    const pdfPath = await generateContractPDF(contract, buyer, contract.farmerId);
    contract.contractFile = pdfPath;

    await contract.save();

    // Create transaction record
    const transaction = new Transaction({
      contractId: contract._id,
      buyerId: req.user._id,
      farmerId: contract.farmerId._id,
      amount: contractValue,
      type: 'Lock',
      status: 'Completed',
      description: `Funds locked for contract ${contract._id}`
    });
    await transaction.save();

    await contract.populate('buyerId', 'username email');

    res.json({
      message: 'Contract signed successfully',
      contract
    });
  } catch (error) {
    console.error('Sign contract error:', error);
    res.status(500).json({ message: 'Server error signing contract' });
  }
});

// Add milestone (Farmer only)
router.post('/milestone/:id', auth, authorize('farmer'), upload.single('image'), async (req, res) => {
  try {
    const { description } = req.body;
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (contract.status !== 'Signed' && contract.status !== 'In-progress') {
      return res.status(400).json({ message: 'Contract must be signed to add milestones' });
    }

    const milestone = {
      description,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      isCompleted: true,
      completionDate: new Date()
    };

    contract.milestones.push(milestone);
    contract.status = 'In-progress';
    await contract.save();

    res.json({
      message: 'Milestone added successfully',
      milestone: contract.milestones[contract.milestones.length - 1]
    });
  } catch (error) {
    console.error('Add milestone error:', error);
    res.status(500).json({ message: 'Server error adding milestone' });
  }
});

// Complete contract (Farmer only)
router.post('/complete/:id', auth, authorize('farmer'), async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('buyerId', 'username email')
      .populate('farmerId', 'username email');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.farmerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (contract.status !== 'In-progress') {
      return res.status(400).json({ message: 'Contract must be in progress to complete' });
    }

    if (contract.milestones.length === 0) {
      return res.status(400).json({ message: 'At least one milestone is required to complete contract' });
    }

    // Release payment to farmer
    const contractValue = contract.quantity * contract.price;
    const farmer = await User.findById(contract.farmerId._id);
    farmer.walletBalance += contractValue;
    await farmer.save();

    // Update contract
    contract.status = 'Completed';
    contract.paymentReleased = true;
    contract.completedDate = new Date();
    await contract.save();

    // Create transaction record
    const transaction = new Transaction({
      contractId: contract._id,
      buyerId: contract.buyerId._id,
      farmerId: contract.farmerId._id,
      amount: contractValue,
      type: 'Release',
      status: 'Completed',
      description: `Payment released for completed contract ${contract._id}`
    });
    await transaction.save();

    res.json({
      message: 'Contract completed and payment released',
      contract
    });
  } catch (error) {
    console.error('Complete contract error:', error);
    res.status(500).json({ message: 'Server error completing contract' });
  }
});

module.exports = router;