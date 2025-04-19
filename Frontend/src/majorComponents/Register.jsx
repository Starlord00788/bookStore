import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    avatar: null,
  });

  const [otp, setOtp] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      const response = await axios.post(
        "https://bookstore-backend-qylv.onrender.com/api/v1/users/register",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.statusCode === 201) {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message);
    }
  };

  const handleOTPSubmit = async () => {
    if (!otp) return alert("Please enter the OTP");

    setIsVerifying(true);
    try {
      const response = await axios.post("https://bookstore-backend-qylv.onrender.com/api/v1/users/verify-otp", {
        email: formData.email,
        otp,
      });

      const { fullname, avatar, accessToken, refreshToken, _id } = response.data.data;
      localStorage.setItem("fullname", fullname);
      localStorage.setItem("avatar", avatar);
      localStorage.setItem("user", _id);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setIsModalOpen(false);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-200"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="flex justify-center mb-6"
        >
          <div className="relative w-20 h-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="absolute cursor-pointer inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 blur-lg opacity-70"
            />
            <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-white shadow-md text-4xl">
              📝
            </div>
          </div>
        </motion.div>

        <h2 className="text-center text-3xl font-bold text-indigo-700 mb-6">
          Create an Account 🚀
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl text-black bg-white/80 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl text-black bg-white/80 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm"
            required
          />
          <input
            type="text"
            name="fullname"
            placeholder="Full name"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl text-black bg-white/80 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl text-black bg-white/80 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Avatar
            </label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl bg-white/80 text-gray-700 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-xl font-semibold shadow-lg hover:shadow-purple-400 transition-all"
          >
            Register
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-purple-700 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </motion.div>

      {/* OTP Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-8 w-96 text-center shadow-2xl border border-purple-200">
            <h3 className="text-2xl font-bold text-green-600 mb-2">Verify Your Email</h3>
            <p className="text-gray-700 mb-4">Enter the OTP sent to your email:</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-xl text-black bg-white/80 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm mb-4"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOTPSubmit}
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white py-2 rounded-xl font-semibold shadow-lg hover:shadow-green-300 transition-all"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
