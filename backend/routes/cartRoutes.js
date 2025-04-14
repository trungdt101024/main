const express = require('express');
const router = express.Router();
const CartService = require('../services/CartService');
const auth = require('../middleware/auth');

// Get user cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await CartService.getCart(req.user._id);
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await CartService.addToCart(req.user._id, productId, quantity);
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update item quantity
router.put('/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await CartService.updateQuantity(req.user._id, productId, quantity);
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await CartService.removeItem(req.user._id, productId);
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear cart
router.delete('/', auth, async (req, res) => {
  try {
    await CartService.clearUserCart(req.user._id);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;