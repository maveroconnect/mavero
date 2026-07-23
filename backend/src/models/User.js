// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['client', 'provider', 'admin'],
    default: 'client',
  },
  profilePhoto: {
    type: String,
    default: null,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'Nigeria' },
  },
  walletPin: {
    type: String,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Provider specific fields
  providerProfile: {
    businessName: String,
    businessDescription: String,
    categories: [String],
    services: [{
      name: String,
      description: String,
      price: Number,
      duration: Number, // in minutes
    }],
    serviceRadius: {
      type: Number,
      default: 10, // km
    },
    yearsOfExperience: Number,
    documents: {
      idCard: { url: String, verified: { type: Boolean, default: false } },
      license: { url: String, verified: { type: Boolean, default: false } },
      insurance: { url: String, verified: { type: Boolean, default: false } },
      backgroundConsent: { url: String, verified: { type: Boolean, default: false } },
    },
    vettingStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    vettingNotes: String,
    vettingDate: Date,
    vettedBy: mongoose.Schema.Types.ObjectId,
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredUntil: Date,
    workingHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String,
    },
  },
}, {
  timestamps: true,
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ location: '2dsphere' });
userSchema.index({ 'providerProfile.vettingStatus': 1 });
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Hash wallet PIN before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('walletPin') || !this.walletPin) return next();
  this.walletPin = await bcrypt.hash(this.walletPin, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Compare wallet PIN
userSchema.methods.compareWalletPin = async function(candidatePin) {
  if (!this.walletPin) return false;
  return await bcrypt.compare(candidatePin, this.walletPin);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);