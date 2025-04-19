import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Demo from "./majorComponents/Login.jsx";
import Home from "./majorComponents/Home.jsx";
import Register from "./majorComponents/Register.jsx";
import Discover from "./majorComponents/Discover.jsx";
import PrivateRoute from "./components/privateRoute.jsx";
import BookDetails from "./majorComponents/BookDetails.jsx";
import Cart from "./majorComponents/Cart.jsx";
import Orders from "./majorComponents/Orders.jsx";
import AdminPage from "./majorComponents/Admin.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
const App = () => {
  return (
    <>
      <div className="bg-white ">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Demo />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/discover"
              element={
                <PrivateRoute>
                  <Discover />
                </PrivateRoute>
              }
            />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<div>404 Not Found</div>} /> 404 route
          </Routes>
        </Router>
      </div>
    </>
  );
};

export default App;
