import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const placeOrder = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.book");

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, " Cart is Empty");
    }

    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.book.price * item.quantity,
      0,
    );

    const order = await Order.create({
      user: userId,
      items: cart.items,
      totalAmount,
      status: "Processing",
    });
    if (!order) {
      throw new ApiError(500, "Server Error Order could not be initiated");
    }

    await order.save();

    await Cart.findOneAndDelete({ user: userId });

    res
      .status(200)
      .json(
        new ApiResponse(201, order, "Order has been initiated Successfullly"),
      );
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error");
  }
});

const getOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId });
  if (!orders) {
    throw new ApiError(404, "There has been no order from users end");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        201,
        orders,
        "Welcome Sir , these are your orders and they are under processing",
      ),
    );
});

const cancelOrder = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    console.log(userId)
    console.log(orderId)
    const order = await Order.findOneAndUpdate(
      { user: userId, _id: orderId },
      { status: "Cancelled" },
      { new: true },
    );

    if (!order) {
      throw new ApiError(400, " There are no order currently placed by you");
    }

    res
      .status(200)
      .json(new ApiResponse(200, order, " Order has been cancelled"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error ");
  }
});


export { placeOrder, getOrder, cancelOrder };
