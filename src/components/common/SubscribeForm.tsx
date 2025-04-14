import React from 'react';

const SubscribeForm = () => {
  return (
    <div className="flex">
      <input
        type="email"
        placeholder="Enter your email"
        className="bg-transparent border border-white px-4 py-2 w-full rounded-l text-white focus:outline-none"
      />
      <button className="bg-white text-black px-4 py-2 rounded-r hover:bg-gray-200 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default SubscribeForm;