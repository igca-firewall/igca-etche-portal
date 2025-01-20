import React from "react";
import { useRouter } from "next/navigation";
import { FaLock, FaHome } from "react-icons/fa";
import { useUserContext } from "@/context/AuthContext";
import Loader from "./Loader";

const Unauthorized = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const handleGoHome = () => {
    router.push("/");
  };
  if (user.$id === "" || user.$id === undefined || user.$id === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Loader Animation */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-purple-600 font-bold">
          ⏳
        </div>
      </div>

      {/* Message Section */}
      <div className="mt-6 text-center space-y-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Please Hold On!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          We are currently processing your identity. This might take a moment, 
          but we’re making sure everything is perfect. Thank you for your patience.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          If this takes too long, please contact our support team for assistance.
        </p>
      </div>

      {/* Footer Section */}
      <div className="mt-8 text-gray-500 dark:text-gray-400 text-sm">
        <span className="italic">“Good things take time”</span> — IGCA Firewall
      </div>
    </div>
    );
  }
  return (
    <div className="max-h-screen flex flex-col items-center justify-center text-neutral-950 dark:text-white px-6">
      {/* SEO Optimization */}

      {/* Lock Icon */}
      <div className="bg-purple-600 dark:bg-purple-800 p-6 rounded-full shadow-lg mb-8">
        <FaLock className="text-white text-5xl" />
      </div>

      {/* Error Message */}
      <h1 className="text-4xl font-extrabold mb-4 text-center text-neutral-950 dark:text-white tracking-tight">
        Access Denied
      </h1>
      <p className="text-center text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
        Sorry, you don’t have permission to view this page. If you think this is
        an error, please contact your administrator for assistance.
      </p>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={handleGoHome}
          className="flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 transition focus:outline-none focus:ring focus:ring-purple-500"
        >
          <FaHome className="mr-2" /> Go to Home
        </button>

        <button
          onClick={() => router.push("/docs")}
          className="flex items-center px-6 py-3 bg-gray-200 text-neutral-600 font-medium rounded-lg shadow-md hover:bg-gray-300 transition focus:outline-none focus:ring focus:ring-purple-500"
        >
          Contact Support
        </button>
      </div>

      {/* Decorative Element */}
    </div>
  );
};

export default Unauthorized;
