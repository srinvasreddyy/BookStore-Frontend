import React from 'react';
import logo from '../assets/logo1.png'; // Adjust path if needed

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Pulsing logo */}
      <img
        src={logo}
        alt="Logo"
        className="w-32 h-32 mb-6 animate-pulse"
      />

      {/* Loading text */}
      <p className="text-lg text-gray-600 mb-4">Loading..</p>

      {/* 3 bouncing dots animation */}
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default Loading;
