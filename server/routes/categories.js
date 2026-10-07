const express = require('express');
const store = require('../store');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const categories = await store.getCategories(req.user._id, type);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }
    const category = await store.createCategory(req.user._id, { name, type, color, icon });
    res.status(201).json(category);
  } catch (error) {
    if (error.status === 400 || error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/categories/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    const category = await store.updateCategory(req.user._id, req.params.id, { name, color, icon });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    const category = await store.deleteCategory(req.user._id, req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category and related transactions deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;