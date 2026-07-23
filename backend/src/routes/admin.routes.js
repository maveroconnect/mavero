// backend/src/routes/admin.routes.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Apply admin middleware to all routes
router.use(auth, isAdmin);

// Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalProviders,
      totalClients,
      totalBookings,
      pendingBookings,
      totalServices,
      activeServices,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'provider' }),
      User.countDocuments({ role: 'client' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Service.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Booking.aggregate([
        { $match: { status: 'completed', paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      stats: {
        totalUsers,
        totalProviders,
        totalClients,
        totalBookings,
        pendingBookings,
        totalServices,
        activeServices,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Get all users with filters
router.get('/users', async (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -walletPin')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -walletPin')
      .populate('providerProfile.services');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update user (admin)
router.put('/users/:id', async (req, res) => {
  try {
    const { role, isActive, isVerified } = req.body;
    
    const updates = {};
    if (role) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;
    if (isVerified !== undefined) updates.isVerified = isVerified;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -walletPin');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Delete user (admin)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Also delete user's bookings and services
    await Promise.all([
      Booking.deleteMany({ $or: [{ client: req.params.id }, { provider: req.params.id }] }),
      Service.deleteMany({ provider: req.params.id })
    ]);
    
    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Get all bookings (admin)
router.get('/bookings', async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('client', 'firstName lastName email phone')
        .populate('provider', 'firstName lastName email phone providerProfile.businessName')
        .populate('service', 'name price duration')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(query)
    ]);
    
    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Get all services (admin)
router.get('/services', async (req, res) => {
  try {
    const { isActive, category, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (category) query.category = category;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('provider', 'firstName lastName email providerProfile.businessName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Service.countDocuments(query)
    ]);
    
    res.json({
      services,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// Update service (admin)
router.put('/services/:id', async (req, res) => {
  try {
    const { isActive, price, duration } = req.body;
    
    const updates = {};
    if (isActive !== undefined) updates.isActive = isActive;
    if (price) updates.price = price;
    if (duration) updates.duration = duration;
    
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('provider', 'firstName lastName email providerProfile.businessName');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({
      service,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
});

// Delete service (admin)
router.delete('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
});

// Get pending provider verifications
router.get('/verifications/pending', async (req, res) => {
  try {
    const providers = await User.find({
      role: 'provider',
      'providerProfile.vettingStatus': 'pending'
    })
    .select('-password -walletPin')
    .sort({ createdAt: 1 });
    
    res.json({ providers });
  } catch (error) {
    console.error('Get pending verifications error:', error);
    res.status(500).json({ message: 'Error fetching pending verifications', error: error.message });
  }
});

// Verify provider
router.put('/verifications/:providerId', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }
    
    const provider = await User.findOneAndUpdate(
      { _id: req.params.providerId, role: 'provider' },
      {
        'providerProfile.vettingStatus': status,
        'providerProfile.vettingNotes': notes || '',
        'providerProfile.vettingDate': new Date(),
        'providerProfile.vettedBy': req.user._id
      },
      { new: true, runValidators: true }
    ).select('-password -walletPin');
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    res.json({
      provider,
      message: `Provider ${status} successfully`
    });
  } catch (error) {
    console.error('Verify provider error:', error);
    res.status(500).json({ message: 'Error verifying provider', error: error.message });
  }
});

module.exports = router;