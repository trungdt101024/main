const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { upload, handleUploadError } = require('../middleware/upload');
const path = require('path');

// Helper function to get full image URL
const getFullImageUrl = (filename) => {
  if (!filename) return '';
  // Check if the filename already has a full URL
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  // Add the server URL to the image path
  const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
  return `${serverUrl}/uploads/${filename}`;
};

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    // Transform image paths to include full URL
    const transformedCategories = categories.map(category => {
      const categoryObj = category.toObject();
      if (categoryObj.image) {
        categoryObj.image = getFullImageUrl(categoryObj.image);
      }
      return categoryObj;
    });
    res.json(transformedCategories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate category ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid category ID format' });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Transform image path to include full URL
    const categoryObj = category.toObject();
    if (categoryObj.image) {
      categoryObj.image = getFullImageUrl(categoryObj.image);
    }

    res.json(categoryObj);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create new category (admin only)
router.post('/', auth, adminAuth, upload.single('image'), handleUploadError, async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.filename : '';

    // Validate name
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = new Category({ name, image });
    await category.save();
    
    // Transform response to include full image URL
    const categoryObj = category.toObject();
    if (categoryObj.image) {
      categoryObj.image = getFullImageUrl(categoryObj.image);
    }
    
    res.status(201).json(categoryObj);
  } catch (error) {
    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category (admin only)
router.put('/:id', auth, adminAuth, upload.single('image'), handleUploadError, async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.filename : undefined;

    // Validate name
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const updateData = { name };
    if (image) updateData.image = image;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Transform response to include full image URL
    const categoryObj = category.toObject();
    if (categoryObj.image) {
      categoryObj.image = getFullImageUrl(categoryObj.image);
    }

    res.json(categoryObj);
  } catch (error) {
    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
