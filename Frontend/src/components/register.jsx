import React from "react";

const Register = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Set a password"
          />
        </div>
        <div className="lg:col-span-2">
          <label className="block mb-1">Address</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="What is your address?"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block mb-1">Town</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter your town"
          />
        </div>
        <div>
          <label className="block mb-1">State</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter your state"
          />
        </div>
        <div>
          <label className="block mb-1">Zip Code</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Zip Code"
          />
        </div>
        <div>
          <label className="block mb-1">Country</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter your country"
          />
        </div>
      </div>

      <div className="text-left">
        <button className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700">
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Register;
