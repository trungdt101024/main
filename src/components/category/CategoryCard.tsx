import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../interface/product';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { _id, id, name, image } = category;
  const categoryId = _id || id;

  return (
    <Link
      to={`/category/${categoryId}`}
      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-w-16 aspect-h-9">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white text-lg font-semibold group-hover:text-red-400 transition-colors duration-300">
          {name}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryCard;