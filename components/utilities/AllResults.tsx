"use client";
import { Input } from "@/components/ui/input";
import Select from "@/components/utilities/CustomSelect";
import Popup from "@/components/utilities/PopUp";
import { useUserContext } from "@/context/AuthContext";
import { addComment } from "@/lib/actions/comment.actions";
import { listAllStudents } from "@/lib/actions/studentsData.actions";
import { Models } from "appwrite";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ScratchCardOTP from "./GetCard";
import { useRouter } from "next/navigation";
import { encrypt } from "@/lib/utils";

interface Student {
  $id: string;
  name: string;
  dateOfBirth: string;
  studentId: string;
  image?: string;
  classRoom: string;
  createdAt: string;
}

const AllResults = () => {
  const { user } = useUserContext();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [term, setTerm] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  
  const [isFish, setIsFish] = useState<{
    studentName: string;
    Namer: string;
    term: string;
    classRoom: string;
    studentId: string
  } | null>(null);

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
    if (term) {
      fetchStudents();
    }
  }, [term]);
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

  // Checking the admin rights from localStorage based on the student's name
  const [adminRights, setAdminRights] = useState<string | null>(null);
const router = useRouter()
  // Handle the "Check Result" button click
  const handleCheckResult = (
    studentName: string,
    Namer: string,
    term: string,
    classRoom: string,
    studentId: string
  ) => {
    const uniqueKey = studentName;

    // Retrieve admin rights from localStorage
    const storedAdminRights = localStorage.getItem(uniqueKey);

    if (storedAdminRights || user.role === 'admin') {
      setAdminRights(storedAdminRights);
      console.log("Admin rights retrieved");
      router.push(`/result-details/${studentId}`)
      
    } else if (user.role !== "admin" && !storedAdminRights && term) {
      console.log("Not an admin or has no admin rights assigned");
      const fishData = {
        studentName,
        Namer,
        term,
        classRoom,
        studentId
      };
      setIsFish(fishData);
    } else {
      console.log("Admin access detected");
      return <div>You have access to this result</div>;
    }
  };

  useEffect(() => {
    // React to isFish changes or perform other effects
    if (isFish) {
      console.log("isFish has been set to true");
      // Additional logic when isFish is true
    }
  }, [isFish]); // Run whenever isFish changes

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
    <div className="p-6 items-center">
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
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-lg shadow focus:outline-none w-full"
        />
      </div>

      {isLoading ? (
        <p className="text-center">
          {!term ? "Select a term 👆" : "Loading..."}
        </p>
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
                    <Button
                      className="px-8 py-8 mt-4 text-purple-800 border border-neutral-300 dark:border-neutral-700 rounded-full  bg-neutral-200 dark:bg-neutral-800 focus:outline-none"
                      disabled={isProcessing}
                      onClick={() =>
                        handleCheckResult(
                          `Particles granted you permission : ${student.name}_${term}_${classRoom}`,
                          student.name,
                          term,
                          classRoom,
                          student.studentId
                        )
                      }
                    >
                      {`Check ${
                        student.name === user.name
                          ? "Your"
                          : student.name + "'s"
                      } Result`}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
      )}
      {adminRights ? (
        <div>You have been granted permission to view this result</div>
      ) : (
        <div>Failed the process the result/</div>
      )}
    </div>
  );
};

export default AllResults;
