/* eslint-disable @typescript-eslint/no-explicit-any */
// LoginForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { authService } from '../../services/api';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-center">Log in to Exclusive</h1>
      <p className="text-gray-600 mb-6 text-center">Enter your details below</p>
  
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
  
      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email or Phone Number"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-800 focus:outline-none transition-colors"
            required
          />
        </div>
  
        {/* Password Input */}
        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-800 focus:outline-none transition-colors"
            required
          />
        </div>
  
        {/* Submit + Forgot */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mt-6">
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
  
          <Link
            to="/forgot-password"
            className="text-red-500 text-sm hover:underline text-center sm:text-right"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Register Link */}
        <p className="text-center mt-4 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-red-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;