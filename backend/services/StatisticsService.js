const Order = require('../models/Order');

class StatisticsService {
  static async recordPayment(paymentData) {
    // This method can be expanded to record more detailed statistics
    // Currently, we're just relying on the Order model for statistics
    return true;
  }
  
  static async getRevenueStatistics(timeRange = 'week') {
    let dateFilter = {};
    const now = new Date();
    
    switch (timeRange) {
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        dateFilter = { createdAt: { $gte: weekAgo } };
        break;
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        dateFilter = { createdAt: { $gte: monthAgo } };
        break;
      case 'year':
        const yearAgo = new Date(now);
        yearAgo.setFullYear(now.getFullYear() - 1);
        dateFilter = { createdAt: { $gte: yearAgo } };
        break;
      default:
        const dayAgo = new Date(now);
        dayAgo.setDate(now.getDate() - 1);
        dateFilter = { createdAt: { $gte: dayAgo } };
    }
    
    // Get completed orders within the time range
    const orders = await Order.find({
      ...dateFilter,
      paymentStatus: 'COMPLETED'
    });
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Calculate revenue by payment method
    const paymentMethods = [
      { name: 'vnpay', value: 0 },
      { name: 'cod', value: 0 }
    ];
    
    orders.forEach(order => {
      const methodIndex = paymentMethods.findIndex(m => m.name === order.paymentMethod);
      if (methodIndex !== -1) {
        paymentMethods[methodIndex].value += order.total;
      }
    });
    
    // Generate timeline data
    const timeline = this._generateTimelineData(orders, timeRange);
    
    return {
      totalRevenue,
      paymentMethods,
      timeline,
      orderCount: orders.length
    };
  }
  
  static _generateTimelineData(orders, timeRange) {
    // Create a standardized date format for grouping
    const formatDate = (date) => {
      const d = new Date(date);
      
      switch(timeRange) {
        case 'year':
          // Format to "MMM YYYY" (e.g., "Jan 2023")
          return `${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`;
        case 'month':
          // Format to "DD MMM" (e.g., "15 Jan")
          return `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })}`;
        case 'week':
        default:
          // Format to "DD MMM" (e.g., "15 Jan")
          return `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })}`;
      }
    };

    // Group orders by date
    const ordersByDate = {};
    
    orders.forEach(order => {
      const dateKey = formatDate(order.createdAt);
      
      if (!ordersByDate[dateKey]) {
        ordersByDate[dateKey] = {
          date: dateKey,
          amount: 0,
          // Store the original date to help with sorting
          timestamp: new Date(order.createdAt).getTime()
        };
      }
      
      ordersByDate[dateKey].amount += order.total;
    });
    
    // Convert to array
    const timeline = Object.values(ordersByDate);
    
    // Sort by the timestamp (chronological order)
    return timeline.sort((a, b) => a.timestamp - b.timestamp);
  }
  
  static async getDashboardStatistics() {
    // Total revenue
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    // Orders count
    const orderCount = await Order.countDocuments();
    const pendingOrderCount = await Order.countDocuments({ orderStatus: 'PENDING' });
    
    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    return {
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      orderCount,
      pendingOrderCount,
      recentOrders
    };
  }
}

module.exports = StatisticsService;