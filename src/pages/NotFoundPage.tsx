import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-8xl font-bold mb-6">404 Not Found</h1>
        <p className="text-xl mb-8">Your visited page not found. You may go home page.</p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Back to home page
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;