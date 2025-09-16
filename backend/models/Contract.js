const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  imageUrl: String,
  isCompleted: {
    type: Boolean,
    default: false
  },
  completionDate: Date
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
  cropType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Signed', 'In-progress', 'Completed', 'Cancelled'],
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