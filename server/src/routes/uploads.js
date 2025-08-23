const express = require('express');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const XLSX = require('xlsx');
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const Lead = require('../models/Lead');
const UploadBatch = require('../models/UploadBatch');
const { distribute } = require('../utils/distribute');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const name = (file.originalname || '').toLowerCase();
    const ok = name.endsWith('.csv') || name.endsWith('.xls') || name.endsWith('.xlsx') || name.endsWith('.axls');
    if (ok) return cb(null, true);
    cb(new Error('Only csv, xls, xlsx files are allowed'));
  }
});

function validateRow(row) {
  const firstName = String(row.FirstName ?? row.firstname ?? row.first_name ?? '').trim();
  const notes = String(row.Notes ?? row.notes ?? '').trim();
  const phoneRaw = row.Phone ?? row.phone ?? row.mobile ?? row.Mobile ?? '';
  const phone = String(phoneRaw).replace(/[^\d+]/g, '');
  if (!firstName) return { error: 'FirstName is required' };
  if (!phone) return { error: 'Phone is required' };
  if (!/^\+?\d{7,15}$/.test(phone)) return { error: 'Phone must be 7-15 digits (optional +)' };
  return { firstName, phone, notes };
}

router.post('/', protect, adminOnly, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File is required' });

  const agents = await User.find({ role: 'agent' }).sort({ createdAt: 1 }).limit(5).select('_id name');
  if (agents.length < 5) return res.status(400).json({ message: 'Need at least 5 agents to distribute. Create more agents first.' });
  const agentIds = agents.map(a => String(a._id));

  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  if (!Array.isArray(rows) || rows.length === 0) return res.status(400).json({ message: 'Uploaded file is empty or unreadable' });

  const valid = [], errors = [];
  rows.forEach((row, i) => {
    const v = validateRow(row);
    if (v.error) errors.push({ row: i + 2, error: v.error }); else valid.push(v);
  });
  if (valid.length === 0) return res.status(400).json({ message: 'No valid rows found', errors });

  const assignment = distribute(valid, agentIds);
  const batch = await UploadBatch.create({ originalFilename: req.file.originalname, totalItems: valid.length, agentIds });

  const docs = [];
  for (const [agentId, items] of Object.entries(assignment)) {
    for (const item of items) {
      docs.push({ firstName: item.firstName, phone: item.phone, notes: item.notes, agent: agentId, batchId: batch._id });
    }
  }
  await Lead.insertMany(docs);

  const summary = agentIds.map((id, i) => ({ agentId: id, count: assignment[id]?.length || 0, index: i }));

  res.status(201).json({
    message: 'Upload processed successfully',
    batchId: batch._id,
    totalValid: valid.length,
    totalInvalid: errors.length,
    errors,
    distribution: summary
  });
}));

module.exports = router;
