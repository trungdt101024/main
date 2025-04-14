const StatisticsService = require('../services/StatisticsService');
const OrderService = require('../services/OrderService');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// Get dashboard statistics
const getDashboardData = async (req, res) => {
  try {
    const stats = await StatisticsService.getDashboardStatistics();
    
    // Get additional data
    const userCount = await User.countDocuments({ role: 'user' });
    const productCount = await Product.countDocuments();
    
    res.json({
      ...stats,
      userCount,
      productCount
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// Get revenue statistics
const getRevenueStatistics = async (req, res) => {
  try {
    const { timeRange = 'week' } = req.query;
    
    // Validate timeRange to prevent injection
    const validTimeRanges = ['day', 'week', 'month', 'year'];
    const validatedTimeRange = validTimeRanges.includes(timeRange) ? timeRange : 'week';
    
    const stats = await StatisticsService.getRevenueStatistics(validatedTimeRange);
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching revenue statistics:', error);
    res.status(500).json({ error: 'Failed to fetch revenue statistics' });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    // Validate status to prevent injection
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const order = await OrderService.updateOrderStatus(orderId, status);
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    // Validate status to prevent injection
    const validStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    // Find the order first
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Update payment status
    order.paymentStatus = status;
    
    // If payment is completed, automatically update order status to PROCESSING if it's PENDING
    if (status === 'COMPLETED' && order.orderStatus === 'PENDING') {
      order.orderStatus = 'PROCESSING';
    }
    
    await order.save();
    
    res.json(order);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};

module.exports = {
  getDashboardData,
  getRevenueStatistics,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus
};