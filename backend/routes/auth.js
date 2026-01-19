const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
    });

    const savedUser = await newUser.save();

    // Create JWT Token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        mobileNumber: savedUser.mobileNumber,
        pendingPayment: savedUser.pendingPayment
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

     // Create JWT Token
     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        pendingPayment: user.pendingPayment
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Google Login Route
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios'); // We need axios to call Google API
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
  try {
    const { token } = req.body;
    
    // With access_token from useGoogleLogin, we fetch user info directly
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
    });

    const { name, email, sub } = userInfoResponse.data;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
        // Create new user if not exists
        user = new User({
            name,
            email,
            googleId: sub,
            password: '', // No password for Google users
            mobileNumber: '',  // No phone initially
        });
        await user.save();
    } else if (!user.googleId) {
        // Link Google ID to existing account if missing
        user.googleId = sub;
        await user.save();
    }

    // Create JWT Token
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.status(200).json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        pendingPayment: user.pendingPayment
      }
    });

  } catch (error) {
    res.status(401).json({ message: 'Google Authentication failed', error: error.message });
  }
});

// Update Profile Route
const authMiddleware = require('../middleware/authMiddleware');

router.put('/update-profile', authMiddleware, async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    const userId = req.user.id;

    // Validate input (basic)
    if (!mobileNumber) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: { mobileNumber } },
        { new: true, runValidators: true }
    ).select('-password'); // Exclude password from result

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({
        message: 'Profile updated successfully',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            mobileNumber: user.mobileNumber
        }
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

module.exports = router;
