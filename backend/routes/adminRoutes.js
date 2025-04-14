const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Apply auth and admin middleware to all routes
router.use(auth, adminAuth);

// Dashboard data
router.get('/dashboard', adminController.getDashboardData);

// Revenue statistics
router.get('/revenue', adminController.getRevenueStatistics);

// Orders management
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:orderId/status', adminController.updateOrderStatus);
router.put('/orders/:orderId/payment-status', adminController.updatePaymentStatus);

module.exports = router;