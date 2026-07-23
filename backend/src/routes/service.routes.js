// backend/src/routes/service.routes.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const Service = require('../models/Service');
const User = require('../models/User');

// Create service (provider only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only providers can create services' });
    }
    
    const { name, description, price, duration, category } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    
    const service = new Service({
      provider: req.user._id,
      name,
      description,
      price,
      duration,
      category
    });
    
    await service.save();
    
    res.status(201).json({
      service,
      message: 'Service created successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
});

// Get all services
router.get('/', async (req, res) => {
  try {
    const { category, providerId, minPrice, maxPrice } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (providerId) query.provider = providerId;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    const services = await Service.find(query)
      .populate('provider', 'firstName lastName providerProfile.businessName providerProfile.averageRating')
      .sort({ createdAt: -1 });
    
    res.json({ services });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'firstName lastName email phone providerProfile.businessName providerProfile.averageRating providerProfile.totalReviews');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ service });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
});

// Update service (provider only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only providers can update services' });
    }
    
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check if provider owns this service
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own services' });
    }
    
    const allowedUpdates = ['name', 'description', 'price', 'duration', 'category', 'isActive'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    res.json({
      service: updatedService,
      message: 'Service updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
});

// Delete service (provider only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only providers can delete services' });
    }
    
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check if provider owns this service
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own services' });
    }
    
    await service.deleteOne();
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
});
router.get('/', (req, res) => res.json({ message: 'Service routes - coming soon' }));
module.exports = router;

module.exports = router;