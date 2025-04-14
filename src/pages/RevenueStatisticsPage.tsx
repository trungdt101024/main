import React, { useState, useEffect } from 'react';
import { revenueService } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueData {
  date: string;
  total: number;
  vnpay: number;
  cod: number;
  completed: number;
  pending: number;
}

const RevenueStatisticsPage: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('week');
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await revenueService.getAdminRevenueStatistics({
        timeRange,
      });
      setRevenueData(response.data);
      calculateTotalRevenue(response.data);
    } catch (error) {
      setError('Failed to fetch revenue data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalRevenue = (data: RevenueData[]) => {
    const sum = data.reduce((acc, item) => acc + item.total, 0);
    setTotalRevenue(sum);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading revenue data...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Revenue Statistics</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-900">${totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => handleTimeRangeChange('week')}
            className={`px-4 py-2 rounded ${timeRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Week
          </button>
          <button 
            onClick={() => handleTimeRangeChange('month')}
            className={`px-4 py-2 rounded ${timeRange === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Month
          </button>
          <button 
            onClick={() => handleTimeRangeChange('year')}
            className={`px-4 py-2 rounded ${timeRange === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Revenue" />
              <Line type="monotone" dataKey="vnpay" stroke="#82ca9d" name="VNPay" />
              <Line type="monotone" dataKey="cod" stroke="#ffc658" name="Cash on Delivery" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Revenue Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VNPay</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COD</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.vnpay.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.cod.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueStatisticsPage;