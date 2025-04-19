import {Seller} from "../models/seller.model.js";
import {Book} from "../models/book.model.js";

// 1. Become a Seller
export const becomeSeller = async (req, res) => {
  try {
    const { shopName, bio } = req.body;

    const existing = await Seller.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "Already a seller" });
    }

    const seller = new Seller({ user: req.user.id, shopName, bio });
    await seller.save();

    res.status(201).json({ message: "Seller created", seller });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Get Seller Info
export const getSellerInfo = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.id }).populate("user", "fullname avatar");
    if (!seller) return res.status(404).json({ message: "Not a seller yet" });

    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Get Books by Seller
export const getSellerBooks = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.id });
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const books = await Book.find({ seller: seller._id });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Add Book
export const addSellerBook = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.id });
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const book = new Book({ ...req.body, seller: seller._id });
    await book.save();
    res.status(201).json({ message: "Book added", book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Update Book
export const updateSellerBook = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.id });
    const book = await Book.findById(req.params.id);

    if (!seller || !book || book.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(book, req.body);
    await book.save();
    res.json({ message: "Book updated", book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6. Delete Book
export const deleteSellerBook = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.id });
    const book = await Book.findById(req.params.id);

    if (!seller || !book || book.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await book.deleteOne();
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
