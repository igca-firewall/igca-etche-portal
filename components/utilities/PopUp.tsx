"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import { FaWhatsapp } from "react-icons/fa";
import { MailIcon } from "lucide-react";
import Link from "next/link";

type PopupType = "success" | "failure";

interface PopupProps {
  type: PopupType;
  message: string;
  onClose: () => void;
  contact?: boolean;
  degree?: string;
}

const sounds = {
  success: new Howl({ src: ["/sounds/success.mp3"] }),
  failure: new Howl({ src: ["/sounds/failure.mp3"] }),
};
const socialMediaIcons = [
  {
    id: 2,
    link: "https://wa.me/+2348038858159",
    icon: <FaWhatsapp size={18} />,
    name: "+2348038858159",
  },
  {
    id: 4,
    link: "mailto:tinahez3@gmail.com",
    icon: <MailIcon size={18} />,
    name: "Gmail",
  },
];
const Popup: React.FC<PopupProps> = ({
  type,
  message,
  onClose,
  contact,
  degree,
}) => {
  // Play sound on render
  React.useEffect(() => {
    sounds[type]?.play();
  }, [type]);

  const isSuccess = type === "success";
  const [isXed, setIsXed] = useState(false);
  return (
    <div className="fixed font-nunito inset-0 flex items-center backdrop-blur-sm justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ y: "-100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100vh", opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="bg-white p-8  rounded-[25px] shadow-xl max-w-md w-full text-center"
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
          {isSuccess
            ? `${degree ? `Successfully ${degree}!` : "Success!"}`
            : `${degree ? `${degree} Failed!` : "Failed"}`}
        </h2>

        {/* Message */}
        <p className="text-gray-700">{message}</p>
        {contact && (
          <div className="mt-4 items-enter ">
            <p>You can contact the admins @</p>
            <div className="flex gap-4 items-center cursor-pointer text-center mt-3 mb-3 justify-center">
              {isXed
                ? "Processing..."
                : socialMediaIcons.map((media) => (
                    <Link
                      href={media.link}
                      key={media.id}
                      title={media.name}
                      onClick={() => setIsXed(true)}
                      aria-disabled={isXed}
                    >
                      <div className="text-xl max-sm:text-2xl  max-sm:p-3 rounded-full  max-sm:border border-gray-400 hover:scale-110 transition-transform duration-300">
                        {media.icon}
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        )}
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
