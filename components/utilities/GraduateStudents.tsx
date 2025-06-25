import React, { useState } from "react";
import { Button } from "../ui/button";
import Loader from "./Loader";
import { GRADUATE_STUDENTS } from "@/lib/actions/studentsData.actions";
import Popup from "./PopUp";

const GraduateStudents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGraduated, setIsGraduated] = useState(false);
  const [failedGraduation, setfailedGraduation] = useState(false);
  const closeFailurePopup = () => {
    setfailedGraduation(false);
  };
  const closeSuccessPopup = () => {
    setIsGraduated(false);
  };
  const handleGraduation = async () => {
    try {
      setIsLoading(true);
      const graduatedStudents = await GRADUATE_STUDENTS();
      graduatedStudents ? setIsGraduated(true) : setfailedGraduation(true);
    } catch (error) {
      console.error("Error during graduation:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center text-center">
      <Button
        className="bg-purple-500 rounded-full px-8 py-2 "
        onClick={() => handleGraduation()}
      >
        {isLoading ? (
          <div>
            <Loader />{" "}
            <p className=" font-nunito text-enter text-white ">Loading...</p>
          </div>
        ) : (
          "Start Graduation"
        )}
      </Button>

      <div>
        {isGraduated && (
          <Popup
            type="success"
            message="All students have been successfully graduated!"
            onClose={closeSuccessPopup}
            degree="Graduation!"
          />
        )}{" "}
        {failedGraduation && (
          <Popup
            type="failure"
            message="There was a problem graduating the students. Please try again later."
            onClose={closeFailurePopup}
            degree="Graduation"
          />
        )}
      </div>
    </div>
  );
};

export default GraduateStudents;
