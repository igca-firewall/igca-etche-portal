"use client"
import React from "react";
import { useUserContext } from "@/context/AuthContext";
import ProfileCard from "@/components/utilities/StudentFrotCard";
const CheckResults = () => {

  return (
    <div className="justify-center items-center w-full h-full">
        <ProfileCard name="Agbai John" className="SS3 Peculiar" age={16} />
    </div>
  );
};
export default CheckResults;
