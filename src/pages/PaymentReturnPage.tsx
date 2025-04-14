import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const PaymentReturnPage: React.FC = () => {
  const [status, setStatus] = useState<'success' | 'processing' | 'failed'>('processing');
  const [message, setMessage] = useState<string>('');
  const [orderReference, setOrderReference] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const responseCode = params.get('vnp_ResponseCode');
    const txnRef = params.get('vnp_TxnRef');
    
    // Set order reference if available
    if (txnRef) {
      setOrderReference(txnRef);
    }

    // Handle response code
    if (responseCode === '00') {
      setStatus('success');
      setMessage('Your payment has been processed successfully!');
      
      // Clear the cart after successful payment
      localStorage.removeItem('cart');
      
      // Auto redirect to success page after 2 seconds
      setTimeout(() => {
        navigate('/payment-success', { 
          state: { 
            orderReference: txnRef,
            paymentMethod: 'vnpay'
          }
        });
      }, 2000);
    } else {
      setStatus('failed');
      
      // Map response codes to user-friendly messages
      let errorMessage = 'Your payment could not be processed.';
      
      switch (responseCode) {
        case '01':
          errorMessage = 'Transaction cancelled by the customer.';
          break;
        case '02':
          errorMessage = 'Transaction failed or rejected.';
          break;
        case '03':
          errorMessage = 'Invalid merchant information.';
          break;
        case '04':
          errorMessage = 'Invalid transaction information.';
          break;
        case '05':
          errorMessage = 'Bank declined transaction.';
          break;
        case '06':
        case '07':
          errorMessage = 'Payment gateway error. Please try again later.';
          break;
        default:
          errorMessage = 'Payment could not be completed. Please try again.';
      }
      
      setMessage(errorMessage);
      
      // Auto redirect to failed page after 3 seconds
      setTimeout(() => {
        navigate('/payment-failed', { 
          state: { 
            error: errorMessage,
            code: responseCode || 'unknown' 
          }
        });
      }, 3000);
    }
  }, [location, navigate]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-4">Processing Your Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            {orderReference && (
              <p className="text-gray-700 mb-4">
                Order Reference: <span className="font-semibold">{orderReference}</span>
              </p>
            )}
            <p className="text-gray-600 mb-4">Redirecting to order confirmation page...</p>
            <Link 
              to="/orders" 
              className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              View My Orders
            </Link>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-600">Payment Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-gray-600 mb-4">Redirecting to payment failed page...</p>
            <div className="flex space-x-4">
              <Link 
                to="/checkout" 
                className="block w-1/2 text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
              >
                Try Again
              </Link>
              <Link 
                to="/" 
                className="block w-1/2 text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentReturnPage;