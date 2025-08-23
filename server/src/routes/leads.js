const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect, adminOnly } = require('../middleware/auth');
const Lead = require('../models/Lead');

const router = express.Router();

// Admin: list leads (optionally filter)
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const { agentId, batchId } = req.query;
  const filter = {};
  if (agentId) filter.agent = agentId;
  if (batchId) filter.batchId = batchId;
  const leads = await Lead.find(filter)
    .populate('agent', 'name email')
    .sort({ createdAt: -1 });
  res.json(leads);
}));

// Agent: my leads
router.get('/mine', protect, asyncHandler(async (req, res) => {
  if (req.user.role !== 'agent') return res.status(403).json({ message: 'Agents only' });
  const leads = await Lead.find({ agent: req.user._id }).sort({ createdAt: -1 });
  res.json(leads);
}));

// Admin: leads for one agent
router.get('/agent/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const leads = await Lead.find({ agent: req.params.id }).sort({ createdAt: -1 });
  res.json(leads);
}));

// ✅ Admin: delete a lead
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found' });

  await lead.deleteOne();
  res.json({ message: 'Lead deleted successfully' });
}));

module.exports = router;
