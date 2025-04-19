import React, { useEffect, useState, useMemo, Suspense, lazy } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import list from '../../public/list.json';
import { useCart } from '../context/CartContent';

// Lazy load Navbar and Footer
const Navbar = lazy(() => import('../components/Navbar'));
const Footer = lazy(() => import('../components/footer'));

const BookDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const book = useMemo(() => state?.book, [state]);
  const [related, setRelated] = useState([]);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!book) return;

    const bookWithId = {
      ...book,
      id: book._id || book.id,
      quantity: 1,
    };

    addToCart(bookWithId);
  };

  const handleRelatedClick = (relatedBook) => {
    navigate(`/books/${relatedBook._id}`, { state: { book: relatedBook } });
  };

  useEffect(() => {
    if (book?.category) {
      fetchRelatedBooks();
    }
  }, [book]);

  const fetchRelatedBooks = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const [dbBooksResponse] = await Promise.all([
        axios.post(
          "https://bookstore-backend-qylv.onrender.com/api/v1/books/relatedbooks",
          { category: book.category },
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      const dbBooks = (dbBooksResponse.data.data || []).filter(
        (item) => item._id !== book._id
      );

      const localBooks = list.filter(
        (item) => item.category === book.category && item._id !== book._id
      );

      const combined = [...dbBooks, ...localBooks];
      const uniqueBooks = combined.filter(
        (item, index, self) =>
          index === self.findIndex(b => b._id === item._id)
      );

      // Shuffle books
      const shuffledBooks = uniqueBooks.sort(() => 0.5 - Math.random());
      setRelated(shuffledBooks);
    } catch (error) {
      console.error("Error fetching related books:", error);
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
        <p className="text-lg font-semibold text-red-600">Book not found!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#e0f7fa] via-[#f3e5f5] to-[#e3f2fd] min-h-screen">
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Navbar />
      </Suspense>

      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Book Image */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105 duration-150 ease-in-out">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-[450px] object-contain p-6"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="h-[450px] flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
            </div>
          </div>

          {/* Book Info */}
          <div className="flex flex-col justify-between gap-6 bg-white p-6 rounded-2xl shadow-md">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{book.title}</h1>
              <p className="text-base text-gray-700 mb-4">
                <span className="font-semibold">Author:</span>{" "}
                <span className="italic">{book.author || 'Unknown'}</span>
              </p>

              <div className="flex items-center flex-wrap gap-3 mb-6">
                <span className="text-xl font-bold text-green-700 bg-green-100 px-4 py-1.5 rounded-full shadow-sm">
                  ₹{book.price}
                </span>

                <span className="text-xs uppercase bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium shadow">
                  {book.category || 'Uncategorized'}
                </span>

                <span className={`text-xs px-3 py-1 rounded-full font-medium shadow ${
                  book.stock > 0
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {book.stock > 0 ? `In Stock (${book.stock})` : 'Out of Stock'}
                </span>
              </div>

              <p className="text-sm text-gray-800">{book.description || 'No description available.'}</p>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-6 rounded-lg hover:shadow-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50"
              disabled={book.stock <= 0}
            >
              <FaShoppingCart className="inline mr-2" />
              {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Related Books Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Books</h2>
          {related.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {related.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleRelatedClick(item)}
                  className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-150 ease-in-out"
                >
                  <div className="bg-gray-100 h-40 flex items-center justify-center p-4">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="h-full w-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-600 italic">{item.author || "Unknown"}</p>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-green-700 font-bold">₹{item.price}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                        {item.category || "Uncategorized"}
                      </span>
                    </div>
                    <span className={`block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                      item.stock > 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {item.stock > 0 ? `In Stock (${item.stock})` : "Out of Stock"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No related books found.</p>
          )}
        </div>
      </div>

      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default BookDetails;
