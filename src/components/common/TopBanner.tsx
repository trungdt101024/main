import React from 'react';

const TopBanner = () => {
  return (
    <div className="w-full bg-black text-white py-3 px-4 flex justify-between items-center">
      <p className="text-sm md:text-base">
        Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
      </p>
      <button className="text-sm md:text-base font-semibold hover:underline transition-all">
        ShopNow
      </button>
      <div className="flex items-center">
        <span className="mr-1">English</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default TopBanner;