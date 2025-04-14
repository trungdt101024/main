import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../interface/product';
import { cartService } from '../../services/api';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const images = product.images || [product.image];

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the product ID (either _id or id depending on your API)
      const productId = product._id || product.id;
      
      if (!productId) {
        throw new Error('Product ID is missing');
      }
      
      // Call the API to add the product to cart
      await cartService.addToCart(productId, quantity);
      
      // Navigate to cart page after successful addition
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setError('Failed to add product to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  selectedImage === image ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500">
                ({product.ratingCount || 0} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
            {product.discount && (
              <span className="text-red-500">-{product.discount}%</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600">{product.description}</p>
          )}

          {/* Category */}
          {product.category && (
            <div className="space-y-2">
              <h3 className="font-medium">Category</h3>
              <p className="text-gray-600">
                {typeof product.category === 'string' 
                  ? product.category 
                  : product.category.name}
              </p>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded">
              <button
                className="px-3 py-2 hover:bg-gray-100"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={loading}
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                className="px-3 py-2 hover:bg-gray-100"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={loading}
              >
                +
              </button>
            </div>
            <button 
              className={`flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={handleAddToCart}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>

          {/* Product Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;