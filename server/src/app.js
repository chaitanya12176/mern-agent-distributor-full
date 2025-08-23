const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agents');
const uploadRoutes = require('./routes/uploads');
const leadRoutes = require('./routes/leads');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.get('/', (req, res) => res.send({ status: 'ok', service: 'agent-distributor-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/leads', leadRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

// Start server after DB connection
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on :${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
