import React from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";

type PopupType = "success" | "failure";

interface PopupProps {
  type: PopupType;
  message: string;
  onClose: () => void;
}

const sounds = {
  success: new Howl({ src: ["/sounds/success.mp3"] }),
  failure: new Howl({ src: ["/sounds/failure.mp3"] }),
};

const Popup: React.FC<PopupProps> = ({ type, message, onClose }) => {
  // Play sound on render
  React.useEffect(() => {
    sounds[type]?.play();
  }, [type]);

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ y: "-100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100vh", opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center"
      >
        {/* Header Icon */}
        <div
          className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isSuccess ? (
            <span className="text-green-500 text-4xl">✔️</span>
          ) : (
            <span className="text-red-500 text-4xl">❌</span>
          )}
        </div>

        {/* Title */}
        <h2
          className={`text-2xl font-bold mb-2 ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {isSuccess ? "Success!" : "Error"}
        </h2>

        {/* Message */}
        <p className="text-gray-700">{message}</p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`mt-6 px-6 py-2 rounded-full text-white transition duration-300 ${
            isSuccess
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default Popup;
