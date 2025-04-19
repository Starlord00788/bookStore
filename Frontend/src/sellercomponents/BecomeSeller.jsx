import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/footer.jsx';
const BecomeSeller = () => {
  const [shopName, setShopName] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      const { data } = await axios.post(
        "https://bookstore-backend-qylv.onrender.com/api/v1/seller/become",
        { shopName, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Successfully became a seller!");
      navigate("/seller/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="pt-16">
      <Navbar />
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Become a Seller</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Shop Name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <textarea
            placeholder="Your Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default BecomeSeller;
