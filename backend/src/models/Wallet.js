// backend/src/models/Wallet.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['deposit', 'hold', 'release', 'withdrawal', 'refund', 'commission'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    default: 0,
  },
  description: String,
  reference: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed',
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  paymentMethod: String,
  metadata: mongoose.Schema.Types.Mixed,
}, {
  timestamps: true,
});

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  pendingBalance: {
    type: Number,
    default: 0,
  },
  totalDeposited: {
    type: Number,
    default: 0,
  },
  totalWithdrawn: {
    type: Number,
    default: 0,
  },
  totalEarned: {
    type: Number,
    default: 0,
  },
  transactions: [transactionSchema],
}, {
  timestamps: true,
});

// Index
walletSchema.index({ user: 1 });
walletSchema.index({ 'transactions.createdAt': -1 });

module.exports = mongoose.model('Wallet', walletSchema);