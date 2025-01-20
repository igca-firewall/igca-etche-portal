import {
  fetchCompiledResults,
  fetchResultWithSubject,
} from "@/lib/actions/rexults.actions";
import { useEffect, useState } from "react";
import Select from "./CustomSelect";
import { classOrder, getYearRanges } from "@/lib/utils";
import { Input } from "../ui/input";
import { useUserContext } from "@/context/AuthContext";
import { getStudentsByClass } from "@/lib/actions/studentsData.actions";
import { Models } from "appwrite";
import Image from "next/image";
import { editResults, fetchResultData } from "@/lib/actions/results.actions";
import { listAllScoresBy } from "@/lib/actions/updateStudents.actions";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const CompiledResults: React.FC = () => {
  const [subject, setSubject] = useState<string>("");
  const [classRoom, setClassRoom] = useState<string>("");
  const [term, setTerm] = useState<string>("");
  const [session, setSession] = useState<string>(""); // State for Term
  const [results, setResults] = useState<Result[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const { user } = useUserContext();
  const [isStudent, setIsStudent] = useState<Scores[]>([]);
  const [scores, setScores] = useState<Scores[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // Processing state for submit button
  const [errors, setErrors] = useState<string[]>([]); // Error state
  const [inputValue, setInputValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [editStudentData, setEditStudentData] = useState<Scores | null>(null);
  const [newScore, setNewScore] = useState<string>("");

  // Edit form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Tracks the active column (field)
  // const inputRefs = useRef([]);
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  // const confirmDelete = async () => {
  //   if (studentToDelete) {
  //     try {
  //       await deleteStudent({ id: studentToDelete });

  //       setStudents((prevStudents) =>
  //         prevStudents.filter((student) => student.$id !== studentToDelete)
  //       );
  //       console.log("Student deleted:", studentToDelete);
  //     } catch (error) {
  //       console.error("Error deleting student:", error);
  //     }
  //   }
  //   setIsModalOpen(false);
  // };

  // const cancelDelete = () => {
  //   setStudentToDelete(null);
  //   setIsModalOpen(false);
  // };
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        setStudents([]); // Clear students immediately before fetching

        const xed: Models.Document[] = await getStudentsByClass({ classRoom });
        if (xed) {
          const transformedStudents = xed.map((student) => ({
            $id: student.$id,
            name: student.name,
            studentId: student.studentId,
          }));

          setStudents(transformedStudents);
          console.log(transformedStudents, students);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (classRoom && term && session && subject) {
      fetchStudents();
    }
  }, [classRoom, term, session, subject]);
  useEffect(() => {
    const fetchStudentsScore = async () => {
      try {
        setIsLoading(true);
        setScores([]);
        setIsStudent([]);

        const particles = await fetchResultData({
          classRoom,
          term,
          session,
          subject,
        });
        console.log("particles", particles);
        if (particles?.length) {
          const transformedScores = particles.flatMap((result) => {
            return result.scores.map((scoreString: string) => {
              const score = JSON.parse(scoreString); // Parse the JSON string into an object
              return {
                studentId: score.studentId,
                studentName: score.studentName,
                firstTest: score.firstTest,
                secondTest: score.secondTest,
                bnb: score.bnb,
                project: score.project,
                assignment: score.assignment,
                exam: score.exam,
                total: score.total,
                grade: score.grade,
              };
            });
          });

          setScores(transformedScores);
          console.log("Transformed Scores:", transformedScores);
        }
      } catch (error) {
        console.error("Error fetching student scores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (classRoom && subject && session && term) {
      fetchStudentsScore();
    }
  }, [classRoom, subject, session, term]);
  const handleSubmit = async () => {
    const fetchStudentsScore = async () => {
      try {
        setIsLoading(true);
        setScores([]);
        setIsStudent([]);

        const particles = await fetchResultData({
          classRoom,
          term,
          session,
          subject,
        });
        console.log("particles", particles);
        if (particles?.length) {
          const transformedScores = particles.flatMap((result) => {
            return result.scores.map((scoreString: string) => {
              const score = JSON.parse(scoreString); // Parse the JSON string into an object
              return {
                studentId: score.studentId,
                studentName: score.studentName,
                firstTest: score.firstTest,
                secondTest: score.secondTest,
                bnb: score.bnb,
                project: score.project,
                assignment: score.assignment,
                exam: score.exam,
                total: score.total,
                grade: score.grade,
              };
            });
          });

          setScores(transformedScores);
          console.log("Transformed Scores:", transformedScores);
        }
      } catch (error) {
        console.error("Error fetching student scores:", error);
      } finally {
        setIsLoading(false);
      }
    };
  };
  const handleEditSubmit = async () => {
    if (!editStudentData || !newScore) return;

    try {
      await editResults({
        classRoom,
        session,
        term,
        subject,
        action: "edit",
        studentId: editStudentData.$id,
        newScore: JSON.stringify({
          ...editStudentData, // Include existing student details
          scores: newScore, // Updated scores
        }),
      });

      setEditStudentData(null); // Clear edit state
      setNewScore(""); // Clear the score input field
      alert("Student scores updated successfully!");
    } catch (error) {
      console.error("Failed to update student scores:", error);
      alert("An error occurred while updating the scores.");
    }
  };
  const handleDelete = async (studentId: string) => {
    try {
      await editResults({
        classRoom,
        session,
        term,
        subject,
        action: "delete",
        studentId,
      });

      alert("Student record deleted successfully!");
    } catch (error) {
      console.error("Failed to delete student record:", error);
      alert("An error occurred while deleting the record.");
    }
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-start bg-gray-50 dark:bg-neutral-900 p-8">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-200 transition duration-200">
        View Results
      </h2>

      {/* Display Errors */}
      {/* {errors.length > 0 && (
        <div className="mb-4 w-full bg-red-100 text-red-800 p-4 rounded-md">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )} */}

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
              { value: "AgriculturalScience", label: "Agricultural Science" },
              { value: "BasicBiology", label: "Basic Biology" },
              { value: "BasicChemistry", label: "Basic Chemistry" },
              { value: "BasicPhysics", label: "Basic Physics" },
              { value: "Biology", label: "Biology" },
              { value: "BusinessStudies", label: "Business Studies" },
              { value: "Chemistry", label: "Chemistry" },
              {
                value: "ChristianReligiousStudies",
                label: "Christian Religious Studies",
              },
              { value: "CivicEducation", label: "Civic Education" },
              { value: "Commerce", label: "Commerce" },
              {
                value: "CulturalCreativeArt",
                label: "Cultural and Creative Art",
              },
              { value: "Economics", label: "Economics" },
              { value: "EnglishLanguage", label: "English Language" },
              { value: "French", label: "French" },
              { value: "Geography", label: "Geography" },
              { value: "Government", label: "Government" },
              { value: "History", label: "History" },
              { value: "ICT", label: "ICT" },
              { value: "IgboLanguage", label: "Igbo Language" },
              { value: "LiteratureInEnglish", label: "Literature-in-English" },
              { value: "Mathematics", label: "Mathematics" },
              { value: "MoralInstruction", label: "Moral Instruction" },
              { value: "MorningDrill", label: "Morning Drill" },
              {
                value: "NationalValueEducation",
                label: "National Value Education",
              },
              { value: "Physics", label: "Physics" },
              { value: "PrevocationalStudies", label: "Prevocational Studies" },
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
      </div>

      {/* Student Result Table */}
      {/* Student Result Table */}
      <div className="w-full overflow-x-auto flex-grow p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
          Add Student Results
        </label>

        {isLoading ? (
          <div className="flex justify-center items-center h-full ">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-purple-300 border-dotted rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading...</p>
            </div>
          </div>
        ) : (
          <table className="min-w-full table-auto border-collapse bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
            {students.length > 0 && (
              <thead className="bg-gray-100 dark:bg-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    1st Summarize Test (10%)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    2nd Summarize Test (10%)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assignment (10%)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Midterm Project (10%)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Book and Beyond (20%)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Examination (40%)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sum
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
            )}
            <tbody>
              {students
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name
                .map((student) => {
                  const studentScore = scores.find(
                    (score) => score.studentId === student.studentId
                  );

                  return (
                    <tr
                      key={student.studentId}
                      className="border-b border-gray-200 dark:border-neutral-700"
                    >
                      <td className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {student.name}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {editStudentData?.$id === student?.$id ? (
                          <Input
                            type="text"
                            value={editStudentData?.firstTest}
                            onChange={(e) =>
                              setEditStudentData({
                                ...editStudentData,
                                firstTest: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border rounded-md dark:bg-neutral-700 dark:text-white"
                          />
                        ) : studentScore ? (
                          studentScore.firstTest
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {editStudentData?.$id === student.$id ? (
                          <Input
                            type="text"
                            value={editStudentData?.secondTest}
                            onChange={(e) =>
                              setEditStudentData({
                                ...editStudentData,
                                secondTest: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border rounded-md dark:bg-neutral-700 dark:text-white"
                          />
                        ) : studentScore ? (
                          studentScore.secondTest
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {editStudentData?.$id === student.$id ? (
                          <Input
                            type="text"
                            value={editStudentData?.bnb}
                            onChange={(e) =>
                              setEditStudentData({
                                ...editStudentData,
                                bnb: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border rounded-md dark:bg-neutral-700 dark:text-white"
                          />
                        ) : studentScore ? (
                          studentScore.bnb
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {editStudentData?.$id === student.$id ? (
                          <Input
                            type="text"
                            value={editStudentData?.project}
                            onChange={(e) =>
                              setEditStudentData({
                                ...editStudentData,
                                project: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border rounded-md dark:bg-neutral-700 dark:text-white"
                          />
                        ) : studentScore ? (
                          studentScore.project
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {editStudentData?.$id === student.$id ? (
                          <Input
                            type="text"
                            value={editStudentData?.assignment}
                            onChange={(e) =>
                              setEditStudentData({
                                ...editStudentData,
                                assignment: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border rounded-md dark:bg-neutral-700 dark:text-white"
                          />
                        ) : studentScore ? (
                          studentScore.assignment
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {editStudentData?.$id === student.$id ? (
                          <Input
                            type="text"
                            value={editStudentData?.exam}
                            onChange={(e) =>
                              setEditStudentData({
                                ...editStudentData,
                                exam: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border rounded-md dark:bg-neutral-700 dark:text-white"
                          />
                        ) : studentScore ? (
                          studentScore.exam
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {editStudentData?.$id === student.$id ? (
                          <Input
                            type="text"
                            value={editStudentData?.total}
                            onChange={(e) =>
                              setEditStudentData({
                                ...editStudentData,
                                total: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border rounded-md dark:bg-neutral-700 dark:text-white"
                          />
                        ) : studentScore ? (
                          studentScore.total
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {editStudentData?.$id === student.$id ? (
                          <Input
                            type="text"
                            value={editStudentData?.grade}
                            onChange={(e) =>
                              setEditStudentData({
                                ...editStudentData,
                                grade: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border rounded-md dark:bg-neutral-700 dark:text-white"
                          />
                        ) : studentScore ? (
                          studentScore.grade
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {user?.role === "admin" && (
                          <td className="px-4 py-2 flex items-center gap-3">
                            {editStudentData &&
                            editStudentData?.$id === student?.$id ? (
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
                                  onClick={() =>
                                    setEditStudentData(studentScore!)
                                  }
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
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
      {!scores && (
        <button
          onClick={() => handleSubmit()}
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
      )}
    </div>
  );
};

export default CompiledResults;
