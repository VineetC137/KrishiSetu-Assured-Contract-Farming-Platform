const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  stage: {
    type: String,
    enum: [
      'Land Preparation',
      'Sowing/Planting',
      'Germination',
      'Vegetative Growth',
      'Flowering/Breeding',
      'Fruit Development/Maturation',
      'Harvesting',
      'Post-Harvest Processing'
    ],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: String,
  isCompleted: {
    type: Boolean,
    default: false
  },
  completionDate: Date,
  expectedDate: Date,
  notes: String
});

const contractSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  proposedBy: {
    type: String,
    enum: ['farmer', 'buyer'],
    required: true
  },
  category: {
    type: String,
    enum: ['crops', 'livestock', 'dairy', 'poultry'],
    required: true
  },
  cropType: {
    type: String,
    required: true
  },
  variety: String,
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['kg', 'quintal', 'ton', 'pieces', 'liters'],
    default: 'kg'
  },
  price: {
    type: Number,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  deliveryLocation: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Negotiating', 'Signed', 'In-progress', 'Completed', 'Cancelled', 'Rejected'],
    default: 'Pending'
  },
  contractFile: String,
  milestones: [milestoneSchema],
  paymentReleased: {
    type: Boolean,
    default: false
  },
  signedDate: Date,
  completedDate: Date,
  terms: {
    type: String,
    default: 'Standard contract terms and conditions apply.'
  },
  equipmentSupport: {
    required: { type: Boolean, default: false },
    items: [{
      type: String,
      enum: ['seeds', 'fertilizers', 'pesticides', 'equipment', 'irrigation', 'other']
    }],
    providedBy: {
      type: String,
      enum: ['buyer', 'third-party', 'farmer']
    },
    cost: Number,
    details: String
  },
  digitalSignatures: {
    farmer: {
      signed: { type: Boolean, default: false },
      signedAt: Date,
      signatureData: String,
      ipAddress: String
    },
    buyer: {
      signed: { type: Boolean, default: false },
      signedAt: Date,
      signatureData: String,
      ipAddress: String
    }
  },
  negotiationHistory: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    proposedChanges: {
      price: Number,
      quantity: Number,
      deliveryDate: Date,
      terms: String
    },
    createdAt: { type: Date, default: Date.now }
  }],
  qualityParameters: {
    specifications: String,
    gradingCriteria: String,
    rejectionCriteria: String
  }
}, {
  timestamps: true
});

// Calculate total contract value
contractSchema.virtual('totalValue').get(function() {
  return this.quantity * this.price;
});

// Check if all milestones are completed
contractSchema.methods.areAllMilestonesCompleted = function() {
  return this.milestones.length > 0 && this.milestones.every(milestone => milestone.isCompleted);
};

module.exports = mongoose.model('Contract', contractSchema);