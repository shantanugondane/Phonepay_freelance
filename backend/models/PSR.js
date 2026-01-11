const mongoose = require('mongoose');

const psrSchema = new mongoose.Schema({
  psrId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  requestor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestorName: {
    type: String,
    required: true
  },
  requestorEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'in_progress'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  budget: {
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    display: {
      type: String // e.g., "INR 2.5M"
    }
  },
  category: {
    type: String,
    trim: true,
    default: ''
  },
  requestedDate: {
    type: Date,
    default: Date.now
  },
  approvedDate: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedDate: {
    type: Date
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  history: [{
    action: {
      type: String,
      required: true // e.g., 'created', 'submitted', 'approved', 'rejected', 'updated'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String
  }]
}, {
  timestamps: true
});

// Generate PSR ID before saving
psrSchema.pre('save', async function(next) {
  if (!this.psrId) {
    const count = await mongoose.model('PSR').countDocuments();
    this.psrId = `REQ-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// Indexes for better query performance
psrSchema.index({ requestor: 1, status: 1 });
psrSchema.index({ status: 1 });
psrSchema.index({ department: 1 });
psrSchema.index({ priority: 1 });
psrSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PSR', psrSchema);
