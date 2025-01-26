"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Popup from "@/components/utilities/PopUp";
import Unauthorized from "@/components/utilities/Unauthorized";
import { useUserContext } from "@/context/AuthContext";
import { createScratchCard } from "@/lib/actions/scratchCard.actions";
import React, { useState } from "react";

const CreateCards = () => {
  const [quantity, setQuantity] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // Success state
  const [isError, setIsError] = useState<boolean>(false); // Failure state
  const { user } = useUserContext();

  const handleCreation = async () => {
    setIsLoading(true); // Set loading to true when the button is clicked
    setIsSuccess(false); // Reset success state before starting
    setIsError(false); // Reset error state before starting
    try {
      const createdScratchCards = await createScratchCard({ amount: quantity });
      setIsLoading(false); // Set loading to false after the request is complete

      if (createdScratchCards) {
        setIsSuccess(true); // Set success state if creation is successful
      } else {
        setIsError(true); // Set error state if something goes wrong
      }
    } catch (error) {
      setIsLoading(false); // Set loading to false in case of an error
      setIsError(true); // Set error state in case of a failure
      console.error("Error creating scratch cards:", error);
    }
  };

  if (user.role !== "admin") {
    return <Unauthorized />;
  }

  const closeSuccessPopup = () => setIsSuccess(false);
  const closeErrorPopup = () => setIsError(false);

  return (
    <div>
      <div>
100 per time...
        <Input
          type="number"
          max="500" // Sets the maximum value to 500
          className=""
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value); // Default to 1 if value is invalid
            setQuantity(value <= 100 ? value : 0); // Ensure the value doesn't exceed 500
          }}
        />

        <Button
          onClick={handleCreation}
          disabled={isLoading || !quantity || quantity === 0}
          className={`bg-purple-500 text-white py-5 px-8 rounded-full hover:bg-purple-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 mt-12 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <span className="animate-spin">Loading...</span>
          ) : (
            "Create Scratch Cards"
          )}
        </Button>

        {isSuccess && (
          <Popup
            type="success"
            message="Scratch card(s) created successfully."
            onClose={closeSuccessPopup}
          />
        )}

        {isError && (
          <Popup
            type="failure"
            message="Failed to create scratch card(s). Please try again."
            onClose={closeErrorPopup}
          />
        )}
      </div>
    </div>
  );
};

export default CreateCards;
