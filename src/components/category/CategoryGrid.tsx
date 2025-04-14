import React from 'react';
import { Category } from '../../interface/product';
import CategoryCard from './CategoryCard';

interface CategoryGridProps {
  categories: Category[];
  title?: string;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, title = "Browse By Category" }) => {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <div className="flex gap-2">
            {/* Add navigation buttons if needed */}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid; 