"use client";
import StudentForm from "@/components/utilities/StudentsForm";
import Unauthorized from "@/components/utilities/Unauthorized";
import { useUserContext } from "@/context/AuthContext";
import { getMe } from "@/lib/actions/user.actions";

import React, { useEffect, useState } from "react";

const Registration = () => {
  const { user } = useUserContext();

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full h-full">
        {user.role === "admin" ? <StudentForm /> : <Unauthorized />}
      </div>
    </div>
  );
};

export default Registration;
