"use client";
import React, { useEffect, useState } from "react";
import InputForm from "@/components/utilities/ScoreSheet";
import Unauthorized from "@/components/utilities/Unauthorized";
import { useUserContext } from "@/context/AuthContext";
import { getMe } from "@/lib/actions/user.actions";

const AddScore = () => {
  const { user } = useUserContext();
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const fetchMe = async () => {
      const me = await getMe();
      if (me === "PARTICLES_ADMINISTRATOR_IGCA") {
        setAdmin(true);
      }
    };
    fetchMe();
  }, []);


  return (
    <div className="justify-center items-center w-full h-full">
      {user.role === "admin" || admin ? <InputForm /> : <Unauthorized />}
    </div>
  );
};

export default AddScore;
