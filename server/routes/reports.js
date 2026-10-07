const express = require('express');
const store = require('../store');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// GET /api/reports/monthly
router.get('/monthly', async (req, res) => {
  try {
    const report = await store.getMonthlyReport(req.user._id, req.query.year);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/reports/by-category
router.get('/by-category', async (req, res) => {
  try {
    const breakdown = await store.getCategoryBreakdown(req.user._id, req.query.month, req.query.year, req.query.type || 'expense');
    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;