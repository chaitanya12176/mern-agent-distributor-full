const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const tokenFor = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = tokenFor(user._id);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));

module.exports = router;
