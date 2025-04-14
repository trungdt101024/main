import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, categoryService } from '../../services/api';
import { Product } from '../../interface/product';
import Modal from '../common/Modal';
import ProductForm from './ProductForm';

interface Category {
  _id: string;
  name: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    category: ''
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      setError('Failed to fetch categories');
      console.error(error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) {
      setError('Product name cannot be empty');
      return;
    }
    if (Number(newProduct.price) <= 1000) {
      setError('Price must be greater than 1000');
      return;
    }

    try {
      const response = await productService.create({
        ...newProduct,
        price: Number(newProduct.price)
      });
      setProducts([...products, response.data]);
      setNewProduct({
        name: '',
        price: '',
        image: '',
        category: ''
      });
      setError('');
    } catch (error) {
      setError('Failed to create product');
      console.error(error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    if (!editingProduct.name.trim()) {
      setError('Product name cannot be empty');
      return;
    }
    if (editingProduct.price <= 1000) {
      setError('Price must be greater than 1000');
      return;
    }

    const productId = editingProduct._id || editingProduct.id;
    if (!productId) {
      setError('Product ID is missing');
      return;
    }

    try {
      const response = await productService.update(productId, {
        name: editingProduct.name,
        price: editingProduct.price,
        image: editingProduct.image,
        category: editingProduct.category?._id || editingProduct.category
      });
      
      setProducts(products.map(prod => 
        (prod._id === productId || prod.id === productId) ? response.data : prod
      ));
      setEditingProduct(null);
      setError('');
    } catch (error) {
      setError('Failed to update product');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id);
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (selectedProduct) {
        await productService.update(selectedProduct._id, formData);
      } else {
        await productService.create(formData);
      }
      fetchProducts();
      handleModalClose();
    } catch (err) {
      setError('Failed to save product');
      console.error('Error saving product:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.image}
                        alt={product.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  <div className="text-sm text-gray-900">${product.price}</div>
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  <div className="text-sm text-gray-900">
                    {typeof product.category === 'object' ? product.category.name : product.category}
                  </div>
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  <div className="text-sm text-gray-900">{product.countInStock}</div>
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm
          initialData={selectedProduct}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </div>
  );
};

export default ProductList;