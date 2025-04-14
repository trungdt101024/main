import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';
import axios from 'axios';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyUser = async () => {
      const user = authService.getCurrentUser();
      
      if (!user) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Verify token is valid by making a request to /api/auth/me
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setIsAuthenticated(true);
        setIsAdmin(response.data.role === 'admin');
      } catch (error) {
        console.error('Authentication failed:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
        // Clear invalid token
        authService.logout();
      }
    };

    verifyUser();
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null || isAdmin === null) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to home page if not admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;