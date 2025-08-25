const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Create agent
router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const { name, email, mobile, password } = req.body;
  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(400).json({ message: 'Email already used' });

  const agent = await User.create({
    name,
    email: email.toLowerCase(),
    mobile,
    password,
    role: 'agent',
  });

  res.status(201).json({
    id: agent._id,
    name: agent.name,
    email: agent.email,
    mobile: agent.mobile,
    role: agent.role,
    createdAt: agent.createdAt,
  });
}));

// List agents
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const agents = await User.find({ role: 'agent' })
    .select('-password')
    .sort({ createdAt: 1 });
  res.json(agents);
}));

// Get agent (admin or self)
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (req.user.role !== 'admin' && String(req.user._id) !== id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const agent = await User.findById(id).select('-password');
  if (!agent) return res.status(404).json({ message: 'Agent not found' });

  res.json(agent);
}));

// Delete agent
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const id = req.params.id;
  const agent = await User.findById(id);

  if (!agent || agent.role !== 'agent') {
    return res.status(404).json({ message: 'Agent not found' });
  }

  await agent.deleteOne();
  res.json({ message: '✅ Agent deleted successfully' });
}));

module.exports = router;
