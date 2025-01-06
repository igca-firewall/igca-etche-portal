"use client";
import { Input } from "@/components/ui/input";
import Select from "@/components/utilities/CustomSelect";
import { useUserContext } from "@/context/AuthContext";
import { listAllStudents } from "@/lib/actions/studentsData.actions";
import { Models } from "appwrite";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

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
  const [session, setSession] = useState<string>("");
  const [adminRights, setAdminRights] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const data: Models.Document[] = await listAllStudents();
        if (data) {
          const transformedStudents = data.map((student) => ({
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

  useEffect(() => {
    const uniqueKey = `${term}_${session} Granted Permission by Particles and to ${user?.name}`;
    const storedAdminRights = localStorage.getItem(uniqueKey);
    setAdminRights(storedAdminRights);
  }, [user, term, session]);

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

  const handleCheckResult = (studentName: string) => {
    if (user?.role === "admin") {
      alert("Permission granted: You are an admin.");
    } else if (adminRights) {
      alert(`Permission granted: You have rights for ${studentName}.`);
    } else {
      alert("OT: You do not have permission.");
    }
  };

  if (!user) {
    return <div>The page is loading...</div>;
  }

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  return (
    <div className="p-6 items-center">
      <div className="mb-5 w-full sm:w-1/3">
        <label htmlFor="term" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
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
        <label htmlFor="session" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
          Select Session
        </label>
        <Select
          options={[
            { value: `${currentYear}/${nextYear}`, label: `${currentYear}/${nextYear}` },
            { value: "2024/2025", label: "2024/2025" },
          ]}
          value={session}
          onChange={(value) => setSession(value)}
          placeholder="Choose a Session"
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
                    <Button
                      onClick={() =>
                        handleCheckResult(
                          `${classRoom}_${term}_${session}_${student.name} Granted Permission by Particles and to ${user.name}`
                        )
                      }
                    >
                      {`Check ${student.name === user.name ? "Your" : student.name + "'s"} Result`}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default AllResults;
