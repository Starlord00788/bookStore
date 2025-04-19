import { Book } from "../models/book.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyAdmin } from "../middlewares/admin.authentication.middleware.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import axios from "axios";

const getlimitedbooks = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find().limit(1);
    res.json(books);
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error");
  }
});
// controllers/book.controller.js or wherever your handler is
const relatedBooks = asyncHandler(async (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ success: false, message: "Category is required" });
  }

  const books = await Book.find({ category });
  res.status(200).json({ success: true, data: books });
});

const fetchBooksFromGoogle = asyncHandler(async (req, res) => {
  // Verify that the user is an admin before proceeding
  verifyAdmin(req, res, async () => {
    const { query } = req.body;

    if (!query || query.trim() === "") {
      throw new ApiError(400, "Search query is required to fetch books.");
    }

    const googleAPI = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&key=${process.env.BOOKS_API_KEY}`;

    try {
      const response = await axios.get(googleAPI);
      const items = response.data.items || [];

      if (items.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No books found for this query."));
      }

      // 🟢 Just map books and send back — don’t save!
      const books = items.map(item => {
        const volume = item.volumeInfo;

        // Modify the cover image URL for better resolution
        const highResCoverImage = volume.imageLinks?.thumbnail
          ? volume.imageLinks.thumbnail.replace(/zoom=\d/, 'zoom=3') // Adjust zoom value
          : "";

        return {
          title: volume.title,
          author: volume.authors?.[0] || "Unknown",
          description: volume.description || "No description available",
          category: volume.categories?.[0] || "General",
          coverImage: highResCoverImage, // Use the updated image URL
          price: parseFloat((Math.random() * 1000 + 100).toFixed(2)),
          stock: Math.floor(Math.random() * 30 + 1),
        };
      });

      res.status(200).json(new ApiResponse(200, books, "Books fetched successfully"));

    } catch (err) {
      console.error(err);
      throw new ApiError(500, "Failed to fetch books from Google API");
    }
  });
});


const getBooks = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error");
  }
});

const addBook = async (req, res) => {
  try {
    const { title, author, description, price, stock, coverImage } = req.body;

    // Optional: Check if the book already exists (based on title or unique field)
    const existingBook = await Book.findOne({ title });
    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: "Book with this title already exists.",
      });
    }

    const newBook = new Book({
      title,
      author,
      description,
      price,
      stock,
      coverImage,
    });

    await newBook.save();

    res.status(201).json({
      success: true,
      message: "Book added successfully.",
      data: newBook,
    });
  } catch (error) {
    console.error("Error adding book:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

const updateBooks = asyncHandler(async (req, res) => {
  try {
    const updatedbook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedbook);
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error");
  }
});

const deleteBooks = asyncHandler(async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json("message : Book Deleted");
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error");
  }
});

export { getBooks, addBook, getlimitedbooks, updateBooks, deleteBooks, relatedBooks ,fetchBooksFromGoogle };
