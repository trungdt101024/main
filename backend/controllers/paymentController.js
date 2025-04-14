const OrderService = require('../services/OrderService');
const CartService = require('../services/CartService');
const StatisticsService = require('../services/StatisticsService');
const config = require('../config/default.json');
const crypto = require('crypto');
const querystring = require('querystring');

// Create VNPay payment URL
// Sửa hàm createVNPayPayment trong paymentController.js
// Create VNPay payment URL - hàm hoàn chỉnh đã được sửa
const createVNPayPayment = async (req, res) => {
  try {
    const { amount, customerInfo, orderDescription } = req.body;
    
    // Validate input data thoroughly
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount. Amount must be a positive number.' });
    }
    
    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return res.status(400).json({ error: 'Missing or incomplete customer information' });
    }
    
    // Create order first
    const userId = req.user._id;
    const cart = await CartService.getCart(userId);
    
    if (!cart.items || !cart.items.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Logging for debugging
    console.log('Creating order with data:', {
      userId,
      itemCount: cart.items.length,
      amount,
      customerInfo
    });
    
    const order = await OrderService.createOrder(
      userId,
      cart.items,
      amount,
      customerInfo,
      'vnpay'
    );
    
    // Create VNPay payment URL
    const date = new Date();
    const createDate = date.toISOString().split('T')[0].replace(/-/g, '') + 
                      date.toTimeString().split(' ')[0].replace(/:/g, '');
    
    // Ensure amount is an integer (VND has no decimals)
    const vnpAmount = Math.round(amount) * 100;
    
    // Định nghĩa các tham số VNPay
    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: config.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: order.reference,
      vnp_OrderInfo: orderDescription || `Payment for order ${order.reference}`,
      vnp_OrderType: 'other',
      vnp_Amount: vnpAmount,
      vnp_ReturnUrl: config.vnp_ReturnUrl,
      vnp_IpAddr: req.ip || '127.0.0.1',
      vnp_CreateDate: createDate
    };
    
    // Log the params for debugging
    console.log('VNPay Params:', vnpParams);
    
    // Sort params before signing
    const sortedParams = {};
    Object.keys(vnpParams).sort().forEach(key => {
      sortedParams[key] = vnpParams[key];
    });
    
    // Tạo chuỗi signData bằng URLSearchParams thay vì querystring
    const searchParams = new URLSearchParams();
    Object.entries(sortedParams).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    const signData = searchParams.toString();
    
    console.log('Sign Data:', signData);
    
    // Tạo hash
    const hmac = crypto.createHmac('sha512', config.vnp_HashSecret);
    const signed = hmac.update(signData).digest('hex');
    
    console.log('Generated SecureHash:', signed);
    
    // Thêm hash vào tham số
    vnpParams.vnp_SecureHash = signed;
    
    // Tạo URL thanh toán bằng URLSearchParams
    const paymentUrlParams = new URLSearchParams();
    Object.entries(vnpParams).forEach(([key, value]) => {
      paymentUrlParams.append(key, value);
    });
    
    const paymentUrl = `${config.vnp_Url}?${paymentUrlParams.toString()}`;
    
    // Log URL cuối cùng để debug
    console.log('Final Payment URL:', paymentUrl);
    
    res.json({ paymentUrl });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ error: 'Failed to create payment: ' + error.message });
  }
};

// Handle VNPay payment return
// Sửa hàm vnpayPaymentReturn trong paymentController.js
const vnpayPaymentReturn = async (req, res) => {
  try {
    console.log('VNPay Return Query Params:', req.query);
    
    // Keep original parameter order to prevent hash mismatch
    const vnp_Params = req.query;
    const secureHash = vnp_Params.vnp_SecureHash;
    
    if (!secureHash) {
      console.log('No secure hash found in params');
      return res.redirect('/payment-return?status=failed&reason=invalid_hash');
    }
    
    // Create signature data from query params - important to exclude the secureHash itself
    const signData = {};
    for (const key in vnp_Params) {
      if (key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType') {
        signData[key] = vnp_Params[key];
      }
    }
    
    // Log the sign data for debugging
    console.log('Sign Data:', signData);
    
    // Sort the fields alphabetically
    const sortedKeys = Object.keys(signData).sort();
    const sortedSignData = {};
    sortedKeys.forEach(key => {
      sortedSignData[key] = signData[key];
    });
    
    // Create the signature string
    const signString = querystring.stringify(sortedSignData, { encode: false });
    
    console.log('Sign String:', signString);
    
    // Calculate the signature hash
    const hmac = crypto.createHmac('sha512', config.vnp_HashSecret);
    const calculatedHash = hmac.update(signString).digest('hex');

    console.log('Calculated Hash:', calculatedHash);
    console.log('VNPay Hash:', secureHash);

    // Verify signatures match
    if (secureHash === calculatedHash) {
      try {
        // Check if order exists
        const order = await OrderService.getOrderByReference(vnp_Params.vnp_TxnRef);
        
        console.log('Found order:', order.reference);
        
        // Add response code check
        if (vnp_Params.vnp_ResponseCode === '00') {
          console.log('Payment successful, updating order status');
          
          // Update order status to completed
          await OrderService.updatePaymentStatus(
            vnp_Params.vnp_TxnRef, 
            'COMPLETED',
            vnp_Params.vnp_TransactionNo || 'VNPAY-TRANSACTION' // Save VNPay transaction ID with fallback
          );
          
          // After successful payment
          if (order && order.userId) {
            await CartService.clearUserCart(order.userId);
            
            // Add to revenue statistics
            await StatisticsService.recordPayment({
              amount: order.total,
              method: 'vnpay',
              orderId: order._id,
              date: new Date()
            });
          }
          
          // Use payment-return page to handle the response first
          return res.redirect(`/payment-return?status=success&reference=${vnp_Params.vnp_TxnRef}`);
        } else {
          console.log('Payment failed, response code:', vnp_Params.vnp_ResponseCode);
          
          // Payment failed or cancelled
          await OrderService.updatePaymentStatus(
            vnp_Params.vnp_TxnRef,
            'FAILED',
            vnp_Params.vnp_TransactionNo || null
          );
          
          // Use payment-return page to handle the response first
          return res.redirect(`/payment-return?status=failed&code=${vnp_Params.vnp_ResponseCode || 'unknown'}`);
        }
      } catch (orderError) {
        console.error('Order processing error:', orderError);
        return res.redirect('/payment-return?status=failed&reason=order_error');
      }
    } else {
      console.log('Hash verification failed');
      return res.redirect('/payment-return?status=failed&reason=invalid_checksum');
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.redirect('/payment-return?status=failed&reason=server_error');
  }
};

// Create COD order
const createCodOrder = async (req, res) => {
  try {
    const { customerInfo } = req.body;
    
    if (!customerInfo) {
      return res.status(400).json({ error: 'Missing customer information' });
    }
    
    const userId = req.user._id;
    const cart = await CartService.getCart(userId);
    
    if (!cart.items.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Calculate total from cart items
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const order = await OrderService.createOrder(
      userId,
      cart.items,
      total,
      customerInfo,
      'cod'
    );
    
    // Clear cart after order creation
    await CartService.clearUserCart(userId);
    
    res.status(201).json({
      success: true,
      order: {
        id: order._id,
        reference: order.reference,
        total: order.total
      }
    });
  } catch (error) {
    console.error('COD order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

module.exports = {
  createVNPayPayment,
  vnpayPaymentReturn,
  createCodOrder
};