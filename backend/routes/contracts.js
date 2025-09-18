const express = require('express');
const path = require('path');
const fs = require('fs');
const Contract = require('../models/Contract');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { generateContractPDF } = require('../utils/pdfGenerator');

const router = express.Router();

// Create contract (Both farmer and buyer)
router.post('/create', auth, async (req, res) => {
  try {
    const { 
      cropType, quantity, unit, price, deliveryDate, terms, category, variety,
      deliveryLocation, equipmentSupport, qualityParameters, proposedTo
    } = req.body;

    // Process equipment support data
    const processedEquipmentSupport = {
      required: equipmentSupport?.required === 'on' || equipmentSupport?.required === true || equipmentSupport?.required === 'true',
      items: equipmentSupport?.items || [],
      providedBy: equipmentSupport?.providedBy || 'buyer',
      cost: equipmentSupport?.cost ? Number(equipmentSupport.cost) : 0,
      details: equipmentSupport?.details || ''
    };

    // Process delivery location
    const processedDeliveryLocation = {
      address: deliveryLocation?.address || '',
      city: deliveryLocation?.city || '',
      state: deliveryLocation?.state || 'Maharashtra',
      pincode: deliveryLocation?.pincode || ''
    };

    // Process quality parameters
    const processedQualityParameters = {
      specifications: qualityParameters?.specifications || '',
      gradingCriteria: qualityParameters?.gradingCriteria || '',
      rejectionCriteria: qualityParameters?.rejectionCriteria || ''
    };

    const contractData = {
      cropType,
      category: category || 'crops',
      variety: variety || '',
      quantity: Number(quantity),
      unit: unit || 'kg',
      price: Number(price),
      deliveryDate: new Date(deliveryDate),
      deliveryLocation: processedDeliveryLocation,
      terms: terms || 'Standard contract terms and conditions apply.',
      proposedBy: req.user.role,
      equipmentSupport: processedEquipmentSupport,
      qualityParameters: processedQualityParameters
    };

    if (req.user.role === 'farmer') {
      contractData.farmerId = req.user._id;
      contractData.status = 'Pending'; // Farmer contracts start as Pending
      if (proposedTo) {
        contractData.buyerId = proposedTo;
        contractData.status = 'Negotiating';
      }
    } else if (req.user.role === 'buyer') {
      // Buyer proposals - create as pending for any farmer to accept
      contractData.buyerId = req.user._id;
      contractData.status = 'Pending'; // Buyer proposals also start as Pending
      contractData.proposedBy = 'buyer';
      if (proposedTo) {
        contractData.farmerId = proposedTo;
        contractData.status = 'Negotiating';
      }
    }

    const contract = new Contract(contractData);
    await contract.save();
    
    await contract.populate('farmerId', 'username email ratings');
    await contract.populate('buyerId', 'username email ratings');

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
      contracts = await Contract.find({ 
        $or: [
          { farmerId: req.user._id }, // Contracts created by this farmer
          { farmerId: null, status: 'Pending', proposedBy: 'buyer' } // Buyer proposals available to farmers
        ]
      })
        .populate('buyerId', 'username email')
        .sort({ createdAt: -1 });
    } else {
      contracts = await Contract.find({ 
        $or: [
          { buyerId: req.user._id }, // Contracts owned by this buyer
          { farmerId: { $exists: true }, status: 'Pending', proposedBy: 'farmer' } // Farmer contracts available to buyers
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

// Digital sign contract
router.post('/sign/:id', auth, async (req, res) => {
  try {
    const { signatureData } = req.body;
    
    const contract = await Contract.findById(req.params.id)
      .populate('farmerId', 'username email')
      .populate('buyerId', 'username email');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check if user is authorized to sign
    const isFarmer = contract.farmerId._id.toString() === req.user._id.toString();
    const isBuyer = contract.buyerId ? 
      contract.buyerId._id.toString() === req.user._id.toString() : 
      req.user.role === 'buyer'; // Allow any buyer to sign pending contracts
    
    if (!isFarmer && !isBuyer) {
      return res.status(403).json({ message: 'Not authorized to sign this contract' });
    }

    // If buyer is signing a pending contract, assign them to the contract
    if (req.user.role === 'buyer' && !contract.buyerId) {
      contract.buyerId = req.user._id;
      await contract.populate('buyerId', 'username email');
    }

    // Update digital signature
    if (isFarmer) {
      contract.digitalSignatures.farmer = {
        signed: true,
        signedAt: new Date(),
        signatureData: signatureData,
        ipAddress: req.ip
      };
    } else {
      contract.digitalSignatures.buyer = {
        signed: true,
        signedAt: new Date(),
        signatureData: signatureData,
        ipAddress: req.ip
      };
    }

    // Handle contract status based on who is signing
    if (isBuyer && contract.status === 'Pending') {
      // Buyer is purchasing the contract
      const buyer = await User.findById(req.user._id);
      const contractValue = contract.quantity * contract.price;

      if (buyer.walletBalance < contractValue) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }

      // Lock funds when buyer signs
      buyer.walletBalance -= contractValue;
      await buyer.save();

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

      contract.status = 'Signed'; // Change status to Signed when buyer purchases
      contract.signedDate = new Date();
    }

    // Check if both parties have signed (for future use)
    const bothSigned = contract.digitalSignatures.farmer.signed && 
                      contract.digitalSignatures.buyer.signed;

    // Generate PDF contract if both signed
    if (bothSigned) {
      const pdfPath = await generateContractPDF(contract, contract.buyerId, contract.farmerId);
      contract.contractFile = pdfPath;
    }

    await contract.save();

    res.json({
      message: 'Contract signed successfully',
      contract,
      bothSigned
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

// Generate PDF contract
router.get('/pdf/:id', auth, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('farmerId', 'username email profile')
      .populate('buyerId', 'username email profile');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check if user has access to this contract
    const hasAccess = contract.farmerId._id.toString() === req.user._id.toString() ||
                     (contract.buyerId && contract.buyerId._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate PDF if not already generated or if contract has been updated
    if (!contract.contractFile || contract.status === 'Signed') {
      const pdfPath = await generateContractPDF(contract, contract.buyerId, contract.farmerId);
      contract.contractFile = pdfPath;
      await contract.save();
    }

    // Send PDF file
    const filepath = path.join(__dirname, '..', contract.contractFile);
    if (fs.existsSync(filepath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="contract-${contract._id}.pdf"`);
      res.sendFile(filepath);
    } else {
      res.status(404).json({ message: 'PDF file not found' });
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Server error generating PDF' });
  }
});

// Download contract PDF
router.get('/download/:id', auth, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('farmerId', 'username email profile')
      .populate('buyerId', 'username email profile');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check if user has access to this contract
    const hasAccess = contract.farmerId._id.toString() === req.user._id.toString() ||
                     (contract.buyerId && contract.buyerId._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate fresh PDF
    const pdfPath = await generateContractPDF(contract, contract.buyerId, contract.farmerId);
    contract.contractFile = pdfPath;
    await contract.save();

    res.json({
      message: 'PDF generated successfully',
      downloadUrl: `http://localhost:5000${pdfPath}`,
      contractFile: pdfPath
    });
  } catch (error) {
    console.error('PDF download error:', error);
    res.status(500).json({ message: 'Server error generating PDF' });
  }
});

// Serve PDF files directly
router.get('/pdf/:id', auth, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check if user has access to this contract
    const hasAccess = contract.farmerId.toString() === req.user._id.toString() ||
                     (contract.buyerId && contract.buyerId.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!contract.contractFile) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    const filePath = path.join(__dirname, '../../public', contract.contractFile);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'PDF file not found on server' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="contract-${contract._id}.pdf"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('PDF serve error:', error);
    res.status(500).json({ message: 'Server error serving PDF' });
  }
});

module.exports = router;