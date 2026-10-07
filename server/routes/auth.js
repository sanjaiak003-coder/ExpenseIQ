const express = require('express');
const jwt = require('jsonwebtoken');
const store = require('../store');
const auth = require('../middleware/auth');

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'expense_tracker_jwt_secret_key_2024', { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await store.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await store.createUser({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await store.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await store.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  res.json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
});

module.exports = router;