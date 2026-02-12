const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
};

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const profile = await User.getProfile(req.userId);
    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Update user profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { allergies, goals, dietaryRestrictions } = req.body;

    const profile = await User.updateProfile(req.userId, {
      allergies,
      goals,
      dietaryRestrictions,
    });

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

module.exports = router;
