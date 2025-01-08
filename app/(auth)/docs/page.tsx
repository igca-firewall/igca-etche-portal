"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {  FaFacebook, FaWhatsapp, FaPhone } from "react-icons/fa";

import { MailIcon } from "lucide-react";

const Docs = () => {
  const router = useRouter();

  const socialMediaIcons = [
    { id: 1, link: "https://web.facebook.com/christina.emegwa1", icon: <FaFacebook size={18}/>, name: "Facebook" },
    { id: 2, link: "https://wa.me/+2348038858159", icon: <FaWhatsapp size={18}/>, name: "Whatsapp" },
    { id: 3, link: "tel:+2348038858159", icon: <FaPhone className="rotate-90" size={18} />, name: "Phone" },
    { id: 4, link: "mailto:tinahez3@gmail.com", icon: <MailIcon size={18} />, name: "Gmail" },
  ];

  const handleSignInNavigation = () => {
    router.push("/sign-in"); // Navigates to the sign-in page
  };
 

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-16 flex flex-col items-center justify-center min-h-screen bg-gradient-to-r dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 from-gray-50 via-gray-100 to-gray-200">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
        We Shape the Future
      </h1>
      <p className="text-base sm:text-lg text-gray-700 dark:text-neutral-300 mb-7 text-center max-w-lg leading-relaxed font-semibold">
        Join the Intellectual Giants Christian Academy now!
      </p>
      <p className="text-base sm:text-lg text-gray-700 dark:text-neutral-300 mb-5 text-center max-w-lg leading-relaxed">
        Join our community and unlock the potential of learning and growth.
        Empower yourself and others by stepping into the future with us.
      </p>
<div className="flex flex-col gap-4 items-center justify-center ">
 <button
        onClick={handleSignInNavigation}
        className="flex items-center justify-center px-8 py-4 text-lg font-semibold text-white  bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg transform transition-transform hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Get Started - Sign in
      </button>
      {/* <button 
        onClick={handleSignUpNavigation}
        className="flex items-center justify-center px-12 py-4 text-lg font-semibold text-gray-800 bg-gray-300  rounded-full hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-600 shadow-lg transform transition-transform hover:scale-105"
      >
        
        Create New Account!
      </button> */}
</div>
      {/* <div className="flex-col bottom-0 gap-3 mt-14 mb-0 sticky items-center justify-center text-center">
            <p className="flex text-center items-center justify-center  text-gray-400 dark:text-neutral-500 text-sm font-nunito">
              By Signing in, you accept our{" "}
            </p>
            <Link href="/privacy-policy" className="">
              <p className="flex text-center text-gray-400 items-center justify-center dark:text-neutral-500 text-sm underline font-nunito">
                Privacy Policy and Terms of Use.
              </p>
            </Link>
          </div> */}
      <div className="flex flex-col items-center w-full sm:w-auto">
        <p className="text-lg text-start mt-16 text-gray-700 dark:text-gray-300 mb-6 max-w-lg leading-relaxed font-semibold">
          Contact us @
        </p>

        <hr className="h-2 bg-gray-800 dark:bg-gray-200" />

        <div className="flex gap-4 items-center cursor-pointer text-center mt-3 mb-3 justify-center">
          {socialMediaIcons.map((media) => (
            <Link href={media.link} key={media.id} title={media.name}>
              <div className="text-xl max-sm:text-2xl lg:p-2 md:p-2 max-sm:p-3 rounded-full  max-sm:border border-gray-400 hover:scale-110 transition-transform duration-300">
                {media.icon}
              </div>
            </Link>
          ))}
        </div>
      </div>
     
    </div>
  );
};

export default Docs;
