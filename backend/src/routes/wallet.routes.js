// backend/src/routes/wallet.routes.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const Wallet = require('../models/Wallet');

// Get wallet balance
router.get('/balance', auth, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });
    
    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = new Wallet({ user: req.user._id });
      await wallet.save();
    }
    
    res.json({
      balance: wallet.balance,
      currency: wallet.currency,
      walletId: wallet._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wallet balance', error: error.message });
  }
});

// Fund wallet
router.post('/fund', auth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    let wallet = await Wallet.findOne({ user: req.user._id });
    
    if (!wallet) {
      wallet = new Wallet({ user: req.user._id });
      await wallet.save();
    }
    
    // Add transaction
    wallet.transactions.push({
      type: 'credit',
      amount: amount,
      description: `Wallet funding via ${paymentMethod || 'bank transfer'}`,
      status: 'completed'
    });
    
    wallet.balance += amount;
    await wallet.save();
    
    res.json({
      balance: wallet.balance,
      transaction: wallet.transactions[wallet.transactions.length - 1],
      message: 'Wallet funded successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error funding wallet', error: error.message });
  }
});

// Withdraw from wallet
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, bankDetails } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    const wallet = await Wallet.findOne({ user: req.user._id });
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    
    if (wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Add withdrawal transaction
    wallet.transactions.push({
      type: 'debit',
      amount: amount,
      description: `Withdrawal to ${bankDetails?.bankName || 'bank account'}`,
      status: 'pending'
    });
    
    wallet.balance -= amount;
    await wallet.save();
    
    res.json({
      balance: wallet.balance,
      transaction: wallet.transactions[wallet.transactions.length - 1],
      message: 'Withdrawal request submitted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing withdrawal', error: error.message });
  }
});

// Get transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    
    if (!wallet) {
      return res.json({ transactions: [] });
    }
    
    // Sort transactions by date (newest first)
    const transactions = wallet.transactions.sort((a, b) => 
      b.createdAt - a.createdAt
    );
    
    res.json({
      transactions,
      total: transactions.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

// Set wallet PIN
router.post('/set-pin', auth, async (req, res) => {
  try {
    const { pin } = req.body;
    
    if (!pin || pin.length < 4) {
      return res.status(400).json({ message: 'PIN must be at least 4 digits' });
    }
    
    const user = await User.findById(req.user._id);
    user.walletPin = pin;
    await user.save();
    
    res.json({ message: 'Wallet PIN set successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error setting wallet PIN', error: error.message });
  }
});
router.get('/', (req, res) => res.json({ message: 'Wallet routes - coming soon' }));
module.exports = router;

module.exports = router;