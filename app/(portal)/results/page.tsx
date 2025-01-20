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

  return     <div className="justify-center items-center w-full h-full">{ user.role === "admin"|| admin ? <SubjectResultUploader/>:<Unauthorized/>}</div>;
};

export default AllResults