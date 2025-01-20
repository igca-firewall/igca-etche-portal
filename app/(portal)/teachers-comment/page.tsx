"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from "@/components/utilities/CustomSelect";
import Popup from "@/components/utilities/PopUp";
import Unauthorized from "@/components/utilities/Unauthorized";
import { useUserContext } from "@/context/AuthContext";
import { addComment } from "@/lib/actions/comment.actions";
import {
  getS,
  getStudentsByClassRoom,
  listAllStudents,
} from "@/lib/actions/studentsData.actions";
import { getMe } from "@/lib/actions/user.actions";
import { classOrder, getYearRanges } from "@/lib/utils";
// Import the addComment function
import { Models } from "appwrite";
import Image from "next/image";
import React, { useEffect, useState } from "react";

// interface Student {
//   $id: string;
//   name: string;
//   dateOfBirth: string;
//   studentId: string;
//   image?: string;
//   classRoom: string;
//   createdAt: string;
// }

const Teachers = () => {
  const { user } = useUserContext();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [comments, setComments] = useState<Record<string, string>>({});
  const [commentStatus, setCommentStatus] = useState<string | null>(null);
  const [term, setTerm] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [classRoom, setClassRoom] = useState<string>("");
  const [session, setSession] = useState<string>("");
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const fetchMe = async () => {
      const me = await getMe();
      if (me === "PARTICLES_ADMINISTRATOR_IGCA") setAdmin(true);
    };
    fetchMe();
  }, []);
  const fetchStudents = async () => {
    try {
      setIsFailed(false);

      setIsLoading(true);
      const xed: Models.Document[] = await getS({
        classRoom,

        session: session,
      });

      if (xed) {
        const transformedStudents = xed.map((student) => ({
          $id: student.$id,
          name: student.name,
          dateOfBirth: student.dateOfBirth,
          studentId: student.studentId,
          image: student.image,

          createdAt: student.$createdAt,
        }));
        setStudents(transformedStudents);
        console.log("Students", transformedStudents);
        if (transformedStudents.length === 0) {
          setIsFailed(true);
        }
      }
    } catch (error) {
      setIsFailed(true);
      console.error("Error fetching students:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsFailed(false);

        setIsLoading(true);
        const xed: Models.Document[] = await getS({
          classRoom,

          session: session,
        });

        if (xed) {
          const transformedStudents = xed.map((student) => ({
            $id: student.$id,
            name: student.name,
            dateOfBirth: student.dateOfBirth,
            studentId: student.studentId,
            image: student.image,

            createdAt: student.$createdAt,
          }));
          setStudents(transformedStudents);
          console.log("Students", transformedStudents);
          if (transformedStudents.length === 0) {
            setIsFailed(true);
          }
        }
      } catch (error) {
        setIsFailed(true);
        console.log("Error fetching Student:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (term && session && classRoom) {
      fetchStudents();
    }
  }, [term, session, classRoom]);
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const closeSuccessPopup = () => {
    setIsSuccess(false);
  };
  // Close the failure popup
  const closeFailurePopup = () => {
    setIsFailure(false);
  };

  const handleCommentChange = (studentId: string, comment: string) => {
    setComments((prevComments) => ({
      ...prevComments,
      [studentId]: comment,
    }));
  };
  const autoClosePopup = (
    setState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setTimeout(() => setState(false), 3000);
  };
  const handleClassCommentSubmit = async () => {
    if (Object.values(comments).every((comment) => !comment.trim())) return;

    setIsProcessing(true);
    setCommentStatus(null);

    try {
      // Format the comments for each student in the class
      const studentsInClass = students;
      const formattedComments = studentsInClass
        .filter((student) => comments[student.$id]?.trim())
        .map((student) => ({
          studentName: student.name,
          studentId: student.studentId,
          comment: comments[student.$id],
        }));

      // Prepare data for the upload
      const uploadData = {
        term: term,
        session: session,
        classRoom: classRoom,
        comment: formattedComments,
      };

      // Call the addComment function with the transformed data
      const uploadResponse = await addComment(uploadData);

      if (uploadResponse) {
        setCommentStatus(`Comments for ${classRoom} submitted successfully!`);
        setIsSuccess(true);
        autoClosePopup(() => setIsSuccess(false));
        // Clear state if the upload is successful
        setComments((prevComments) =>
          studentsInClass.reduce(
            (acc, student) => {
              delete acc[student.$id];
              return acc;
            },
            { ...prevComments }
          )
        );
      } else {
        setIsFailure(true);
        autoClosePopup(() => setIsFailure(false));
        throw new Error("Failed to upload comments.");
      }
    } catch (error) {
      console.error(`Error submitting comments for ${classRoom}:`, error);
      setCommentStatus(`Failed to submit comments for ${classRoom}.`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (user.role !== "admin") {
    return <Unauthorized />;
  } else if (admin || user.role === "admin")
    return (
      <div className="w-full h-full flex flex-col items-center justify-start bg-gray-50 dark:bg-neutral-900 p-8 rounded-[25px] border border-neutral-200 dark:border-neutral-800">
        <h1 className="text-12 lg:text-18 font-nunito font-semibold">
          Teacher's comment
        </h1>
        <div className="flex flex-wrap justify-between gap-5 w-full mb-8">
          <div className="mb-5 w-full sm:w-1/3">
            <label
              htmlFor="term"
              className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
            >
              Select Term
            </label>
            <Select
              options={[
                { value: "1st Term", label: "1st Term" },
                { value: "2nd Term", label: "2nd Term" },
                { value: "3rd Term", label: "3rd Term" },
              ]}
              value={term}
              onChange={(value) => setTerm(value)}
              placeholder="Choose a Term"
              className="w-full border-2 border-gray-300 dark:border-neutral-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="mb-5 w-full sm:w-1/3">
            <label
              htmlFor="classRoom"
              className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
            >
              Select Class
            </label>
            <Select
              options={classOrder.map((className) => ({
                value: className,
                label: className,
              }))}
              value={classRoom}
              onChange={(value) => setClassRoom(value)}
              placeholder="Choose a Class"
              className="w-full border-2 border-gray-300 dark:border-neutral-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="mb-5 w-full sm:w-1/3">
            <label
              htmlFor="term"
              className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
            >
              Select Session
            </label>
            <Select
               options={[
                            ...getYearRanges(2024).map((range) => ({
                              value: `${range}`,
                              label: `${range}`,
                            }))
                          ]}
              value={session}
              onChange={(value) => setSession(value)}
              placeholder="Choose a Session"
              className="w-full border-2 border-gray-300 dark:border-neutral-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="mb-5 w-full sm:w-1/3">
            <Input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-4 py-2 rounded-lg shadow focus:outline-none w-full"
            />
          </div>
        </div>

        {commentStatus && (
          <p className="mb-4 text-center text-green-600 font-bold">
            {commentStatus}
          </p>
        )}

        {isLoading ? (
          <p className="text-center">
            {!term && session
              ? "Please select a term 👆"
              : !session && term
              ? "Please select a session 👆"
              : !classRoom && term
              ? "Please select a class 👆"
              : !term && !session
              ? "Please Utilize the selections above."
              : "Loading..."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
    
            {students
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter((student) =>
                student.name.toLowerCase().includes(searchQuery.toLowerCase())
              ) // Alphabetically sort by name
              .map((student) => (
                <div
                  key={student.$id}
                  className="bg-white border  transition-all transform duration-800 hover:bg-neutral-100 hover:dark:bg-neutral-700 border-gray-200 dark:border-neutral-700 shadow-lg rounded-2xl font-nunito dark:bg-neutral-800 p-6 flex flex-col items-center"
                >
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-md">
                    <Image
                      src={student.image || "/images/th.jpg"}
                      alt={student.name}
                      className="object-cover"
                      width={112}
                      height={112}
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-5">
                    {student.name}
                  </h2>
                  <p className="text-base text-gray-600 dark:text-gray-400 mt-2">
                    {classRoom}
                    <span className="mx-2 text-gray-500 dark:text-gray-600">
                      &#8226;
                    </span>
                    {student.studentId}
                  </p>
                  <textarea
                    placeholder="Enter your comment..."
                    className="w-full border border-white dark:border-neutral-700 px-4 py-2 rounded-lg shadow focus:outline-none resize-none mt-4"
                    value={comments[student.$id] || ""}
                    onChange={(e) =>
                      handleCommentChange(student.$id, e.target.value)
                    }
                  />
                </div>
              ))}
            {students.length > 0 && (
              <button
                onClick={() => handleClassCommentSubmit()}
                className={`py-5 px-5 text-white justify-center items-center rounded-full cursor-pointer ${
                  isProcessing
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-purple-500 hover:bg-purple-600"
                }`}
                disabled={isProcessing || students.length <1}
              >
                {isProcessing ? (
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                    </svg>
                    Loading...
                  </div>
                ) : isSuccess ? (
                  <span>Comments Submitted</span>
                ) : isFailure ? (
                  <span className="text-red-500">Submission Failed</span>
                ) : (
                  <span>Submit Comments for {classRoom}</span>
                )}
              </button>
              
            )}
          </div>
        )}
        {isSuccess && (
          <Popup
            type="success"
            message="Comment has been successfully added."
            onClose={closeSuccessPopup}
          />
        )}

        {/* Failure Popup */}
        {isFailure && (
          <Popup
            type="failure"
            message="Something went wrong, please try again later."
            onClose={closeFailurePopup}
          />
        )}
        {isFailed && (
          <div
            className="
          flex flex-col items-center gap-2 text-neutral-500 dark:text-red-200"
          >
            No student found, Please check your internet connection or provided
            credentials.{" "}
            <button
              className="px-6 py-2 bg-purple-500 text-white rounded-full "
              onClick={() => fetchStudents()}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    );
};

export default Teachers;
