"use client"
import ResultPage from '@/components/utilities/StudentResult'
import SubjectResultUploader from '@/components/utilities/View'
import React, { useEffect, useState } from 'react'
import Unauthorized from "@/components/utilities/Unauthorized";
import { useUserContext } from "@/context/AuthContext";

import ScratchCardOTP from "@/components/utilities/GetCard"
import { getMe } from '@/lib/actions/user.actions';
const AllResults = () => {

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
      <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white">
        <div className="animate-spin rounded-full border-t-4 border-purple-600 w-16 h-16 mb-4"></div>
        <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">
          Loading, please wait...
        </p>
      </div>
    );
  }
  return     <div className="justify-center items-center w-full h-full">{!user ? <div>Loading</div> : user.role === "admin"|| admin ? <SubjectResultUploader/>:<Unauthorized/>}</div>;
};

export default AllResults