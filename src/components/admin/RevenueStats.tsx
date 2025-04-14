import React, { useState, useEffect } from 'react';
import { revenueService } from '../../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Define interfaces for response data
interface TimelineItem {
  date: string;
  amount: number;
  timestamp?: number;
}

interface PaymentMethodItem {
  name: string;
  value: number;
}

interface RevenueData {
  totalRevenue: number;
  timeline: TimelineItem[];
  paymentMethods: PaymentMethodItem[];
  orderCount: number;
}

const RevenueStats: React.FC = () => {
  const [revenueData, setRevenueData] = useState<TimelineItem[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<PaymentMethodItem[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await revenueService.getAdminRevenueStatistics({ timeRange });
      
      if (response && response.data) {
        const data = response.data as RevenueData;
        
        // Validate timeline data
        if (Array.isArray(data.timeline)) {
          setRevenueData(data.timeline);
        } else {
          setRevenueData([]);
          console.error('Invalid timeline data format:', data.timeline);
        }
        
        // Validate payment method data
        if (Array.isArray(data.paymentMethods)) {
          setPaymentMethodData(data.paymentMethods);
        } else {
          // Create default payment methods data if missing
          setPaymentMethodData([
            { name: 'vnpay', value: 0 },
            { name: 'cod', value: 0 }
          ]);
          console.error('Invalid payment methods data format:', data.paymentMethods);
        }
        
        // Set total revenue
        setTotalRevenue(data.totalRevenue || 0);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
      setError('Failed to fetch revenue data. Please try again later.');
      
      // Set default values
      setRevenueData([]);
      setPaymentMethodData([
        { name: 'vnpay', value: 0 },
        { name: 'cod', value: 0 }
      ]);
      setTotalRevenue(0);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get payment method value safely
  const getPaymentMethodValue = (name: string): number => {
    const method = paymentMethodData.find(m => m.name === name);
    return method ? method.value : 0;
  };

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        <span className="ml-4">Loading revenue data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        <div className="flex items-center mb-2">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          <span className="font-bold">Error</span>
        </div>
        <p>{error}</p>
        <button 
          onClick={fetchRevenueData}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Revenue Statistics</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded transition-colors ${timeRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Week
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded transition-colors ${timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Month
          </button>
          <button 
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded transition-colors ${timeRange === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">VNPay Revenue</h3>
          <p className="text-2xl font-bold">{formatCurrency(getPaymentMethodValue('vnpay'))}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">COD Revenue</h3>
          <p className="text-2xl font-bold">{formatCurrency(getPaymentMethodValue('cod'))}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Revenue Timeline</h3>
          <div className="h-80">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    name="Revenue" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No timeline data available for this period
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
          <div className="h-80">
            {paymentMethodData.some(method => method.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => 
                      percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
                    }
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No payment method data available for this period
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueStats;