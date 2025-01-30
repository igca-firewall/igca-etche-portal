"use client";
import React, { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is set up in your project.
import { useScratchCards } from "@/lib/actions/scratchCard.actions";
import { useRouter } from "next/navigation";
import PostDetails from "@/app/(portal)/result-details/page";

const ScratchCardOTP = ({
  classRoom,
  term,
  name,
  studentId,
  session
}: {
  classRoom?: string;
  name?: string;
  studentId: string;
  term?: string;
  session:string
}) => {
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [xed, setXed] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const router = useRouter();
  const [view, setView] = useState<{
    name: string;
    term: string;
    classRoom: string;
    studentId: string;
  } | null>(null);
  const hem = code.length === 8;
  const draftKey = name;
  const draftKeyGranted = `Particles granted you permission to: ${name}'s result for ${term}_${classRoom}`;

  useEffect(() => {
    const fetchScratchCard = async () => {
      if (code.length === 8) {
        setIsLoading(true);
        setFeedback({
          message: "Processing your scratch card...",
          type: "info",
        });

        try {
          const result = await useScratchCards({ code: code, usedFor: `${draftKeyGranted}` });
          if (result) {
            setFeedback({
              message: "Scratch card validated and processed successfully!",
              type: "success",
            });
            setCode(""); // Reset code after successful validation
            setIsAllowed(true);
            const fishData = {
              name: name!,
              term: term!,
              classRoom: classRoom!,
              studentId,
            };
            setView(fishData);
            localStorage.setItem(`${draftKeyGranted}`, draftKeyGranted);
        
          } else {
            setFeedback({
              message:
                "Invalid or expired scratch card. Please check your internet connection or try again later.",
              type: "error",
            });
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
      }
    };

    if (hem) {
      fetchScratchCard();
    }
  }, [hem, code]);

  const handleShit = async () => {
    setIsLoading(true);
    try {
      const result = await useScratchCards({ code, usedFor: draftKeyGranted , usedBy : name});
      if (result) {
        setFeedback({
          message: "Scratch card validated and processed successfully!",
          type: "success",
        });
        // Reset code after successful validation
        setIsAllowed(true);
        const fishData = {
          name: name!,
          term: term!,
          classRoom: classRoom!,
          studentId,
        };
        setView(fishData);

        setXed(true);
        localStorage.setItem(`${draftKeyGranted}`, draftKeyGranted);
      } else {
        setFeedback({
          message:
            "Invalid or expired scratch card. Please check your internet connection or try again later.",
          type: "error",
        });
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
  if (view) {
    return (
      <div>
        <div className="bg-white border border-gray-200 dark:border-neutral-700 shadow-lg rounded-2xl font-nunito dark:bg-neutral-800 p-6 flex flex-col items-center">
          <PostDetails
            classRoom={classRoom!}
            term={term!}
            studentId={view.studentId}
            session={session}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center font-nunito ">
      <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-[25px] shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-4">
          Scratch Card Verification
        </h2>
        <h2 className="text-[14px] text-gray-800 dark:text-gray-100 text-center mb-4">
          {`Check ${name}'s Result`}
        </h2>

        {feedback && (
          <div
            className={`my-4 p-3 text-sm rounded-full bg-opacity-70 text-center 
              ${
                feedback.type === "success" ? "bg-green-100 text-green-800" : ""
              }
              ${feedback.type === "error" ? "bg-red-100 text-red-800" : ""}
              ${feedback.type === "info" ? "bg-blue-100 text-blue-800" : ""}`}
          >
            {feedback.message}
          </div>
        )}

        {!isAllowed && (
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
        )}

        <button
          onClick={handleShit}
          className={`w-full p-3 px-6 py-5 mt-4 text-white font-semibold rounded-full transition 
            ${
              isLoading || code.length < 8
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          disabled={isLoading || (!isAllowed && code.length < 8)}
        >
          {isLoading ? "Processing..." : xed ? "Redirecting..." : "Verify Code"}
        </button>
      </div>
    </div>
  );
};

export default ScratchCardOTP;
