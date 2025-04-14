import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../interface/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const { _id, id, name, price, originalPrice, image, discount, isNew, rating, ratingCount } = product;
  const productId = _id || id;
  
  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square ">
        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
            -{discount}%
          </span>
        )}
        
        {/* New Badge */}
        {isNew && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded z-10">
            NEW
          </span>
        )}
        
        {/* Quick View Button (shows on hover) */}
        <div className={`absolute right-3 top-3 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity z-10`}>
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
        
        {/* Product Image */}
        <img 
          src={image} 
          alt={name} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Add to Cart Button (shows on hover) */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-black text-white text-center py-2 transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <button className="w-full h-full">Add To Cart</button>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="mt-3">
        <Link to={`/product/${productId}`} className="block">
          <h3 className="text-sm font-medium hover:text-red-500 transition-colors">{name}</h3>
        </Link>
        <div className="mt-1 flex items-baseline">
          <span className="text-red-500 font-semibold mr-2">${price}</span>
          {originalPrice && (
            <span className="text-gray-500 line-through text-sm">${originalPrice}</span>
          )}
        </div>
        
        {/* Ratings */}
        {rating && (
          <div className="mt-1 flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {ratingCount && (
              <span className="text-gray-500 text-xs ml-1">({ratingCount})</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;