"use client";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import {
  deleteStudent,
  editStudent,
  listAllStudents,
  // updateStudent,
} from "@/lib/actions/studentsData.actions";
import { Models } from "node-appwrite";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ConfirmationModal from "@/components/utilities/CustomModal"; // Import the modal
import { classOrder } from "@/lib/utils";
import Image from "next/image";

interface Student {
  $id: string;
  name: string;
  dateOfBirth: string;
  studentId: string;
  classRoom: string;
  image: string;
}

const StudentList: React.FC = () => {
  const { user } = useUserContext();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<"name" | "class">("name");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false); // State for success popup
  const [isFailure, setIsFailure] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  // Edit form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStudentData, setEditStudentData] = useState<Student | null>(null);
  const autoClosePopup = (
    setState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setTimeout(() => setState(false), 3000);
  };
  const closeSuccessPopup = () => {
    setIsSuccess(false);
  };
  const closeFailurePopup = () => {
    setIsFailure(false);
  };
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const limit = 10; // Fetch 10 students per page

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
        setTotalPages(Math.ceil(xed.length / limit));
        setStudents(transformedStudents);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const limit = 10; // Fetch 10 students per page

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
          setTotalPages(Math.ceil(xed.length / limit));
          setStudents(transformedStudents);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [currentPage]);

  const sortedStudents = [...students].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    } else {
      return classOrder.indexOf(a.classRoom) - classOrder.indexOf(b.classRoom);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50 dark:bg-neutral-900">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-dotted rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!students.length) {
    return (
      <div
        className="
          flex flex-col items-center gap-2 text-neutral-500 dark:text-red-200"
      >
        No student found, Please check your internet connection and try again later.{" "}
        <button
          className="px-6 py-2 bg-purple-500 text-white rounded-full "
          onClick={() => fetchStudents()}
        >
          Retry
        </button>
      </div>
    );
  }

  const handleDelete = (studentId: string) => {
    setStudentToDelete(studentId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        await deleteStudent({ id: studentToDelete });

        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.$id !== studentToDelete)
        );
        console.log("Student deleted:", studentToDelete);
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
    setIsModalOpen(false);
  };

  const cancelDelete = () => {
    setStudentToDelete(null);
    setIsModalOpen(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editStudentData) {
      const { $id, ...updates } = editStudentData; // Extracting id and updates

      try {
        const response = await editStudent({ id: $id, updates }); // API call

        if (response) {
          // Show success popup
          setIsSuccess(true);
          autoClosePopup(setIsSuccess); // Automatically close success popup after 3 seconds

          // Update the local state with the modified student data
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student.$id === $id ? { ...student, ...updates } : student
            )
          );

          setIsEditModalOpen(false); // Close the edit modal
        }
      } catch (error) {
        console.error("Error updating student:", error);

        // Show failure popup
        setIsFailure(true);
        autoClosePopup(setIsFailure); // Automatically close failure popup after 3 seconds
      }
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-neutral-900 p-6 sm:p-8 flex flex-col">
      <div className="flex flex-col flex-1 bg-white  dark:bg-neutral-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
          Student List
        </h1>

        {/* Search and Sort Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-2/3">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search by name, ID, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Sort By:
            </label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-purple-500"
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value as "name" | "class")
              }
            >
              <option value="name">Name (A-Z)</option>
              <option value="class">Class Order</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 flex-1">
          <table className="w-full table-auto text-sm text-gray-700 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-neutral-800 dark:text-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">#</th>

                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Student ID</th>
                <th className="px-4 py-3 text-left">Class</th>
                <th className="px-4 py-3 text-left">Date of Birth</th>
                {user?.role === "admin" && (
                  <th className="px-4 py-3 text-left">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedStudents
                .filter(
                  (student) =>
                    student.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    student.studentId
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    student.classRoom
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((student, index) => (
                  <tr
                    key={student.$id}
                    className="border-t border-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-900 hover:bg-gray-50 transition-all duration-300"
                  >
                    <td className="px-4 py-2">{index + 1}</td>

                    {/* Name column */}

                    <td className="px-4 py-2">
                      {editStudentData?.$id === student.$id ? (
                        <Input
                          type="text"
                          value={editStudentData.name}
                          onChange={(e) =>
                            setEditStudentData({
                              ...editStudentData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border rounded-md dark:bg-neutral-700 dark:text-white"
                        />
                      ) : (
                        <div className="flex gap-3 items-center justify-start text-center text-neutral-800 dark:text-white">
                          <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 shadow-md">
                            <Image
                              src={
                                student.image !== undefined ||
                                student.image !== null
                                  ? student.image
                                  : "/images/th.png"
                              }
                              alt={student.studentId}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            {student.name}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Student ID column */}
                    <td className="px-4 py-2">
                      {editStudentData?.$id === student.$id ? (
                        <Input
                          type="text"
                          value={editStudentData.studentId}
                          onChange={(e) =>
                            setEditStudentData({
                              ...editStudentData,
                              studentId: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border rounded-md dark:bg-neutral-700 dark:text-white"
                        />
                      ) : (
                        student.studentId
                      )}
                    </td>

                    {/* Class column */}
                    <td className="px-4 py-2">
                      {editStudentData?.$id === student.$id ? (
                        <Input
                          type="text"
                          value={editStudentData.classRoom}
                          onChange={(e) =>
                            setEditStudentData({
                              ...editStudentData,
                              classRoom: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border rounded-md dark:bg-neutral-700 dark:text-white"
                        />
                      ) : (
                        student.classRoom
                      )}
                    </td>

                    {/* Date of Birth column */}
                    <td className="px-4 py-2">
                      {editStudentData?.$id === student.$id ? (
                        <Input
                          type="date"
                          value={editStudentData.dateOfBirth}
                          onChange={(e) =>
                            setEditStudentData({
                              ...editStudentData,
                              dateOfBirth: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border rounded-md dark:bg-neutral-700 dark:text-white"
                        />
                      ) : (
                        student.dateOfBirth
                      )}
                    </td>

                    {/* Actions column */}
                    {user?.role === "admin" && (
                      <td className="px-4 py-2 flex items-center gap-3">
                        {editStudentData?.$id === student.$id ? (
                          <>
                            <button
                              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-all duration-200"
                              onClick={handleEditSubmit}
                            >
                              Save
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-all duration-200"
                              onClick={() => setEditStudentData(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-all duration-200"
                              onClick={() => setEditStudentData(student)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200"
                              onClick={() => handleDelete(student.$id)}
                            >
                              <FaTrashAlt />
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this student?"
      />
      {isSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-green-600">Success!</h2>
            <p className="text-gray-700 dark:text-white">
              Student result have been successfully updated.
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
          <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Oops, something went wrong!
            </h2>
            {/* <p className="text-gray-600 mb-6">{errorMessage}</p> */}
            <button
              onClick={closeFailurePopup}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition duration-200 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
