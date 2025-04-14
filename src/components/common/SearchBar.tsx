import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/api';
import { Product } from '../../interface/product';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.trim() === '') {
        setResults([]);
        return;
      }

      try {
        const response = await productService.getAll();
        const filteredProducts = response.data.filter((product: Product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filteredProducts);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="What are you looking for?"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          className="w-40 md:w-64 py-2 px-3 bg-gray-100 rounded-md pr-8 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50 max-h-96 overflow-y-auto">
          {results.map((product) => (
            <div
              key={product._id}
              className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => {
                navigate(`/product/${product._id}`);
                setIsOpen(false);
                setSearchTerm('');
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-10 object-cover rounded mr-3"
              />
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
