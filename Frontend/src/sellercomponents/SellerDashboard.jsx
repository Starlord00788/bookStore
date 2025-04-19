import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/footer.jsx';
const SellerDashboard = () => {
  const [seller, setSeller] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchSellerAndBooks = async () => {
      try {
        const sellerRes = await axios.get('https://bookstore-backend-qylv.onrender.com/api/v1/seller/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSeller(sellerRes.data.seller);

        const booksRes = await axios.get('https://bookstore-backend-qylv.onrender.com/api/v1/seller/mybooks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(booksRes.data.books || []);
      } catch (error) {
        console.error('Error fetching seller or books:', error);
        setBooks([]); // fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchSellerAndBooks();
  }, [token]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 pt-24">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>

      {seller ? (
        <div className="mb-6 bg-purple-50 p-4 rounded shadow-sm">
          <p><strong>Shop:</strong> {seller.shopName}</p>
          <p><strong>Bio:</strong> {seller.bio}</p>
        </div>
      ) : (
        <p className="text-red-500">Seller information not available.</p>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Books</h2>
        {Array.isArray(books) && books.length > 0 ? (
          <ul className="space-y-3">
            {books.map((book) => (
              <li key={book._id} className="border p-4 rounded shadow-sm bg-white">
                <p><strong>Title:</strong> {book.title}</p>
                <p><strong>Price:</strong> ₹{book.price}</p>
                <p><strong>Stock:</strong> {book.stock}</p>
                <p><strong>Category:</strong> {book.category}</p>
                {/* You can add Edit/Delete buttons here */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No books found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SellerDashboard;
