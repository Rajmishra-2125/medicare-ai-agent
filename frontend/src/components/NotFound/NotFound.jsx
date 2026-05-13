import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 transition-colors duration-200">
      <div className="text-center max-w-lg w-full">
        {/* Animated Icon Container */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/10 blur-3xl rounded-full"></div>
          <div className="relative p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-800">
            <AlertTriangle className="w-20 h-20 text-indigo-600 dark:text-indigo-400 animate-bounce" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800 mb-4 tracking-tighter">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
          Don't worry, even the best travelers get lost sometimes.
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 active:scale-95"
          >
            <Home className="w-5 h-5" />
            Back to Safety
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl font-bold transition-all duration-200 border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
