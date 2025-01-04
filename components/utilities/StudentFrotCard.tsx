"use client";
import { useUserContext } from "@/context/AuthContext";
import Image from "next/image";
import ScratchCardOTP from "./GetCard";
import { useState, useEffect } from "react";

const ProfileCard = ({
  name,
  className,
  age,
  session,
  term,
  classRoom,
}: {
  name: string;
  age?: number;
  className?: string;
  session?: string;
  term?: string;
  classRoom?: string;
}) => {
  const draftKeys = "Permitted by Particles";
  const { user } = useUserContext();

  const [AdminInLocalStorage, setAdminInLocalStorage] = useState<string | null>(
    null
  );

  useEffect(() => {
    const adminRights = localStorage.getItem(`Access Rights_${draftKeys}`);
    setAdminInLocalStorage(adminRights);
  }, [draftKeys]);

  if (!user) {
    return <div>The page is loading...</div>;
  }

  if (user.role !== "admin" && !AdminInLocalStorage) {
    return <ScratchCardOTP />;
  }

  return (
    <div className="bg-white border border-gray-200 dark:border-neutral-700 shadow-lg rounded-2xl font-nunito dark:bg-neutral-800 h-full w-96 p-6 flex flex-col items-center transition-transform transform hover:scale-105">
      {/* Profile Image */}
      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-md">
        <Image
          src="/images/th.jpg"
          alt="student"
          className="object-cover"
          width={112}
          height={112}
        />
      </div>

      {/* Name */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-5">
        {name}
      </h2>

      {/* Class and Age */}
      <p className="text-base text-gray-600 dark:text-gray-400 mt-2">
        {className}{" "}
        <span className="mx-2 text-gray-500 dark:text-gray-600">&#8226;</span>{" "}
        {age} years old
      </p>

      {/* Action Button */}
      <button className="mt-4 px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700">
        View Results
      </button>
    </div>
  );
};

export default ProfileCard;
