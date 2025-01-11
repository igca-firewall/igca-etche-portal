"use client";
import { inputStudentInfo } from "@/lib/actions/studentsData.actions";
import { generateStudentId } from "@/lib/utils";
import React, { useState, useRef, useEffect } from "react";
import Select from "./CustomSelect";
import { useUserContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/actions/user.actions";

const StudentForm = () => {
  // Initial state for managing student details
  const [students, setStudents] = useState(
    Array(1000).fill({
      fullName: "",
      dateOfBirth: "",
      parentInfo: "",
      classRoom: "JSS1A",
    })
  );

  // Modal state
  // const [ setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // New state for processing status
  const [isSuccess, setIsSuccess] = useState(false); // State for success popup
  const [isFailure, setIsFailure] = useState(false); // State for failure popup
  const [errorMessage, setErrorMessage] = useState(""); // State for storing error message
  const router = useRouter();
  const [completedSubmissions, setCompletedSubmissions] = useState(0);
  const [total, setTotal] = useState(0);
  // Class options
  const classOptions = [
    "JSS1A",
    "JSS1B",
    "JSS1C",
    "JSS2A",
    "JSS2B",
    "JSS2C",
    "JSS3A",
    "JSS3B",
    "JSS3C",
    "SS1A",
    "SS1B",
    "SS1C",
    "SS2A",
    "SS2B",
    "SS2C",
    "SS3A",
    "SS3B",
    "SS3C",
  ];

  // Transform the array into an array of Option objects
  const options = classOptions.map((classOption) => ({
    value: classOption,
    label: classOption,
  }));

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Calculate paginated data
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStudents = students.slice(startIndex, startIndex + itemsPerPage);

  // Refs for the input fields
  const fullNameRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const dobRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const parentInfoRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const classRefs = useRef<(HTMLSelectElement | null)[]>([]);

  // Capitalize the first letter of each word in a string
  const capitalizeWords = (value: string) => {
    return value
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .replace(/^(\s)/, "") // Remove any leading spaces
      .replace(/\s(\S)/g, (match) => match.toLowerCase()) // Make letters lowercase after spaces
      .replace(/\b\w/g, (match) => match.toUpperCase()); // Capitalize first letter of each word
  };

  // Add this helper function outside the component
  const resetStudentState = () =>
    Array(1000).fill({
      fullName: "",
      dateOfBirth: "",
      parentInfo: "",
      classRoom: "JSS1A",
    });
  // Handle input changes
  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedStudents = [...students];
    const globalIndex = startIndex + index; // Adjust for pagination

    // Capitalize full name before updating
    if (field === "fullName") {
      value = capitalizeWords(value); // Capitalize full name
    }

    updatedStudents[globalIndex] = {
      ...updatedStudents[globalIndex],
      [field]: value, // Directly assign the value for fields like classRoom
    };

    setStudents(updatedStudents);
  };
  const { user } = useUserContext();
  // Handle keydown to go to the next field on Enter press
  const handleKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    field: string
  ) => {
    if (e.key === "Enter") {
      // Check if it's the last field in the row
      if (field === "classRoom") {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1); // Move to next page if it's the last field
        }
      } else {
        // Move to the next input field in the row
        const nextField =
          field === "fullName"
            ? fullNameRefs
            : field === "dateOfBirth"
            ? dobRefs
            : field === "parentInfo"
            ? parentInfoRefs
            : classRefs;
        const nextIndex = index + 1;
        nextField?.current[nextIndex]?.focus(); // Focus on the next field
      }
    }
  };
  // const [selectedValue, setSelectedValue] = useState("");
  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };
  // Success and failure popup auto-close handler
  const autoClosePopup = (
    setState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setTimeout(() => setState(false), 3000);
  };
  const isValidStudent = (student: (typeof students)[0]) =>
    student.fullName.trim() &&
    student.dateOfBirth.trim() &&
    student.parentInfo.trim();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValidStudent = (student: (typeof students)[0]) =>
      student.fullName.trim() &&
      student.dateOfBirth.trim() &&
      student.parentInfo.trim();

    const populatedStudents = students.filter(isValidStudent);

    if (!populatedStudents.length) {
      alert("No valid student data found!");
      return;
    }

    setTotal(populatedStudents.length);
    setIsProcessing(true);
    setIsSuccess(false); // Reset before submission
    setIsFailure(false); // Reset before submission
    setCompletedSubmissions(0);

    try {
      const expirationTime = new Date();
      expirationTime.setFullYear(expirationTime.getFullYear() + 6);
      const formattedExpirationTime = expirationTime
        .toISOString()
        .split(".")[0]
        .replace("T", " ");

      // Keep track of updated students after submission
      const updatedStudents = [...students];

      // Submit each student data individually and check each result
      for (const student of populatedStudents) {
        try {
          const submitted = await inputStudentInfo({
            name: student.fullName,
            classRoom: student.classRoom,
            dateOfBirth: student.dateOfBirth,
            guardianInfo: student.parentInfo,
            expirationTime: formattedExpirationTime,
            studentId: `IGCA/ETCHE/${generateStudentId()}${generateStudentId()}`,
          });

          if (submitted) {
            setCompletedSubmissions((prev) => prev + 1);
            setIsSuccess(true); // Show success popup for this submission
            autoClosePopup(setIsSuccess); // Close success popup after 3 seconds

            // Remove successfully submitted student from updatedStudents
            const index = updatedStudents.findIndex(
              (s) => s.fullName === student.fullName
            );
            if (index !== -1) {
              updatedStudents.splice(index, 1);
            }
          } else {
            setIsFailure(true); // Handle individual failure
            autoClosePopup(setIsFailure); // Close failure popup after 3 seconds
          }
        } catch (studentError) {
          console.error("Error submitting student:", studentError);
          setIsFailure(true);
          autoClosePopup(setIsFailure); // Close failure popup after 3 seconds
          break; // Stop processing further students if an error occurs
        }
      }

      // Update the student list with only unsubmitted students
      setStudents(updatedStudents);
    } catch (error) {
      console.error("Error in the process:", error);
      setErrorMessage(
        "An error occurred while submitting student information."
      );
      setIsFailure(true); // Handle any other errors
      autoClosePopup(setIsFailure); // Close failure popup after 3 seconds
    } finally {
      setIsProcessing(false); // Reset processing state
    }
  };

  const handleRoute = () => {
    router.push("/");
  };

  // Handle pagination navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const fetchMe = async () => {
      const me = await getMe();
      if (me === "PARTICLES_ADMINISTRATOR_IGCA") {
        setAdmin(true);
      }
    };
    fetchMe();
  }, []);
  // Open the modal for confirmation
  const populated = students.filter(isValidStudent);

  // Close the success popup
  const closeSuccessPopup = () => {
    setIsSuccess(false);
  };

  // Close the failure popup
  const closeFailurePopup = () => {
    setIsFailure(false);
  };

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="flex flex-col items-center gap-6">
          {/* Animated Spinner */}
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

          {/* Anticipation Message */}
          <h1 className="text-2xl font-semibold animate-pulse">
            We're preparing something amazing for you...
          </h1>

          {/* Subtle Progress Indicator */}
          <p className="text-sm opacity-80">
            Hang tight! This won't take long.
          </p>
        </div>
      </div>
    );

  return user.role === "admin" || admin ? (
    //  return (
    <div className="p-6  shadow-lg rounded-lg max-w-[90%] mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        Student Registration Form
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-neutral-700 shadow-sm">
          <table className="table-auto w-full text-sm">
            <thead className="">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">#</th>
                <th className="px-4 py-2 text-left font-semibold">Full Name</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Date of Birth
                </th>
                <th className="px-4 py-2 text-left font-semibold">
                  Parent Phone number
                </th>
                <th className="px-4 py-2 text-left font-semibold">Class</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-neutral-950"
                      : "bg-neutral-50 dark:bg-neutral-900"
                  } hover:bg-purple-100 dark:hover:bg-neutral-800 transition`}
                >
                  <td className="px-4 py-2 text-gray-600 font-medium text-center">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-2">
                    <textarea
                      value={student.fullName}
                      onChange={(e) =>
                        handleInputChange(index, "fullName", e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, index, "fullName")}
                      placeholder="Full Name"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:border-neutral-700"
                      rows={1}
                      //   ref={(el) => (fullNameRefs.current[index] = el)}
                    ></textarea>
                  </td>
                  <td className="px-4 py-2">
                    <textarea
                      value={student.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange(index, "dateOfBirth", e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, index, "dateOfBirth")}
                      placeholder="YYYY-MM-DD"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:border-neutral-700"
                      rows={1}
                      //   ref={(el) => (dobRefs.current[index] = el)}
                    ></textarea>
                  </td>
                  <td className="px-4 py-2">
                    <textarea
                      value={student.parentInfo}
                      onChange={(e) =>
                        handleInputChange(index, "parentInfo", e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, index, "parentInfo")}
                      placeholder="Parent Info"
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:border-neutral-700"
                      rows={1}
                      //   ref={(el) => (parentInfoRefs.current[index] = el)}
                    ></textarea>
                  </td>
                  <td className="px-4 py-2">
                    <Select
                      options={options}
                      value={student.classRoom || ""} // Ensure value is always a string
                      onChange={(selectedValue) => {
                        handleInputChange(index, "classRoom", selectedValue); // Update classRoom directly with the string value
                      }}
                      placeholder="Select a class"
                      className="max-w-md"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Success Popup */}
        {isSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg text-center">
              <h2 className="text-xl font-semibold text-green-600">Success!</h2>
              <p className="text-gray-700 dark:text-neutral-50">
                Student records have been successfully added.
              </p>
              <button
                onClick={closeSuccessPopup}
                className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Failure Popup */}

        {isFailure && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white dark:bg-neutral-700 p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
              <h2 className="text-2xl font-semibold text-red-600 mb-4">
                Oops, something went wrong!
              </h2>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <button
                onClick={closeFailurePopup}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition duration-200 ease-in-out"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={goToPreviousPage}
            className="text-purple-500 bg-gray-300 dark:bg-neutral-700 px-5 py-2 rounded-full"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={goToNextPage}
            className="text-purple-500 bg-gray-300 dark:bg-neutral-700  px-5 py-2 rounded-full"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            type="submit"
            className="bg-purple-500 text-gray-100  px-6 py-4 rounded-full"
            disabled={isProcessing}
          >
            {isProcessing
              ? `Processing: ${completedSubmissions} / ${total}`
              : "Submit"}
          </button>
        </div>
      </form>
    </div>
  ) : (
    <div className="flex items-center justify-center h-[50%]">
      <div className="p-8 bg-white shadow-2xl rounded-xl max-w-lg mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
          Access Denied
        </h1>
        <p className="text-center text-gray-600 text-lg mb-6">
          You are not authorized to access this page. Please contact the
          administrator for assistance.
        </p>
        <div className="flex justify-center">
          <button className="px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition-transform transform hover:scale-105">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
