"use client";
import StudentForm from "@/components/utilities/StudentsForm";
import Unauthorized from "@/components/utilities/Unauthorized";
import { useUserContext } from "@/context/AuthContext";
import { getMe } from "@/lib/actions/user.actions";

import React, { useEffect, useState } from "react";

const Registration = () => {
  const { user } = useUserContext();
    const [admin, setAdmin] = useState(false);
    useEffect(() => {
      const fetchMe = async () => {
        const me = await getMe();
        if (me === "PARTICLES_ADMINISTRATOR_IGCA") setAdmin(true);
      };
      fetchMe();
    }, []);
  if (!user) {
    // Show loader and loading message if user is not yet known
    return (
      <div className="flex flex-col items-center justify-center w-full h-full ">
        <div className="animate-spin rounded-full border-t-4 border-purple-600 w-16 h-16 mb-4"></div>
        <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">
          Loading, please wait...
        </p>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full h-full">
        {!user ? <div>Loading</div> :user.role === "admin" || admin ? <StudentForm /> : <Unauthorized />}
      </div>
    </div>
  );
};

export default Registration;
