const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
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
  return `http://localhost:5000/uploads/${filename}`;
};

// Get all products with category details
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    // Transform image paths to include full URL
    const transformedProducts = products.map(product => {
      const productObj = product.toObject();
      if (productObj.image) {
        productObj.image = getFullImageUrl(productObj.image);
      }
      if (productObj.images && productObj.images.length > 0) {
        productObj.images = productObj.images.map(img => getFullImageUrl(img));
      }
      return productObj;
    });
    res.json(transformedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/category/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId })
      .populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Sau đó mới đến route có pattern chung
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Transform image paths to include full URL
    const productObj = product.toObject();
    if (productObj.image) {
      productObj.image = getFullImageUrl(productObj.image);
    }
    if (productObj.images && productObj.images.length > 0) {
      productObj.images = productObj.images.map(img => getFullImageUrl(img));
    }
    
    res.json(productObj);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});
  
// Create new product (admin only)
router.post('/', auth, adminAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), handleUploadError, async (req, res) => {
  try {
    const { name, description, price, category, countInStock } = req.body;
    
    // Get uploaded files
    const image = req.files['image'] ? req.files['image'][0].filename : '';
    const images = req.files['images'] ? req.files['images'].map(file => file.filename) : [];

    const product = new Product({
      name,
      description,
      price,
      image,
      images,
      category,
      countInStock
    });

    await product.save();
    
    // Transform response to include full image URLs
    const productObj = product.toObject();
    if (productObj.image) {
      productObj.image = getFullImageUrl(productObj.image);
    }
    if (productObj.images && productObj.images.length > 0) {
      productObj.images = productObj.images.map(img => getFullImageUrl(img));
    }
    
    res.status(201).json(productObj);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update product (admin only)
router.put('/:id', auth, adminAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), handleUploadError, async (req, res) => {
  try {
    const { name, description, price, category, countInStock } = req.body;
    
    // Get uploaded files
    const image = req.files['image'] ? req.files['image'][0].filename : undefined;
    const images = req.files['images'] ? req.files['images'].map(file => file.filename) : undefined;

    const updateData = {
      name,
      description,
      price,
      category,
      countInStock
    };

    if (image) updateData.image = image;
    if (images) updateData.images = images;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Transform response to include full image URLs
    const productObj = product.toObject();
    if (productObj.image) {
      productObj.image = getFullImageUrl(productObj.image);
    }
    if (productObj.images && productObj.images.length > 0) {
      productObj.images = productObj.images.map(img => getFullImageUrl(img));
    }

    res.json(productObj);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router; 