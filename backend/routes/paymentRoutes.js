const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Create VNPay payment
router.post('/create-vnpay', auth, paymentController.createVNPayPayment);

// VNPay return URL - no auth required as this is called by VNPay
router.get('/vnpay-return', paymentController.vnpayPaymentReturn);

// Create COD order
router.post('/create-cod', auth, paymentController.createCodOrder);

module.exports = router;