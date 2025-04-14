import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import CategoryCard from '../components/category/CategoryCard';
import Countdown from '../components/ui/Countdown';
import ServiceCard from '../components/ui/ServiceCard';
import { Product, Category } from '../interface/product';
import { categoryService, productService } from '../services/api';

interface FeatureType {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  link: string;
}

interface ServiceType {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const HomePage: React.FC = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [exploreProducts, setExploreProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [features, setFeatures] = useState<FeatureType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories
        console.log('Fetching categories...');
        const categoriesResponse = await categoryService.getAll();
        console.log('Categories response:', categoriesResponse);
        setCategories(categoriesResponse.data);

        // Fetch best selling products
        console.log('Fetching best sellers...');
        const bestSellersResponse = await productService.getBestSellers();
        console.log('Best sellers response:', bestSellersResponse);
        setBestSellingProducts(bestSellersResponse);

        // Fetch explore products
        console.log('Fetching all products...');
        const productsResponse = await productService.getAll();
        console.log('Products response:', productsResponse);
        setExploreProducts(productsResponse.data);

        // Featured sections data
        const sampleFeatures: FeatureType[] = [
          {
            id: 'playstation',
            title: 'PlayStation 5',
            description: 'Black and White version of the PS5 coming out on sale.',
            buttonText: 'Shop Now',
            link: '#',
            image: '/images/playstation.png',
          },
          {
            id: "women-collection",
            title: "Women's Collections",
            description: 'Featured woman collections that give you another vibe.',
            buttonText: 'Shop Now',
            link: '#',
            image: '/images/women.png',
          },
          {
            id: 'speakers',
            title: 'Smart Speaker',
            description: 'Feel the quality of sound.',
            buttonText: 'Shop Now',
            link: '#',
            image: '/images/760.png',
          },
          {
            id: 'perfume',
            title: 'Perfume',
            description: 'Unique scent for everyone.',
            buttonText: 'Shop Now',
            link: '#',
            image: '/images/gucci.png',
          },
        ];

        // Services data
        const sampleServices: ServiceType[] = [
          {
            id: 'delivery',
            title: 'FREE AND FAST DELIVERY',
            description: 'Free delivery for all orders over $140',
            icon: 'delivery-icon'
          },
          {
            id: 'customer-service',
            title: '24/7 CUSTOMER SERVICE',
            description: 'Friendly 24/7 customer support',
            icon: 'customer-service-icon'
          },
          {
            id: 'money-back',
            title: 'MONEY BACK GUARANTEE',
            description: 'We return money within 30 days',
            icon: 'money-back-icon'
          }
        ];

        setFeatures(sampleFeatures);
        setServices(sampleServices);
      } catch (error: unknown) {
        console.error('Detailed error:', error);
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { data: any; status: number; headers: any } };
          console.error('Error response data:', axiosError.response.data);
          console.error('Error response status:', axiosError.response.status);
          console.error('Error response headers:', axiosError.response.headers);
        } else if (error && typeof error === 'object' && 'request' in error) {
          console.error('Error request:', (error as { request: any }).request);
        } else {
          console.error('Error message:', error instanceof Error ? error.message : String(error));
        }
        setError('Failed to load data. Please check your backend server and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading products...</p>
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
    <div>
      {/* Hero Banner */}
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Categories */}
            <div className="w-full md:w-1/4 mb-6 md:mb-0 md:pr-8">
              <div className="bg-white p-4 rounded">
                <ul className="space-y-3">
                  <li className="font-medium text-lg mb-2">Categories</li>
                  {categories.map((category) => (
                    <li key={category._id} className="hover:text-red-500 transition-colors">
                      <Link to={`/category/${category._id}`}>{category.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right side - Promo Banner */}
            <div className="w-full md:w-3/4 relative">
              <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded p-8 md:p-12 h-full flex flex-row items-center justify-between">
                {/* Left content */}
                <div className="max-w-lg">
                  <div className="flex items-center mb-4">
                    <img src="/images/apple-logo.png" alt="Apple Logo" className="h-10 mr-3" />
                    <span className="text-lg">iPhone 14 Series</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    Up to 10% off Voucher
                  </h1>
                  <div className="flex space-x-2 items-center mb-6">
                    <Link
                      to="/products/iphone"
                      className="flex items-center text-lg font-medium hover:underline"
                    >
                      <span>Shop Now</span>
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Right image */}
                <div className="hidden md:block">
                  <img
                    src="/images/hero_endframe__cvklg0xk3w6e_large 2.png"
                    alt="iPhone Banner"
                    className="max-w-xs md:max-w-sm lg:max-w-md object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sale & Time Counter */}
      <div className="container mx-auto px-4 py-12">
        <div className="relative flex flex-col md:flex-row items-center justify-between bg-black text-white rounded-lg p-8 overflow-hidden">
          {/* Text content */}
          <div className="z-10 max-w-md">
            <p className="text-green-500 text-sm mb-2">Categories</p>
            <h2 className="text-3xl font-semibold leading-tight mb-6">
              Enhance Your <br /> Music Experience
            </h2>

            {/* Countdown component */}
            <div className="flex space-x-4 mb-6">
              <Countdown days={5} hours={23} minutes={59} seconds={35} />
            </div>

            {/* Buy Now Button */}
            <Link
              to="/flash-sale"
              className="inline-block px-6 py-3 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
            >
              Buy Now!
            </Link>
          </div>

          {/* Speaker Image */}
          <div className="relative w-full md:w-1/2 h-64 md:h-auto flex items-center justify-center mt-10 md:mt-0">
            <img
              src="/images/JBL_BOOMBOX_2_HERO_020_x1 (1) 1.png" // update path if needed
              alt="JBL Speaker"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-5 h-10 bg-red-500 mr-3"></div>
            <h2 className="text-lg">Categories</h2>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Browse By Category</h2>
            <div className="flex space-x-2">
              <button className="p-2 border rounded-full hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="p-2 border rounded-full hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-5 h-10 bg-red-500 mr-3"></div>
            <h2 className="text-lg">This Month</h2>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Best Selling Products</h2>
            <Link
              to="/best-selling"
              className="inline-block px-6 py-2 bg-red-500 text-white rounded transition-colors hover:bg-red-600"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Our Products Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-5 h-10 bg-red-500 mr-3"></div>
            <h2 className="text-lg">Our Products</h2>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Explore Our Products</h2>
            <div className="flex space-x-2">
              <button className="p-2 border rounded-full hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="p-2 border rounded-full hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {exploreProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-block px-8 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-5 h-10 bg-red-500 mr-3"></div>
            <h2 className="text-lg">Featured</h2>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">New Arrival</h2>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* PlayStation - bên trái */}
          <div className="relative bg-black text-white rounded overflow-hidden flex-1 min-h-[620px]">
            <img
              src={features[0].image}
              alt={features[0].title}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inset-0  object-cover"
            />
            <div className="absolute bottom-6 left-6 z-10 max-w-[80%]">
              <div>
                <h3 className="text-2xl font-bold mb-2">{features[0].title}</h3>
                <p className="text-gray-200 text-sm">{features[0].description}</p>
              </div>
              <Link
                to={features[0].link}
                className="inline-flex items-center mt-4 text-white hover:underline"
              >
                {features[0].buttonText}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Khối bên phải: 1 hàng trên + 2 ô dưới */}
          <div className="flex flex-col gap-6 flex-1">
            {/* Ô trên: Women's Collection */}
            <div className="relative bg-black text-white rounded overflow-hidden h-[300px]">
              <img
                src={features[1].image}
                alt={features[1].title}
                className=" inset-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
              />
              <div className="absolute bottom-6 left-6 z-10 max-w-[80%]">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{features[1].title}</h3>
                  <p className="text-gray-200 text-sm">{features[1].description}</p>
                </div>
                <Link
                  to={features[1].link}
                  className="inline-flex items-center mt-4 text-white hover:underline"
                >
                  {features[1].buttonText}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* 2 ô nhỏ dưới: grid 2 cột */}
            <div className="grid grid-cols-2 gap-6">
              {[features[2], features[3]].map((feature) => (
                <div
                  key={feature.id}
                  className="relative bg-black text-white rounded overflow-hidden h-[300px]"
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inset-0  object-cover"
                  />
                  <div className="absolute bottom-6 left-6 z-10 max-w-[80%]">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-200 text-sm">{feature.description}</p>
                    </div>
                    <Link
                      to={feature.link}
                      className="inline-flex items-center mt-4 text-white hover:underline"
                    >
                      {feature.buttonText}
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 py-16 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;