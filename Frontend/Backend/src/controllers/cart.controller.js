import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";

const getCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.book");
    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500, error?.message || "Server Error");
  }
});
const addtoCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { bookId, quantity } = req.body;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingBook = cart.items.find(
    (item) => item.book.toString() === bookId,
  );
  if (existingBook) {
    existingBook.quantity += quantity || 1;
  } else {
    cart.items.push({ book: bookId, quantity: quantity || 1 });
  }
  await cart.save();
  res
    .status(200)
    .json(
      new ApiResponse(
        201,
        cart,
        " Items have been successfully added to the cart",
      ),
    );
});
const deletefromCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter((item) => item.book.toString() !== bookId); // filtering books other than this book

    if (cart.items.length === initialItemCount) {
      throw new ApiError(404, "Book was not in the cart");
    }

    await cart.save();
    res.status(200).json({
      status: 201,
      cart,
      success: true,
      message: "Book has been successfully deleted from the cart",
    });
  } catch (error) {
    console.error("Error deleting from cart:", error);
    throw new ApiError(500, error?.message || "Server Error");
  }
});
export { getCart, addtoCart, deletefromCart };
