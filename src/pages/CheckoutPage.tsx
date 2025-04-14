import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartService, paymentService } from '../services/api';
import { CartItem } from '../interface/product';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCartItems(response.data);
      calculateTotal(response.data);
    } catch (error) {
      setError('Failed to fetch cart items');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items: CartItem[]) => {
    const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      setError('Please fill all required fields');
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Simple phone validation
    const phoneRegex = /^\d{9,15}$/;
    if (!phoneRegex.test(customerInfo.phone.replace(/[^0-9]/g, ''))) {
      setError('Please enter a valid phone number');
      return false;
    }
    
    return true;
  };

// Thay đổi phần xử lý thanh toán VNPay trong handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  try {
    setLoading(true);
    setError('');
    
    if (paymentMethod === 'vnpay') {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to checkout');
          return;
        }

        // Chuẩn hóa dữ liệu trước khi gửi
        const paymentData = {
          amount: Math.round(total), // Đảm bảo amount là số nguyên
          customerInfo: {
            name: customerInfo.name.trim(),
            email: customerInfo.email.trim(),
            phone: customerInfo.phone.trim().replace(/[^0-9]/g, ''), // Chỉ giữ lại số
            address: customerInfo.address.trim()
          },
          orderDescription: `Payment for ${cartItems.length} items`
        };

        // Make a direct fetch call to ensure proper headers
        const response = await fetch('http://localhost:5000/api/payments/create-vnpay', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(paymentData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.paymentUrl) {
          // Redirect to VNPay payment gateway
          window.location.href = data.paymentUrl;
        } else {
          throw new Error(data.error || 'Failed to create payment URL');
        }
      } catch (error) {
        console.error('VNPay error:', error);
        setError('Failed to connect to payment gateway. Please try again.');
      }
    } else if (paymentMethod === 'cod') {
      // Phần xử lý COD giữ nguyên
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to checkout');
          return;
        }

        const response = await fetch('http://localhost:5000/api/payments/create-cod', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            customerInfo: {
              name: customerInfo.name.trim(),
              email: customerInfo.email.trim(),
              phone: customerInfo.phone.trim(),
              address: customerInfo.address.trim()
            }
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          navigate('/payment-success', { 
            state: { 
              orderId: data.order.id,
              orderReference: data.order.reference,
              paymentMethod: 'cod'
            }
          });
        } else {
          throw new Error(data.error || 'Failed to create COD order');
        }
      } catch (error) {
        console.error('COD order error:', error);
        setError('Failed to create COD order. Please try again.');
      }
    } else {
      setError('Payment method not supported');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    setError('Failed to process payment. Please try again.');
  } finally {
    setLoading(false);
  }
};

  if (loading && cartItems.length === 0) {
    return <div className="container mx-auto px-4 py-8">Loading checkout...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Customer Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Address *</label>
              <input
                type="text"
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <h3 className="font-bold mb-2">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={paymentMethod === 'vnpay'}
                    onChange={() => setPaymentMethod('vnpay')}
                    className="mr-2"
                  />
                  VNPay (Online Payment)
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mr-2"
                  />
                  Cash on Delivery
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="border rounded p-4">
            {cartItems.map(item => (
              <div key={item.productId} className="flex items-center border-b py-4">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-500">${item.price.toFixed(2)} × {item.quantity}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <Link 
            to="/cart" 
            className="block text-blue-500 hover:text-blue-700 mt-4"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;