import React, { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // To allow additional props
};

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  className = '',
  ...props 
}) => {
  const variantClasses = {
    primary: 'bg-red-500 text-white',
    secondary: 'bg-gray-200 text-gray-800',
    success: 'bg-green-500 text-white',
    danger: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
  };
  
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;