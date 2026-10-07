const express = require('express');
const store = require('../store');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// GET /api/transactions
router.get('/', async (req, res) => {
  try {
    const { type, category, month, year, limit = 50, page = 1 } = req.query;
    const result = await store.getTransactions(req.user._id, { type, category, month, year, page, limit });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    if (!type || !amount || !category) {
      return res.status(400).json({ message: 'Type, amount, and category are required' });
    }
    const transaction = await store.createTransaction(req.user._id, { type, amount, category, description, date });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const transaction = await store.updateTransaction(req.user._id, req.params.id, { type, amount, category, description, date });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await store.deleteTransaction(req.user._id, req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;