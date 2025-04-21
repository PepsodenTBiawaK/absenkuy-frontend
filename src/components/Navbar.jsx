import React from 'react';

const Navbar = ({ title }) => {
  const userName = localStorage.getItem('name');

  return (
    <nav className="bg-white text-gray-800 shadow m-4 px-6 rounded-xl py-4 flex justify-between items-center border-b border-gray-200">
      <div className="text-xl font-semibold">{title}</div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">👤 {userName}</span>
      </div>
    </nav>
  );
};

export default Navbar;
