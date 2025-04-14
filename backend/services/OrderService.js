const Order = require('../models/Order');
const crypto = require('crypto');

class OrderService {
  static async createOrder(userId, cartItems, total, customerInfo, paymentMethod) {
    // Generate a unique reference number
    const reference = crypto.randomBytes(6).toString('hex').toUpperCase();
    
    const order = new Order({
      userId,
      items: cartItems,
      total,
      customerInfo,
      paymentMethod,
      reference
    });
    
    await order.save();
    return order;
  }
  
  static async getOrderByReference(reference) {
    const order = await Order.findOne({ reference });
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }
  
  static async getOrderById(orderId) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }
  
  static async updatePaymentStatus(reference, status, transactionId = null) {
    const order = await this.getOrderByReference(reference);
    
    order.paymentStatus = status;
    if (transactionId) {
      order.transactionId = transactionId;
    }
    
    // If payment completed, update order status
    if (status === 'COMPLETED') {
      order.orderStatus = 'PROCESSING';
    }
    
    await order.save();
    return order;
  }
  
  static async getUserOrders(userId) {
    return Order.find({ userId }).sort({ createdAt: -1 });
  }
  
  static async getAllOrders() {
    return Order.find().sort({ createdAt: -1 });
  }
  
  static async updateOrderStatus(orderId, status) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    
    order.orderStatus = status;
    await order.save();
    return order;
  }
}

module.exports = OrderService;