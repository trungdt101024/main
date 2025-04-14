// LoginPage.jsx
import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row">
        {/* Left side - Image */}
        <div className="md:w-1/2 mb-8 md:mb-0 ">
          <img 
            src="/images/Side Image.png" 
            alt="Shopping cart with smartphone" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Right side - Login Form */}
        <div className="md:w-1/2 md:pl-12 flex items-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
