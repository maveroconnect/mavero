// backend/src/routes/booking.routes.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { providerId, serviceId, date, time, notes } = req.body;
    
    // Validate provider
    const provider = await User.findOne({ _id: providerId, role: 'provider' });
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    // Validate service (if serviceId provided)
    let service = null;
    if (serviceId) {
      service = await Service.findOne({ _id: serviceId, provider: providerId });
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
    }
    
    // Check for conflicting bookings
    const existingBooking = await Booking.findOne({
      provider: providerId,
      date: new Date(date),
      time: time,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingBooking) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }
    
    const booking = new Booking({
      client: req.user._id,
      provider: providerId,
      service: serviceId,
      date: new Date(date),
      time,
      notes,
      status: 'pending'
    });
    
    await booking.save();
    
    res.status(201).json({
      booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// Get my bookings (client)
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user._id })
      .populate('provider', 'firstName lastName email phone providerProfile.businessName')
      .populate('service', 'name description price duration')
      .sort({ createdAt: -1 });
    
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Get provider bookings
router.get('/provider-bookings', auth, async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only providers can view provider bookings' });
    }
    
    const bookings = await Booking.find({ provider: req.user._id })
      .populate('client', 'firstName lastName email phone')
      .populate('service', 'name description price duration')
      .sort({ createdAt: -1 });
    
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('client', 'firstName lastName email phone')
      .populate('provider', 'firstName lastName email phone providerProfile.businessName')
      .populate('service', 'name description price duration');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is authorized
    if (booking.client._id.toString() !== req.user._id.toString() && 
        booking.provider._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
});

// Update booking status (provider only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['confirmed', 'cancelled', 'completed'];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Only provider or admin can update status
    if (booking.provider.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    booking.status = status;
    await booking.save();
    
    res.json({
      booking,
      message: `Booking ${status} successfully`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});

// Cancel booking (client)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Only client who made booking can cancel
    if (booking.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only cancel your own bookings' });
    }
    
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    res.json({
      booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
});
router.get('/', (req, res) => res.json({ message: 'Booking routes - coming soon' }));
module.exports = router;

module.exports = router;