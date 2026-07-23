// backend/src/routes/upload.routes.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Local storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Upload single file
router.post('/single', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

// Upload multiple files
router.post('/multiple', auth, upload.array('files', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const files = req.files.map(file => ({
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype
    }));
    
    res.status(201).json({
      message: 'Files uploaded successfully',
      files
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
});

// Upload profile photo
router.post('/profile-photo', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }
    
    const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    // Update user's profile photo
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: photoUrl },
      { new: true }
    ).select('-password -walletPin');
    
    res.json({
      message: 'Profile photo updated successfully',
      profilePhoto: photoUrl,
      user
    });
  } catch (error) {
    console.error('Profile photo upload error:', error);
    res.status(500).json({ message: 'Error uploading profile photo', error: error.message });
  }
});

// Upload provider documents
router.post('/provider-documents', auth, upload.fields([
  { name: 'idCard', maxCount: 1 },
  { name: 'license', maxCount: 1 },
  { name: 'insurance', maxCount: 1 },
  { name: 'backgroundConsent', maxCount: 1 }
]), async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only providers can upload documents' });
    }
    
    const documents = {};
    const files = req.files;
    
    const getFileUrl = (file) => {
      return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    };
    
    if (files.idCard) {
      documents['providerProfile.documents.idCard'] = {
        url: getFileUrl(files.idCard[0]),
        verified: false
      };
    }
    if (files.license) {
      documents['providerProfile.documents.license'] = {
        url: getFileUrl(files.license[0]),
        verified: false
      };
    }
    if (files.insurance) {
      documents['providerProfile.documents.insurance'] = {
        url: getFileUrl(files.insurance[0]),
        verified: false
      };
    }
    if (files.backgroundConsent) {
      documents['providerProfile.documents.backgroundConsent'] = {
        url: getFileUrl(files.backgroundConsent[0]),
        verified: false
      };
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      documents,
      { new: true }
    ).select('-password -walletPin');
    
    res.json({
      message: 'Documents uploaded successfully',
      documents: user.providerProfile.documents,
      user
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ message: 'Error uploading documents', error: error.message });
  }
});

module.exports = router;