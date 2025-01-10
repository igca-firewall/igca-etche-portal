"use client";
import { Input } from "@/components/ui/input";
import Select from "@/components/utilities/CustomSelect";
import Popup from "@/components/utilities/PopUp";
import { useUserContext } from "@/context/AuthContext";
import { addComment } from "@/lib/actions/comment.actions";
import { getS } from "@/lib/actions/studentsData.actions";
import { Models } from "appwrite";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ScratchCardOTP from "./GetCard";
import { useRouter } from "next/navigation";
import { classOrder, encrypt, storeClassAndRest } from "@/lib/utils";
import { FaSearch } from "react-icons/fa";
import { getMe } from "@/lib/actions/user.actions";

interface Student {
  $id: string;
  name: string;
  dateOfBirth: string;
  studentId: string;
  image?: string;
  createdAt: string;
}

const AllResults = () => {
  const { user } = useUserContext();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [classRoom, setClassRoom] = useState<string>("");
  const [term, setTerm] = useState<string>("");
  const [session, setSession] = useState<string>(""); // State for Term
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [xed, setXed] = useState(false);
  const [isFish, setIsFish] = useState<{
    studentName: string;
    Namer: string;
    term: string;
    classRoom: string;
    studentId: string;
  } | null>(null);
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
      setIsFailure(false);
      setXed(false);
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
          setIsFailure(true);
        }
      }
    } catch (error) {
      setIsFailure(true);
      console.error("Error fetching students:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsFailure(false);
        setXed(false);
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
            setIsFailure(true);
          }
        }
      } catch (error) {
        setIsFailure(true);
        console.log("Error fetching Student:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (term && session && classRoom) {
      fetchStudents();
    }
  }, [term, session, classRoom]);
  // Checking the admin rights from localStorage based on the student's name
 const router = useRouter();
  // Handle the "Check Result" button click
  const handleCheckResult = (
    studentName: string,
    Namer: string,
    term: string,
    studentId: string
  ) => {
    const uniqueKey = studentName;
    setXed(true);
    // Retrieve admin rights from localStorage
    const storedAdminRights = localStorage.getItem(uniqueKey);

    if (storedAdminRights || user.role === "admin" || admin) {
     console.log("Admin rights retrieved");
      router.push(`/result-details/${studentId}`);
    } else if (user.role !== "admin" && !admin && !storedAdminRights && term) {
      console.log("Not an admin or has no admin rights assigned");
      const fishData = {
        studentName,
        Namer,
        term,
        classRoom: classRoom,
        studentId,
      };
      setIsFish(fishData);
      setXed(false);
    }
  };
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  useEffect(() => {
    if (classRoom && session && term) {
      const addIt = storeClassAndRest(classRoom, term, session);
    }
  }, [classRoom, session, term]);
  if (!user) {
    return <div>The page is loading...</div>;
  }
  if (isFish) {
    return (
      <div>
        <div className="bg-white border border-gray-200 dark:border-neutral-700 shadow-lg rounded-2xl font-nunito dark:bg-neutral-800 p-6 flex flex-col items-center">
          <ScratchCardOTP
            name={isFish.Namer}
            classRoom={isFish.classRoom}
            term={isFish.term}
            studentId={isFish.studentId}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start bg-gray-50 dark:bg-neutral-900 p-8 rounded-[25px] border border-neutral-200 dark:border-neutral-800">
      <h1 className="text-18 font-nunito font-semibold">Check Results</h1>
      <div className="flex flex-wrap justify-between items-center gap-5 w-full mb-8">
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
            htmlFor="session"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
          >
            Select Session
          </label>
          <Select
            options={[
              {
                value: `${currentYear}/${nextYear}`,
                label: `${currentYear}/${nextYear}`,
              },
              {
                value: `2024/2025`,
                label: `2024/2025`,
              },
            ]}
            value={session}
            onChange={(value) => setSession(value)}
            placeholder="Choose a Session"
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
        <div className="mb-5 w-full sm:w-1/3 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />
        </div>
      </div>

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
                className="bg-white border hover:scale-110 transition-all transform duration-800 hover:bg-neutral-300 hover:dark:bg-neutral-700 border-gray-200 dark:border-neutral-700 shadow-lg rounded-2xl font-nunito dark:bg-neutral-800 p-6 flex flex-col items-center"
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
                <Button
                  className={`px-8 ${
                    xed && " bg-gray-300 animate-bounce"
                  } py-8 mt-4 text-purple-800 dark:text-white border border-neutral-300 dark:border-purple-800 rounded-full bg-neutral-200 dark:bg-neutral-800 focus:outline-none`}
                  disabled={isProcessing || xed}
                  onClick={() =>
                    handleCheckResult(
                      `Particles granted you permission to: ${student.name}'s result for ${term}_${classRoom}`,
                      student.name,
                      term,
                      student.studentId
                    )
                  }
                >
                  {xed
                    ? "Analyzing"
                    : `Check ${
                        student.name === user.name
                          ? "Your"
                          : student.name + "'s"
                      } Result`}
                </Button>
              </div>
            ))}
        </div>
      )}
      {isFailure && (
        <div
          className="
          flex flex-col items-center gap-2 text-red-200"
        >
          No student found, Please check your internet connection or provided
          credentials.{" "}
          <button
            className="px-6 py-2 bg-purple-500 rounded-full "
            onClick={() => fetchStudents()}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default AllResults;
