const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI missing');
    process.exit(1);
  }
  try {
    // Removed deprecated options
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (e) {
    console.error('Mongo error', e);
    process.exit(1);
  }
};

module.exports = connectDB;