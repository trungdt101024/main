const express = require('express');
const router = express.Router();
const OrderService = require('../services/OrderService');
const auth = require('../middleware/auth');

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await OrderService.getUserOrders(req.user._id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    
    // Check if order belongs to user or user is admin
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;