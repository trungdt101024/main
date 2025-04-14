import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import { Product } from '../../interface/product';
import { productService } from '../../services/api';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (productId) {
          const response = await productService.getById(productId);
          
          // Make sure we have all required properties populated
          if (!response.data.images) {
            response.data.images = [response.data.image];
          }
          
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          {error || 'Product not found'}
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
};

export default ProductDetailPage;