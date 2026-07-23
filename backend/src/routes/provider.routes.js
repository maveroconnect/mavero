// backend/src/routes/provider.routes.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get all providers
router.get('/', auth, async (req, res) => {
  try {
    const { category, minRating, maxDistance, lat, lng } = req.query;
    
    let query = { role: 'provider', isActive: true };
    
    // Filter by category
    if (category) {
      query['providerProfile.categories'] = category;
    }
    
    // Filter by minimum rating
    if (minRating) {
      query['providerProfile.averageRating'] = { $gte: parseFloat(minRating) };
    }
    
    let providers = await User.find(query)
      .select('-password -walletPin')
      .sort({ 'providerProfile.averageRating': -1 });
    
    // Filter by distance if coordinates provided
    if (lat && lng && maxDistance) {
      providers = providers.filter(provider => {
        if (!provider.location || !provider.location.coordinates) return false;
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          provider.location.coordinates[1],
          provider.location.coordinates[0]
        );
        return distance <= parseFloat(maxDistance);
      });
    }
    
    res.json({ 
      providers,
      count: providers.length
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ message: 'Error fetching providers', error: error.message });
  }
});

// Get provider by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const provider = await User.findOne({ 
      _id: req.params.id, 
      role: 'provider' 
    }).select('-password -walletPin');
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    
    res.json({ provider });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching provider', error: error.message });
  }
});

// Update provider profile
router.put('/profile', auth, async (req, res) => {
  try {
    // Only providers can update provider profile
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only providers can update provider profile' });
    }
    
    const allowedFields = [
      'businessName',
      'businessDescription',
      'categories',
      'services',
      'serviceRadius',
      'yearsOfExperience',
      'workingHours'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[`providerProfile.${key}`] = req.body[key];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -walletPin');
    
    res.json({ 
      user, 
      message: 'Provider profile updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating provider profile', 
      error: error.message 
    });
  }
});

// Add service to provider
router.post('/services', auth, async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only providers can add services' });
    }
    
    const { name, description, price, duration } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    
    const user = await User.findById(req.user._id);
    user.providerProfile.services.push({ name, description, price, duration });
    await user.save();
    
    res.status(201).json({ 
      services: user.providerProfile.services,
      message: 'Service added successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error adding service', 
      error: error.message 
    });
  }
});

// Remove service from provider
router.delete('/services/:serviceIndex', auth, async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only providers can remove services' });
    }
    
    const user = await User.findById(req.user._id);
    const index = parseInt(req.params.serviceIndex);
    
    if (index < 0 || index >= user.providerProfile.services.length) {
      return res.status(400).json({ message: 'Invalid service index' });
    }
    
    user.providerProfile.services.splice(index, 1);
    await user.save();
    
    res.json({ 
      services: user.providerProfile.services,
      message: 'Service removed successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error removing service', 
      error: error.message 
    });
  }
});

// Update service
router.put('/services/:serviceIndex', auth, async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only providers can update services' });
    }
    
    const user = await User.findById(req.user._id);
    const index = parseInt(req.params.serviceIndex);
    
    if (index < 0 || index >= user.providerProfile.services.length) {
      return res.status(400).json({ message: 'Invalid service index' });
    }
    
    const { name, description, price, duration } = req.body;
    
    if (name) user.providerProfile.services[index].name = name;
    if (description) user.providerProfile.services[index].description = description;
    if (price) user.providerProfile.services[index].price = price;
    if (duration) user.providerProfile.services[index].duration = duration;
    
    await user.save();
    
    res.json({ 
      services: user.providerProfile.services,
      message: 'Service updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating service', 
      error: error.message 
    });
  }
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}
router.get('/', (req, res) => {
  res.json({ message: 'Provider routes - coming soon' });
});

module.exports = router;