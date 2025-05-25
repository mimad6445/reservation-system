import React, { useState } from 'react';
import axios from 'axios';

const CreateProduct = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    priceInPoints: '',
    countInStock: '',
    category: '',
    tags: '',
    image: null,
  });

  const [message, setMessage] = useState('');

  const staticCategories = [
    { _id: '1', name: 'Electronics' },
    { _id: '2', name: 'Books' },
    { _id: '3', name: 'Clothing' },
    { _id: '4', name: 'Accessories' },
    { _id: '5', name: 'Other' }
  ];

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'tags') {
        formData.append(key, JSON.stringify(value.split(',').map(t => t.trim())));
      } else {
        formData.append(key, value);
      }
    });

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/products', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('✅ Product created successfully!');
      setForm({
        name: '',
        description: '',
        priceInPoints: '',
        countInStock: '',
        category: '',
        tags: '',
        image: null,
      });
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to create product');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold">Product Name</label>
            <input
              type="text"
              name="name"
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Description</label>
            <textarea
              name="description"
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold">Price in Points</label>
              <input
                type="number"
                name="priceInPoints"
                className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.priceInPoints}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Count In Stock</label>
              <input
                type="number"
                name="countInStock"
                className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.countInStock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Category</label>
            <select
              name="category"
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {staticCategories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.tags}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Upload Image</label>
            <input
              type="file"
              name="image"
              className="w-full mt-1 px-4 py-2 border rounded-xl bg-gray-50"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
          >
            Create Product
          </button>

          {message && (
            <div className="text-center text-sm mt-4 text-green-600 font-medium">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
