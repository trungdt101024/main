import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/api';
import { Category } from '../../interface/product';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, []);

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      setError('Failed to fetch categories');
      console.error(error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, PNG, JPG and WebP images are allowed');
        return;
      }

      // Cleanup old preview URL
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }

      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newCategory);
      if (image) {
        formData.append('image', image);
      }

      const response = await categoryService.create(formData);
      setCategories([...categories, response.data]);
      setNewCategory('');
      setImage(null);
      setPreviewImage('');
      setError('');
    } catch (error: any) {
      if (error.response?.data?.error === 'Category name already exists') {
        setError('Category name already exists');
      } else {
        setError('Failed to create category');
      }
      console.error(error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    if (!editingCategory.name.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', editingCategory.name);
      if (image) {
        formData.append('image', image);
      }

      const response = await categoryService.update(editingCategory._id, formData);
      setCategories(categories.map(cat => 
        cat._id === editingCategory._id ? response.data : cat
      ));
      setEditingCategory(null);
      setImage(null);
      setPreviewImage('');
      setError('');
    } catch (error: any) {
      if (error.response?.data?.error === 'Category name already exists') {
        setError('Category name already exists');
      } else {
        setError('Failed to update category');
      }
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryService.delete(id);
      setCategories(categories.filter(cat => cat._id !== id));
    } catch (error: any) {
      if (error.response?.status === 400) {
        setError('Cannot delete category that has products');
      } else {
        setError('Failed to delete category');
      }
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Create Category Form */}
      <form onSubmit={handleCreate} className="mb-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="flex-1 p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Category
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover rounded"
              />
            )}
          </div>
        </div>
      </form>

      {/* Categories List */}
      <div className="space-y-2">
        {categories.map(category => (
          <div key={category._id} className="flex items-center justify-between p-2 border rounded">
            {editingCategory?._id === category._id ? (
              <form onSubmit={handleUpdate} className="flex-1 space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(null);
                      setImage(null);
                      setPreviewImage('');
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full"
                  />
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="mt-2 h-32 w-32 object-cover rounded"
                    />
                  )}
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  )}
                  <span>{category.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;