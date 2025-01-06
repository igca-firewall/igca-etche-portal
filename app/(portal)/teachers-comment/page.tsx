"use client";
import { Input } from "@/components/ui/input";
import Select from "@/components/utilities/CustomSelect";
import { useUserContext } from "@/context/AuthContext";
import { addComment } from "@/lib/actions/comment-action";
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

    fetchStudents();
  }, []);
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
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

  const handleClassCommentSubmit = async (classRoom: string) => {
    const studentsInClass = groupedByClass[classRoom];
    const formattedComments = studentsInClass
      .filter((student) => comments[student.$id]?.trim())
      .map((student) => ({
        studentName: student.name,
        studentId: student.$id,
        comment: comments[student.$id],
      }));

    if (formattedComments.length === 0) return;

    try {
      await addComment({
        term: term, // Replace with actual term
        session: session, // Replace with actual session
        classRoom: classRoom,
        comment: formattedComments,
      });
      setCommentStatus(`Comments for ${classRoom} submitted successfully!`);
      setComments((prevComments) =>
        studentsInClass.reduce(
          (acc, student) => {
            delete acc[student.$id];
            return acc;
          },
          { ...prevComments }
        )
      );
    } catch (error) {
      console.error(`Error submitting comments for ${classRoom}:`, error);
      setCommentStatus(`Failed to submit comments for ${classRoom}.`);
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
              }, {
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
                  className="py-3 px-6 bg-purple-500 text-white rounded-full cursor-pointer"
                  disabled={
                    !groupedByClass[classRoom].some((student) =>
                      comments[student.$id]?.trim()
                    )
                  }
                >
                  Submit Comments for {classRoom}
                </button>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default Teachers;
