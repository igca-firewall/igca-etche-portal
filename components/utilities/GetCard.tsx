"use client";
import React, { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is set up in your project.
import { useScratchCards } from "@/lib/actions/scratchCard.actions";
import { createScratchCard } from "@/lib/actions/scratchCard.actions";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthContext";
const ScratchCardOTP  = ({
  classRoom,
  term,
  session,
  name,
}: {
  classRoom?: string;
  name?: string;
  session?: string;
  term?: string;
}) => {
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const hem = code.length === 8;
  const { user } = useUserContext();
  const [isAllowed, setIsAllowed] = useState(false);
  const [fish , setFish] = useState("")
  const router = useRouter();
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  // const handleRoute = () => {
  //   router.push("/")
  // }

  useEffect(() => {
    const fetch = async () => {
     
      try {
        if (code.length === 8) {
          setIsLoading(true); 
          setFeedback({ message: "Processing your scratch card...", type: "info" });

          const result = await useScratchCards({ code });
          setIsLoading(false);
          if (result) {
            setFeedback({
              message: "Scratch card validated and processed successfully!",
              type: "success",
            });
            setCode("");
            setIsAllowed(true) ;
            setFish("Garri wan wound persin oo") // Reset the input field
          } else {
            setFeedback({
              message: "Invalid or expired scratch card. Please check your internet connection or try again later.",
              type: "error",
            });
          }
        }
      } catch (error) {
        setFeedback({
          message: "An unexpected error occurred. Please try again later.",
          type: "error",
        });
      
        console.error("Error in scratch card submission:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (hem) {
      fetch();
    }
  }, [hem]);
  
  const draftKey = "Permitted by Particles";
  const draftKey_grantedUnder = `${classRoom}_${term}_${session}_${name} Granted Permission by Particles and to ${user.name}`;
  function isMad() {
    const a = localStorage.setItem(
      `Access Rights_${draftKey}`,
      draftKey_grantedUnder
    );
    return a;
  }
  const handleSubmit = async () => {
    await createScratchCard();
    // if (code.trim().length !== 8 || !/^[0-9]{8}$/.test(code)) {
    //   setFeedback({ message: "Please enter a valid 8-digit scratch card code.", type: "error" });
    //   return;
    // }

    setIsLoading(true);
    setFeedback({ message: "Processing your scratch card...", type: "info" });

    try {
      if (code.length === 8) {
        setIsLoading(true);
        const result = await useScratchCards({ code });
        setIsLoading(false);
        if (result) {
          setFeedback({
            message: "Scratch card validated and processed successfully!",
            type: "success",
          });
          setCode(""); // Reset the input field
        } else {
          setFeedback({
            message: "Invalid or expired scratch card. Please check your internet connection or try again later.",
            type: "error",
          });
        }
      }
    } catch (error) {
      setFeedback({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
      console.error("Error in scratch card submission:", error);
    } finally {
      setIsLoading(false);
    }
  };
  if (isAllowed) {
    isMad();
  }
  return (
    <div className="flex flex-col items-center justify-center font-nunito min-h-screen justify-items-center w-full  px-32">
      <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-[25px] shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-4">
          Scratch Card Verification
        </h2>
        <h2 className="text-[14px] text-gray-800 dark:text-gray-100 text-center mb-4">
          Enter a scratch card pin number
        </h2>
        {feedback && (
          <div
            className={`my-4 p-3 text-sm rounded-full bg-opacity-70 text-center 
              ${
                feedback.type === "success"
                  ? "bg-green-100  text-green-800"
                  : ""
              }
              ${feedback.type === "error" ? "bg-red-100  text-red-800" : ""}
              ${feedback.type === "info" ? "bg-blue-100  text-blue-800" : ""}`}
          >
            {feedback.message}
          </div>
        )}

        <InputOTP
          maxLength={8}
          value={code}
          onChange={(value) => setCode(value)}
        >
          <InputOTPGroup className="flex justify-between gap-2 w-full">
            {Array.from({ length: 8 }, (_, index) => (
              <InputOTPSlot
                key={index}
                className="w-16 h-16 text-center text-xl border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                index={index}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <button
          onClick={handleSubmit}
          className={`w-full p-3 px-6 py-5 mt-4 text-white font-semibold rounded-full transition 
            ${
              isLoading || code.length < 8
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          disabled={isLoading || code.length < 8}
        >
          {isLoading ? "Processing..." : "Verify Code"}
        </button>
      </div>
      {isAllowed &&( <button
          onClick={handleSubmit}
          className={`w-full p-3 px-6 py-5 mt-4 text-white font-semibold rounded-full transition 
            ${
              isLoading || code.length < 8
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          disabled={isLoading || code.length < 8}
        >
          {isLoading ? "Processing..." : "Verify Code"}
        </button> )
      }
    </div>
  );
};

export default ScratchCardOTP;
