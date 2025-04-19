import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Demo = () => {
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const passwordRef = useRef(null);

  useEffect(() => {
    // Focus on password if email was passed from previous page
    if (emailFromState && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [emailFromState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://bookstore-frontend-6pbo.onrender.com/api/v1/users/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { accessToken, refreshToken } = response.data?.data;
      const { fullname, avatar, role } = response.data?.data?.loggedUser;

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("fullname", fullname);
        localStorage.setItem("avatar", avatar);
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(response.data?.data?.loggedUser));
        navigate("/");
      } else {
        setError("Login failed");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
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
              className="absolute cursor-pointer inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-lg opacity-70"
            />
            <div className="relative z-10 flex cursor-pointer items-center justify-center w-full h-full rounded-full bg-white shadow-md text-4xl">
              🤖
            </div>
          </div>
        </motion.div>

        <h2 className="text-center text-3xl font-bold text-indigo-700 mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl text-black bg-white/80 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              ref={passwordRef}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl text-black bg-white/80 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-xl font-semibold shadow-lg hover:shadow-purple-400 transition-all"
          >
            Sign In
          </motion.button>
        </form>

        {error && (
          <p className="mt-4 text-center text-red-600 text-sm">{error}</p>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-purple-700 font-semibold cursor-pointer hover:underline"
            >
              Register now
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Demo;
