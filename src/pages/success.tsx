import React from 'react';
import { useLocation, Link } from 'react-router-dom';

interface LocationState {
  orderReference?: string;
  orderId?: string;
  paymentMethod?: string;
}

const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  
  const orderReference = state?.orderReference || '';
  const paymentMethod = state?.paymentMethod || 'online';
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
          <p className="text-xl text-gray-600 mb-8">Your order has been placed successfully.</p>
          
          {orderReference && (
            <div className="bg-gray-100 rounded-lg p-4 mb-8">
              <p className="text-gray-500 mb-1">Order Reference</p>
              <p className="text-lg font-semibold">{orderReference}</p>
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            
            <div className="border-t border-b py-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">
                  {paymentMethod === 'vnpay' ? 'VNPay' : 'Cash on Delivery'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">
                  {paymentMethod === 'vnpay' ? 'Paid' : 'Pending Payment'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              {paymentMethod === 'vnpay' 
                ? 'We have sent an order confirmation email with details of your order.' 
                : 'Your order will be processed shortly. You will pay when the order is delivered.'}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/orders" 
                className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors"
              >
                View My Orders
              </Link>
              
              <Link 
                to="/" 
                className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;