"use client";
import { Input } from "@/components/ui/input";
import Select from "@/components/utilities/CustomSelect";
import Popup from "@/components/utilities/PopUp";
import { useUserContext } from "@/context/AuthContext";
import { addComment } from "@/lib/actions/comment.actions";
import { listAllStudents } from "@/lib/actions/studentsData.actions";
// Import the addComment function
import { Models } from "appwrite";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Student {
  $id: string;
  name: string;
  dateOfBirth: string;
  studentId: string;
  image?: string;
  classRoom: string;
  createdAt: string;
}

const Teachers = () => {
  const { user } = useUserContext();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [comments, setComments] = useState<Record<string, string>>({});
  const [commentStatus, setCommentStatus] = useState<string | null>(null);
  const [term, setTerm] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);

  const [session, setSession] = useState<string>("");
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const xed: Models.Document[] = await listAllStudents();

        if (xed) {
          const transformedStudents = xed.map((student) => ({
            $id: student.$id,
            name: student.name,
            dateOfBirth: student.dateOfBirth,
            studentId: student.studentId,
            image: student.image,
            classRoom: student.classRoom,
            createdAt: student.$createdAt,
          }));
          setStudents(transformedStudents);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (term && session) {
      fetchStudents();
    }
  }, [term, session]);
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const closeSuccessPopup = () => {
    setIsSuccess(false);
  };
  // Close the failure popup
  const closeFailurePopup = () => {
    setIsFailure(false);
  };
  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
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
  const handleClassCommentSubmit = async (classRoom: string) => {
    if (Object.values(comments).every((comment) => !comment.trim())) return;

    setIsProcessing(true);
    setCommentStatus(null);

    try {
      // Format the comments for each student in the class
      const studentsInClass = groupedByClass[classRoom];
      const formattedComments = studentsInClass
        .filter((student) => comments[student.$id]?.trim())
        .map((student) => ({
          studentName: student.name,
          studentId: student.studentId,
          comment: comments[student.$id],
        }));

      // Prepare data for the upload
      const uploadData = {
        term,
        session,
        classRoom,
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

  const groupedByClass = students
    .filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .reduce((acc: Record<string, Student[]>, student) => {
      acc[student.classRoom] = acc[student.classRoom] || [];
      acc[student.classRoom].push(student);
      return acc;
    }, {});

  Object.keys(groupedByClass).forEach((classRoom) => {
    groupedByClass[classRoom].sort((a, b) => a.name.localeCompare(b.name));
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-start bg-gray-50 dark:bg-neutral-900 p-8 rounded-[25px] border border-neutral-200 dark:border-neutral-800">
       <h1 className="text-12 lg:text-18 font-nunito font-semibold">
        Teacher's comment</h1>
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
          htmlFor="term"
          className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
        >
          Select Session
        </label>
        <Select
          options={[
            {
              value: ` ${currentYear}/${nextYear}`,
              label: `${currentYear}/${nextYear}`,
            },
            {
              value: ` 2024/2025`,
              label: `2024/2025`,
            },
          ]}
          value={session}
          onChange={(value) => setSession(value)}
          placeholder="Choose a Session"
          className="w-full border-2 border-gray-300 dark:border-neutral-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
        />
      </div> 
       </div>
    
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-lg shadow focus:outline-none w-full"
        />
      </div>

      {commentStatus && (
        <p className="mb-4 text-center text-green-600 font-bold">
          {commentStatus}
        </p>
      )}

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        Object.keys(groupedByClass)
          .sort()
          .map((classRoom) => (
            <div key={classRoom} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                {classRoom.toUpperCase()}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedByClass[classRoom].map((student) => (
                  <div
                    key={student.$id}
                    className="bg-white border border-gray-200 dark:border-neutral-700 shadow-lg rounded-2xl font-nunito dark:bg-neutral-800 p-6 flex flex-col items-center"
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
                      {student.classRoom}{" "}
                      <span className="mx-2 text-gray-500 dark:text-gray-600">
                        &#8226;
                      </span>{" "}
                      {calculateAge(student.dateOfBirth)} years old
                    </p>
                    <textarea
                      placeholder="Enter your comment..."
                      className="w-full border px-4 py-2 rounded-lg shadow focus:outline-none resize-none mt-4"
                      value={comments[student.$id] || ""}
                      onChange={(e) =>
                        handleCommentChange(student.$id, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center mt-6 mb-6">
                <button
                  onClick={() => handleClassCommentSubmit(classRoom)}
                  className={`py-3 px-6 text-white rounded-full cursor-pointer ${
                    isProcessing
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-purple-500 hover:bg-purple-600"
                  }`}
                  disabled={
                    isProcessing ||
                    !groupedByClass[classRoom].some((student) =>
                      comments[student.$id]?.trim()
                    )
                  }
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
              </div>
            </div>
          ))
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
    </div>
  );
};

export default Teachers;
