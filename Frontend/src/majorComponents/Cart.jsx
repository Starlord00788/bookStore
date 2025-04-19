import React from "react";
import { useCart } from "../context/CartContent";
import Footer from "../components/footer";
import Navbar from "../components/Navbar";
import loadRazorpayScript from "../utils/loadrazorpay";

const Cart = () => {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();

  const handleIncreaseQty = (id) => {
    increaseQty(id);
  };

  const handleDecreaseQty = (id, quantity) => {
    if (quantity === 1) {
      removeFromCart(id);
    } else {
      decreaseQty(id);
    }
  };

  let userId = null;

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    userId = user?._id;
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
  }

  const handleCheckout = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const totalAmount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const res = await fetch("https://bookstore-backend-qylv.onrender.com/api/v1/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount, currency: "INR" }),
    });

    const data = await res.json();
    const { id: order_id, amount, currency } = data.order;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount,
      currency,
      order_id,
      name: "NovelNimbus",
      description: "Book Purchase",
      handler: async (res) => {
        const verifyRes = await fetch("https://bookstore-backend-qylv.onrender.com/api/v1/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...res, userId, cartItems: cart }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          alert("✅ Payment Successful!");

          const paymentDetails = {
            razorpay_order_id: res.razorpay_order_id,
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_signature: res.razorpay_signature,
          };

          const orderRes = await fetch("https://bookstore-backend-qylv.onrender.com/api/v1/orders/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              items: cart,
              amount,
              paymentDetails,
            }),
          });

          const orderData = await orderRes.json();
          if (orderData.success) {
            localStorage.removeItem("cart");
            window.location.reload();
            window.location.href = "/orders";
          } else {
            alert("Order could not be created");
          }
        } else {
          alert("❌ Payment Verification Failed.");
        }
      },
      prefill: {
        name: "Your Name",
        email: "youremail@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#6366f1",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-screen pt-8">
      <Navbar />
      <div className="max-w-screen-2xl mx-auto px-6 py-12 mt-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-12 text-center drop-shadow-lg">
          🛒 Your Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-xl text-gray-600">
            Your cart is currently empty. Start adding books!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {cart.map((item, index) => (
              <div
              key={item.id || item._id || index}
              className="backdrop-blur-md bg-white/70 border border-white rounded-2xl shadow-md transition-all hover:scale-105 hover:shadow-lg p-4"
            >
              {item.coverImage ? (
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="h-40 w-full object-contain rounded-lg mb-3 shadow-sm"
                />
              ) : (
                <div className="h-40 w-full mb-3 bg-gray-300 flex items-center justify-center text-gray-500 rounded-lg text-xs">
                  No Image Available
                </div>
              )}
            
              <div>
                <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">{item.title}</h2>
                <p className="text-xs text-gray-600 mb-1">
                  by <i>{item.author || "Unknown"}</i>
                </p>
                <div className="text-xs font-bold text-green-600 bg-green-100 inline-block px-2 py-0.5 rounded-full mb-2">
                  ${item.price}
                </div>
            
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => handleDecreaseQty(item.id, item.quantity)}
                    className="bg-red-500 text-white rounded-full px-2 py-0.5 hover:bg-red-600 text-xs"
                  >
                    -
                  </button>
                  <span className="text-base font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleIncreaseQty(item.id)}
                    className="bg-green-500 text-white rounded-full px-2 py-0.5 hover:bg-green-600 text-xs"
                  >
                    +
                  </button>
                </div>
            
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Remove
                  </button>
                  <span className="text-xs font-medium text-gray-700">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-12 text-center">
            <button
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-md hover:shadow-xl transition-all duration-300"
              onClick={handleCheckout}
            >
              🛍️ Proceed to Checkout
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
