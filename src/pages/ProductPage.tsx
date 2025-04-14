import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductDetail from '../components/product/ProductDetail';
import RelatedProducts from '../components/product/RelatedProducts';
import { Product } from '../interface/product';

interface RouteParams {
  id: string;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // This would normally be a real API call
  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => {
      // Sample product data
      const sampleProduct: Product = {
        id: 'havic-hv-g92',
        name: 'Havic HV G-92 Gamepad',
        price: 192.00,
        description: 'PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.',
        image: '/images/products/gamepad-1.jpg',
        images: [
          '/images/products/image-63.png',
          '/images/products/image-61.png',
          '/images/products/image-58.png',
          '/images/products/image-59.png',
          
        ],
        colors: [
          { name: 'White', value: '#FFFFFF' },
          { name: 'Red', value: '#FF4B4B' },
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        rating: 4,
        reviewCount: 150,
        inStock: true,
      };
      
      // Sample related products
      const sampleRelatedProducts: Product[] = [
        {
          id: 'havit-hv-g92-red',
          name: 'HAVIT HV-G92 Gamepad',
          price: 120,
          originalPrice: 160,
          image: '/images/products/gamepad.png',
          rating: 5,
          ratingCount: 88,
          discount: 40,
        },
        {
          id: 'ak-900-keyboard',
          name: 'AK-900 Wired Keyboard',
          price: 960,
          originalPrice: 1160,
          image: '/images/products/kids-car.png',
          rating: 4.5,
          ratingCount: 75,
          discount: 35,
        },
        {
          id: 'ips-monitor',
          name: 'IPS LCD Gaming Monitor',
          price: 370,
          originalPrice: 400,
          image: '/images/products/camera.png',
          rating: 4.5,
          ratingCount: 99,
          discount: 30,
        },
        {
          id: 'rgb-cooler',
          name: 'RGB liquid CPU Cooler',
          price: 160,
          originalPrice: 170,
          image: '/images/products/cooler.png',
          rating: 5,
          ratingCount: 65,
        },
      ];
      
      setProduct(sampleProduct);
      setRelatedProducts(sampleRelatedProducts);
      setLoading(false);
    }, 500);
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading product...</p>
      </div>
    );
  }
  
  return (
    <div>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-red-500 transition-colors">
            Account
          </Link>
          <span className="mx-2">/</span>
          <Link to="/gaming" className="hover:text-red-500 transition-colors">
            Gaming
          </Link>
          <span className="mx-2">/</span>
          {product && <span className="text-gray-800">{product.name}</span>}
        </div>
      </div>
      
      {/* Product Details */}
      {product && <ProductDetail product={product} />}
      
      {/* Related Products */}
      <div className="container mx-auto px-4">
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
};

export default ProductPage;