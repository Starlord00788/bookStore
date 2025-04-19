import React from 'react';

const SearchBar = ({ setSearchQuery }) => {  // Accepting prop here
  return (
    <div>
      <label className="border rounded-md flex items-center gap-2">
        <input 
          type="text" 
          className="grow text-gray-800 bg-white py-2 px-3 outline-none" 
          placeholder="Search" 
          onChange={(e) => setSearchQuery(e.target.value)}  // Updating searchQuery state
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-5 w-5 mr-2 cursor-pointer opacity-70">
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
    </div>
  );
};

export default SearchBar;
