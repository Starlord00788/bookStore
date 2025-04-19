import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import axios from "axios";

const AdminPage = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({});

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    setLoading(true);
    setError("");
    setBooks([]);
    setFeedback({});

    try {
      const response = await axios.post(
        "https://bookstore-backend-qylv.onrender.com/api/v1/books/fetch-google-books",
        { query },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const booksArray =
        response.data.data || response.data.Objectdata || response.data.books;

      if (booksArray && booksArray.length > 0) {
        setBooks(booksArray);
      } else {
        setError("No books found for this query.");
      }
    } catch (err) {
      console.error("❌ Error fetching books:", err);
      setError("Error fetching books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (book, index) => {
    try {
      const response = await axios.post(
        "https://bookstore-backend-qylv.onrender.com/api/v1/books/addBook",
        book,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data.success) {
        setFeedback((prev) => ({
          ...prev,
          [index]: { type: "success", message: "Book added successfully!" },
        }));
      } else {
        setFeedback((prev) => ({
          ...prev,
          [index]: { type: "error", message: "Failed to add book." },
        }));
      }
    } catch (error) {
      console.error("Add book error:", error);
      setFeedback((prev) => ({
        ...prev,
        [index]: { type: "error", message: "Error adding book." },
      }));
    }
  };

  return (
    <div className="admin-page pt-24 min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Book Search</h1>

        <form onSubmit={handleSearch} className="flex justify-center mb-8">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search for books..."
            className="p-3 border border-gray-300 rounded-lg w-80 shadow-sm focus:outline-none focus:ring-2 bg-white focus:ring-purple-500"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
          >
            Search
          </button>
        </form>

        {loading && <p className="text-center text-gray-700">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && books.length === 0 && (
          <p className="text-center text-gray-500">No books found.</p>
        )}

        {/* Book Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {books.map((book, index) => (
            <div
              key={book._id || index}
              className="book-card bg-white p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow ease-in-out duration-300"
            >
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{book.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-purple-600">₹{book.price}</span>
                <span className="text-sm text-gray-500">Stock: {book.stock}</span>
              </div>

              <button
                onClick={() => handleAddBook(book, index)}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all"
              >
                Add Book
              </button>

              {feedback[index] && (
                <p
                  className={`mt-2 text-sm ${
                    feedback[index].type === "success"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {feedback[index].message}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
