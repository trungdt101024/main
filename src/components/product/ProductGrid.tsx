import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../interface/product';

const ProductGrid = ({ products, title }: { products: Product[], title?: string }) => {
  return (
    <div className="my-8">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;