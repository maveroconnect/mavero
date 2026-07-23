// backend/src/routes/message.routes.js
const router = require('express').Router();  // <-- Only declare ONCE
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, content, type } = req.body;
    
    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }
    
    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }
    
    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content,
      type: type || 'text',
      read: false
    });
    
    await message.save();
    
    // Populate sender and receiver info
    await message.populate('sender', 'firstName lastName email profilePhoto');
    await message.populate('receiver', 'firstName lastName email profilePhoto');
    
    res.status(201).json({
      message,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Get conversations list
router.get('/conversations', auth, async (req, res) => {
  try {
    // Get all unique users the current user has messaged with
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    })
    .populate('sender', 'firstName lastName email profilePhoto')
    .populate('receiver', 'firstName lastName email profilePhoto')
    .sort({ createdAt: -1 });
    
    // Group messages by conversation partner
    const conversations = {};
    messages.forEach(msg => {
      const partnerId = msg.sender._id.toString() === req.user._id.toString() 
        ? msg.receiver._id.toString() 
        : msg.sender._id.toString();
      
      if (!conversations[partnerId]) {
        conversations[partnerId] = {
          partner: msg.sender._id.toString() === req.user._id.toString() 
            ? msg.receiver 
            : msg.sender,
          lastMessage: msg,
          unreadCount: 0
        };
      }
      
      // Count unread messages
      if (!msg.read && msg.receiver._id.toString() === req.user._id.toString()) {
        conversations[partnerId].unreadCount += 1;
      }
    });
    
    res.json({
      conversations: Object.values(conversations)
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
});

// Get messages with a specific user
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
    .populate('sender', 'firstName lastName email profilePhoto')
    .populate('receiver', 'firstName lastName email profilePhoto')
    .sort({ createdAt: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: req.user._id, read: false },
      { read: true }
    );
    
    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// Mark message as read
router.put('/:messageId/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Only receiver can mark as read
    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    message.read = true;
    await message.save();
    
    res.json({
      message: 'Message marked as read',
      data: message
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Error marking message as read', error: error.message });
  }
});

// Delete message
router.delete('/:messageId', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Only sender can delete their own message
    if (message.sender.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await message.deleteOne();
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false
    });
    
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Unread count error:', error);
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
});

module.exports = router;