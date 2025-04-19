import React, { useState } from 'react';
import axios from 'axios';

const AddSellerBook = () => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    coverImage: '',
  });

  const token = localStorage.getItem('accessToken');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://bookstore-backend-qylv.onrender.com/api/v1/seller/addbook', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Book added successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding book');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['title', 'author', 'description', 'price', 'stock', 'category', 'coverImage'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required={['title', 'author', 'price', 'stock'].includes(field)}
          />
        ))}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddSellerBook;
