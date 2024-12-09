"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Models } from "node-appwrite";
import { getStudentsByClass } from "@/lib/actions/studentsData.actions";
import Select from "./CustomSelect";
import { classOrder } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { uploadResults } from "@/lib/actions/rexults.actions";

// Interfaces for student and result data
interface Student {
  $id: string;
  name: string;
  studentId: string;
}

interface Result {
  studentId: string;
  studentName: string;
  grades: string[];
  sum: number;
  grade: string;
}

// Grading function
const calculateGrade = (sum: number): string => {
  if (sum >= 80) return "A1";
  if (sum >= 70) return "B2";
  if (sum >= 60) return "B3";
  if (sum >= 50) return "C4";
  if (sum >= 45) return "C5";
  if (sum >= 40) return "C6";
  if (sum >= 35) return "D7";
  if (sum >= 30) return "E8";
  return "F9";
};

const SubjectResultUploader: React.FC = () => {
  const [subject, setSubject] = useState<string>("");
  const [classRoom, setClassRoom] = useState<string>("");
  const [term, setTerm] = useState<string>(""); // State for Term
  const [results, setResults] = useState<Result[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // Processing state for submit button
  const [errors, setErrors] = useState<string[]>([]); // Error state

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!classRoom) newErrors.push("Class is required.");
    if (!subject) newErrors.push("Subject is required.");
    if (!term) newErrors.push("Term is required.");

    // Check if all students have grades
    const allGradesEntered = results.every((result) =>
      result.grades.every((grade) => grade.trim() !== "")
    );
    if (!allGradesEntered) {
      newErrors.push("Please enter grades for all students.");
    }

    if (results.length === 0)
      newErrors.push("At least one result must be added.");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    setIsProcessing(true);
    const uploadErrors: string[] = [];
  
    try {
      for (const result of results) {
        // Destructure grades to map them to respective fields
        const [firstTest, secondTest, project, bnb, assignment, exam] =
          result.grades;
  
        // Prepare the result data for the upload
        const uploadData = {
          id: result.studentId,
          firstTest: firstTest || "0",
          secondTest: secondTest || "0",
          project: project || "0",
          bnb: bnb || "0",
          assignment: assignment || "0",
          exam: exam || "0",
          result: `${result.sum}`,
          classRoom,
          term,
          grade: result.grade,
          subject,
          createdBy: user.$id,
          total: `${result.sum}`,
        };
  
        try {
          // Call the uploadResults function
          const uploadResponse = await uploadResults(uploadData);
  
          if (!uploadResponse) {
            throw new Error(`Failed to upload result for ${result.studentName}`);
          }
        } catch (error) {
          console.error(`Error uploading result for ${result.studentName}:`, error);
          uploadErrors.push(result.studentName);
        }
      }
  
      if (uploadErrors.length > 0) {
        setErrors([
          ...errors,
          `Failed to upload results for: ${uploadErrors.join(", ")}`,
        ]);
      } else {
        console.log("All results uploaded successfully.");
        setClassRoom("");
        setSubject("");
        setTerm("");
        setResults([]);
      }
    } catch (error) {
      console.error("Unexpected error during submission:", error);
      setErrors((prev) => [
        ...prev,
        "An unexpected error occurred. Please try again.",
      ]);
    } finally {
      setIsProcessing(false);
    }
  };
  

  // Handle adding results for a student
  const handleAddResult = (studentId: string, grades: string[]) => {
    if (grades.some((grade) => grade.trim() === "")) {
      setErrors((prevErrors) => [
        ...prevErrors,
        "Please enter all test scores for the student.",
      ]);
      return;
    }
  
    const student = students.find((student) => student.studentId === studentId);
    if (student) {
      const sum = grades.reduce(
        (acc, grade) => acc + (parseFloat(grade) || 0),
        0
      );
      const grade = calculateGrade(sum);
  
      const updatedResults = [...results];
      const existingResultIndex = updatedResults.findIndex(
        (result) => result.studentId === studentId
      );
  
      if (existingResultIndex !== -1) {
        updatedResults[existingResultIndex] = {
          ...updatedResults[existingResultIndex],
          grades,
          sum,
          grade,
        };
      } else {
        updatedResults.push({
          studentId,
          studentName: student.name,
          grades,
          sum,
          grade,
        });
      }
  
      setResults(updatedResults);
    }
  };
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const xed: Models.Document[] = await getStudentsByClass({ classRoom });
        if (xed) {
          const transformedStudents = xed.map((student) => ({
            $id: student.$id,
            name: student.name,
            studentId: student.studentId,
          }));
          setStudents(transformedStudents);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (classRoom) {
      fetchStudents();
    }
  }, [classRoom]);
  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-full bg-red-100 p-6 rounded-lg shadow-lg">
        <div className="text-center text-red-600 font-semibold text-xl md:text-2xl">
          <h2>You do not have access to this page.</h2>
          <p className="mt-2 text-gray-600">
            Please contact the administrator for assistance.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-start bg-gray-50 dark:bg-neutral-900 p-8">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-200 transition duration-200">
        Upload Results
      </h2>

      {/* Display Errors */}
      {errors.length > 0 && (
        <div className="mb-4 w-full bg-red-100 text-red-800 p-4 rounded-md">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Select Class, Subject, and Term */}
      <div className="flex flex-wrap justify-between gap-5 w-full mb-8">
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
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
          >
            Select Subject
          </label>
          <Select
            options={[
              { value: "Math", label: "Math" },
              { value: "Science", label: "Science" },
              { value: "English", label: "English" },
              { value: "History", label: "History" },
              { value: "Geography", label: "Geography" },
            ]}
            value={subject}
            onChange={(value) => setSubject(value)}
            placeholder="Choose a Subject"
            className="w-full border-2 border-gray-300 dark:border-neutral-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

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
      </div>

      {/* Student Result Table */}
      {/* Student Result Table */}
<div className="w-full overflow-x-auto flex-grow p-4">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
    Add Student Results
  </label>

  {isLoading  ?  (
    <div className="flex justify-center items-center p-10">
      <div className="loader border-4 border-t-4 border-gray-200 dark:border-neutral-800 rounded-full w-16 h-16 animate-spin"></div>
    </div>
  ) : (
    <table className="min-w-full table-auto border-collapse bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
      <thead className="bg-gray-100 dark:bg-neutral-700">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
            Student Name
          </th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
            Student ID
          </th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
            {`1st Summarize Test (10%)`}
          </th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
            {`2nd Summarize Test (10%)`}
          </th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
            {` Midterm Project (20%)`}
          </th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
            {`Book and Beyond (10%)`}
          </th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
            {`Assignment (10%)`}
          </th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
            {`Exam (40%)`}
          </th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sum
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Grade
                </th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => {
          const studentResult = results.find(
            (result) => result.studentId === student.studentId
          );
          return (
            <tr key={student.studentId} className="border-b border-gray-200 dark:border-neutral-700">
              <td className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {student.name}
              </td>
              <td className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {student.studentId}
              </td>

              {/* Grade Inputs */}
              {["firstTest", "secondTest", "project", "bnb", "assignment", "exam"].map((field, idx) => (
                <td key={idx} className="px-6 py-3">
                  <Input
                    type="number"
                    placeholder={field.split(/(?=[A-Z])/).join(" ")}
                    value={studentResult?.grades[idx] || ""}
                    onChange={(e) => {
                      const newGrades = [...(studentResult?.grades || [])];
                      newGrades[idx] = e.target.value;
                      handleAddResult(student.studentId, newGrades);
                    }}
                    className="w-full text-sm text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-neutral-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </td>
              ))}
               <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
                      {studentResult ? studentResult.sum : "-"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
                      {studentResult ? studentResult.grade : "-"}
                    </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )}
</div>


      {/* Submit Button */}
      <div className="w-full text-center mt-6">
        <button
          onClick={handleSubmit}
          className="bg-purple-500 text-white py-6 px-10 rounded-full hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 disabled:bg-gray-300"
          disabled={
            isProcessing ||
            !classRoom ||
            !subject ||
            !term ||
            results.length === 0
          }
        >
          {isProcessing ? "Submitting..." : "Submit Results"}
        </button>
      </div>
    </div>
  );
};

export default SubjectResultUploader;
