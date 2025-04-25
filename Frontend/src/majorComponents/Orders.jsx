import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("accessToken");

  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id;

  useEffect(() => {
    if (!user || !userId || !storedToken) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`https://bookstore-backend-qylv.onrender.com/api/v1/orders/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!res.ok) throw new Error("Unauthorized or failed to fetch orders.");
        const data = await res.json();
        if (data.success) {
          const updatedOrders = data.orders.map(order => ({
            ...order,
            deliveryDate: generateRandomDeliveryDate(),
          }));
          setOrders(updatedOrders);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err.message);
        navigate("/login");
      }
    };

    fetchOrders();
  }, [user, userId, storedToken, navigate]);

  const generateRandomDeliveryDate = () => {
    const randomDays = Math.floor(Math.random() * 7) + 2; // Random between 2 to 8 days
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + randomDays);
    return deliveryDate;
  };

  const getStatus = (order) => {
    const currentDate = new Date();
    const deliveryDate = new Date(order.deliveryDate);
    if (currentDate < deliveryDate) {
      return "Out for Delivery";
    }
    return "Delivered";
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen pt-10 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {user && (
          <div className="flex items-center gap-4 mb-10 bg-white shadow-lg p-6 rounded-xl border border-indigo-300">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-16 h-16 rounded-full object-cover border-4 border-indigo-400 shadow"
              loading="lazy"
            />
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Welcome back, {user.fullName} 👋</h3>
              <p className="text-gray-600">Here’s a summary of your recent orders.</p>
            </div>
          </div>
        )}

        <h2 className="text-4xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          Your Orders
        </h2>

        {orders.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-10">No orders yet. Start shopping!</div>
        ) : (
          <div className="grid gap-8">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="border border-purple-200 rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-indigo-600">Order ID:</span> {order._id}
                  </p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    getStatus(order) === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {getStatus(order)}
                  </span>
                </div>

                <p className="text-gray-800 mb-2">
                  <strong>Total:</strong> ₹{(order.amount) / 10000}
                </p>

                <p className="font-semibold text-purple-700 mb-3">Items:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                  {order.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 border border-gray-100 rounded-lg p-2 bg-white"
                    >
                      <Package className="w-12 h-12 text-purple-500 border rounded p-1 bg-purple-50" />

                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-500 italic">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
