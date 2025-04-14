const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartService {
  static async getCart(userId) {
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    
    return cart;
  }
  
  static async addToCart(userId, productId, quantity = 1) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    
    let cart = await this.getCart(userId);
    
    // Check if product already in cart
    const itemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );
    
    if (itemIndex > -1) {
      // Product exists in cart, update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Product not in cart, add new item
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image
      });
    }
    
    await cart.save();
    return cart;
  }
  
  static async updateQuantity(userId, productId, quantity) {
    let cart = await this.getCart(userId);
    
    const itemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );
    
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      return this.removeItem(userId, productId);
    }
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    return cart;
  }
  
  static async removeItem(userId, productId) {
    let cart = await this.getCart(userId);
    
    cart.items = cart.items.filter(item => 
      item.productId.toString() !== productId
    );
    
    await cart.save();
    return cart;
  }
  
  static async clearUserCart(userId) {
    let cart = await this.getCart(userId);
    cart.items = [];
    await cart.save();
    return cart;
  }
}

module.exports = CartService;