'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';

export default function AdminAddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    images: '',
    status: 'PREORDER',
    releaseDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData: Omit<Product, 'id'> = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: formData.images.split(',').map(url => url.trim()).filter(url => url.length > 0),
        status: formData.status as 'PREORDER' | 'INSTOCK' | 'CLOSED',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      if (formData.releaseDate) {
        productData.releaseDate = formData.releaseDate;
      }

      await addDoc(collection(db, 'products'), productData);
      router.push('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price *</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">NT$</span>
              </div>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              required
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status *</label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
            >
              <option value="PREORDER">Pre-order</option>
              <option value="INSTOCK">In Stock</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700">Release Date (Optional)</label>
          <input
            type="date"
            id="releaseDate"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">Image URLs (comma separated)</label>
          <input
            type="text"
            id="images"
            name="images"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            value={formData.images}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2 border"
          />
          <p className="mt-1 text-xs text-gray-500">Enter full URLs separated by commas.</p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
