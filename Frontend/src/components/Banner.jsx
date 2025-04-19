import React, { useEffect, useState } from "react";
import banner from "../../public/Banner.png";
import { useNavigate } from "react-router-dom";
const Banner = () => {
  const [islogin, setLogin] = useState(false);
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState("");
  const [nameInput , setNameInput] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setLogin(true);
    }
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-20 my-5 flex flex-col md:flex-row items-center justify-between text-gray-800">
      {/* Left Text Section */}
      <div className="w-full md:w-1/2 mt-10 md:mt-28 order-2 md:order-1 space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Novel Nimbus welcomes you to{" "}
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            learn something new every day!
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700">
          Discover endless stories at your fingertips! Explore our vast eBook
          collection—bestsellers, classics, and hidden gems. Read anytime,
          anywhere. Start your journey today!
        </p>

        {!islogin && (
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="input input-bordered flex items-center gap-2 w-full sm:w-2/3 bg-white shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </label>
            <button
              onClick={() => {
                navigate("/login" , { state: { email: emailInput } });
              }}
              className="btn btn-secondary w-full sm:w-auto"
            >
              Already a customer?
            </button>
          </div>
        )}

        {islogin && (
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="input input-bordered flex items-center gap-2 w-full sm:w-2/3 bg-white shadow">
              <input
                type="text"
                className="grow"
                placeholder="Search for Books..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </label>
            <button
              onClick={() => {
                navigate("/discover" , { state: { name: nameInput } });
              }}
              className="btn btn-secondary w-full sm:w-auto"
            >
              Search
            </button>
          </div>
        )}
      </div>

      {/* Right Image Section */}
      <div className="w-full md:w-1/2 order-1 md:order-2 mt-10 md:mt-0">
        <img
          src={banner}
          alt="Banner"
          className="mx-auto max-w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Banner;
