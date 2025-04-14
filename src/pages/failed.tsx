import React from 'react';
import { useLocation, Link } from 'react-router-dom';

interface LocationState {
  error?: string;
  code?: string;
  reason?: string;
}

const PaymentFailedPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  
  // Try to get error from state first, then from query parameters
  const params = new URLSearchParams(location.search);
  const errorMessage = state?.error || params.get('reason') || 'Your payment could not be processed';
  const errorCode = state?.code || params.get('code') || '';
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Failed</h1>
          <p className="text-xl text-gray-600 mb-8">{errorMessage}</p>
          
          {errorCode && (
            <div className="bg-gray-100 rounded-lg p-4 mb-8">
              <p className="text-gray-500 mb-1">Error Code</p>
              <p className="text-lg font-semibold">{errorCode}</p>
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">What happened?</h2>
            
            <div className="text-left bg-gray-50 p-4 rounded-lg">
              <p className="mb-2">Your payment could not be completed. This could be due to:</p>
              
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Insufficient funds in your account</li>
                <li>Card declined by your bank</li>
                <li>Payment session timed out</li>
                <li>Connection issues during payment</li>
                <li>You may have cancelled the payment</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Don't worry, no money has been deducted from your account. 
              You can try again with a different payment method.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/checkout" 
                className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors"
              >
                Try Again
              </Link>
              
              <Link 
                to="/cart" 
                className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300 transition-colors"
              >
                Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;