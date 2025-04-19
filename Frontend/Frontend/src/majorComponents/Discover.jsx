import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBooks } from "../features/books/booksSlice";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import { FaShoppingCart } from "react-icons/fa";
import list from "../../public/list.json";
import { useCart } from "../context/CartContent";
import { FiFilter } from "react-icons/fi";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
// Fisher-Yates Shuffle
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const Discover = () => {
 

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dbBooks = useSelector((state) => state.books.dbBooks);
  const dbStatus = useSelector((state) => state.books.status);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const location = useLocation();
  const nameFromState = location.state?.name || "";
  const [name , setName ] = useState(nameFromState);

  useEffect(() => {
    if (nameFromState) {
      setSearchQuery(nameFromState);
    }
  }, [nameFromState]);
  
  const { cart, addToCart, increaseQty } = useCart();

  useEffect(() => {
    if (dbStatus === "idle") {
      dispatch(fetchBooks());
    }
  }, [dbStatus, dispatch]);

  const allBooks = useMemo(() => {
    const combined = [...list, ...dbBooks].map((book) => ({
      ...book,
      id: book.id || book._id,
    }));
    return shuffleArray(combined); // ✅ shuffle only once per render
  }, [dbBooks]);

  const categories = useMemo(() => {
    const allCategories = allBooks.map((book) => book.category || "Uncategorized");
    return ["All", ...Array.from(new Set(allCategories))];
  }, [allBooks]);

  const authors = useMemo(() => {
    const allAuthors = allBooks.map((book) => book.author || "Unknown");
    return ["All", ...Array.from(new Set(allAuthors))];
  }, [allBooks]);

  useEffect(() => {
    const results = allBooks.filter((book) => {
      const matchesSearch =
        book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book?.author?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || book.category === selectedCategory;

      const matchesAuthor =
        selectedAuthor === "All" || book.author === selectedAuthor;

      const matchesPrice =
        Number(book.price) >= priceRange[0] &&
        Number(book.price) <= priceRange[1];

      return matchesSearch && matchesCategory && matchesAuthor && matchesPrice;
    });

    setFilteredBooks(results);
  }, [searchQuery, allBooks, selectedCategory, selectedAuthor, priceRange]);

  const handleAddToCart = (book, e) => {
    e.stopPropagation();
    const bookId = book.id || book._id;
    if (!bookId) return;

    if (cart.some((item) => item.id === bookId)) {
      increaseQty(bookId);
    } else {
      addToCart({ ...book, id: bookId, quantity: 1 });
    }
  };

  const handleBookClick = (book) => {
    navigate(`/books/${book._id || book.id}`, { state: { book } });
  };

  const renderedBooks = useMemo(() => (
    filteredBooks.map((book) => (
      <div
        key={book._id || book.id}
        className="bg-white bg-opacity-90 border border-gray-200 rounded-2xl p-3 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
        onClick={() => handleBookClick(book)}
      >
        {book.coverImage ? (
          <img
            loading="lazy"
            src={book.coverImage}
            alt={book.title}
            className="h-56 w-full object-contain mb-3 rounded-xl"
          />
        ) : (
          <div className="h-56 w-full mb-3 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        <div className="flex flex-col justify-between flex-grow">
          <div className="mb-2">
            <h2 className="text-base font-semibold text-gray-800 line-clamp-2">{book.title}</h2>
            <p className="text-xs text-gray-600 mb-1">
              by {book.author || "Unknown"}
            </p>
            <div className="text-base font-medium text-green-700 bg-green-100 inline-block px-2 py-1 rounded-full">
              ₹{book.price}
            </div>
          </div>

          <button
            onClick={(e) => handleAddToCart(book, e)}
            className={`mt-2 flex items-center justify-center gap-2 py-1 px-3 text-sm rounded-xl font-semibold transition shadow-sm ${
              book.stock <= 0
                ? "bg-red-100 text-red-700 border border-red-300 cursor-not-allowed"
                : cart.some((item) => item.id === (book.id || book._id))
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-indigo-100 text-indigo-700 border border-indigo-300 hover:bg-indigo-200"
            }`}
            disabled={book.stock <= 0}
          >
            <FaShoppingCart />
            {book.stock <= 0 ? "Out of Stock" : cart.some((item) => item.id === (book.id || book._id)) ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    ))
  ), [filteredBooks, cart]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-pink-50 min-h-screen pt-16">
      <Navbar setSearchQuery={setSearchQuery} />

      <div className="max-w-screen-2xl mx-auto container md:px-20 px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
          Discover Your Next Favorite Book
        </h1>

        {/* Filters */}
        <div className="bg-white bg-opacity-80 border border-gray-200 rounded-2xl p-4 shadow mb-8">
          <div className="flex items-center gap-2 mb-3">
            <FiFilter className="text-xl text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">Filter Books</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border bg-white text-black border-gray-300 rounded-xl"
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Author</label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full p-2 border bg-white text-black border-gray-300 rounded-xl"
              >
                {authors.map((auth, i) => (
                  <option key={i} value={auth}>{auth}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                  className="w-20 p-2 border bg-white text-black border-gray-300 rounded-xl"
                />
                <span className="text-gray-600">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className="w-20 p-2 border bg-white text-black border-gray-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedAuthor("All");
                  setPriceRange([0, 1000]);
                  setSearchQuery("");
                }}
                className="w-full bg-gradient-to-tr from-red-100 to-pink-200 hover:from-red-200 hover:to-pink-300 text-black font-semibold py-2 rounded-xl shadow transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {renderedBooks}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Discover;
