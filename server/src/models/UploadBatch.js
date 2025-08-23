const mongoose = require('mongoose');

const uploadBatchSchema = new mongoose.Schema({
  originalFilename: { type: String },
  totalItems: { type: Number, default: 0 },
  agentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('UploadBatch', uploadBatchSchema);
