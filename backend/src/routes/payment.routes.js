// backend/src/routes/payment.routes.js
const router = require('express').Router();
const auth = require('../middleware/auth');

// Check if Stripe is configured
let stripe = null;
let stripeConfigured = false;

try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    stripeConfigured = true;
    console.log('✅ Stripe configured successfully');
  } else {
    console.log('⚠️ Stripe secret key not found. Payment routes will be disabled.');
  }
} catch (error) {
  console.log('⚠️ Stripe initialization failed:', error.message);
}

// Middleware to check if Stripe is configured
const requireStripe = (req, res, next) => {
  if (!stripeConfigured) {
    return res.status(503).json({
      success: false,
      message: 'Payment service is not configured. Please set STRIPE_SECRET_KEY in .env'
    });
  }
  next();
};

// Create payment intent
router.post('/create-payment-intent', auth, requireStripe, async (req, res) => {
  try {
    const { amount, currency, bookingId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || 'usd',
      metadata: {
        userId: req.user._id.toString(),
        bookingId: bookingId || 'none'
      }
    });
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating payment intent', 
      error: error.message 
    });
  }
});

// Confirm payment
router.post('/confirm-payment', auth, requireStripe, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Payment intent ID required' });
    }
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        success: false,
        message: 'Payment not successful',
        status: paymentIntent.status
      });
    }
    
    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      paymentIntent
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error confirming payment', 
      error: error.message 
    });
  }
});

// Get payment history (placeholder)
router.get('/history', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      payments: [],
      message: 'Payment history - implement your payment model'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching payment history', 
      error: error.message 
    });
  }
});

// Get Stripe status
router.get('/status', (req, res) => {
  res.json({
    configured: stripeConfigured,
    message: stripeConfigured ? 'Stripe is configured' : 'Stripe is not configured'
  });
});

module.exports = router;