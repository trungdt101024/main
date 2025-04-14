import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../interface/product';
import { productService } from '../services/api';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const query = searchParams.get('q') || '';
        const response = await productService.getAll();
        const filteredProducts = response.data.filter((product: Product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error searching products:', error);
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [searchParams]);

  const query = searchParams.get('q') || '';

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading search results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{query}"
      </h1>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage; 