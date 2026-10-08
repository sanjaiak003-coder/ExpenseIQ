const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const transactionRoutes = require('./routes/transactions');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: mongoose.connection.readyState === 1 ? 'mongodb' : 'in-memory-fallback',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/expense-tracker';

app.get('/', (req, res) => {
  res.send('ExpenseIQ Backend is running!');
});
// Start server immediately so API is never blocked
app.listen(PORT, () => {
  console.log(`🚀 ExpenseIQ Server running on http://localhost:${PORT}`);
});

// Attempt MongoDB connection in background
mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.log('ℹ️ MongoDB not detected. Running seamlessly in In-Memory / Demo mode.');
  });
