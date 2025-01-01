import { fetchCompiledResults, fetchResultWithSubject } from "@/lib/actions/rexults.actions";
import { useEffect, useState } from "react";
import Select from "./CustomSelect";
import { classOrder } from "@/lib/utils";
import { Input } from "../ui/input";
import { useUserContext } from "@/context/AuthContext";
import { getStudentsByClass } from "@/lib/actions/studentsData.actions";
import { Models } from "appwrite";
import Image from "next/image";
import { fetchResultData } from "@/lib/actions/results.actions";
import { listAllScoresBy } from "@/lib/actions/updateStudents.actions";



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
  const [values, setValues] = useState({});
  // New state for processing status
  const [isSuccess, setIsSuccess] = useState(false); // State for success popup
  const [isFailure, setIsFailure] = useState(false); // State for failure popup
  const [errorMessage, setErrorMessage] = useState(""); // State for storing error message
  const [completedSubmissions, setCompletedSubmissions] = useState(0);
  const [total, setTotal] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const [activeRow, setActiveRow] = useState(0); // Tracks the active row
  const [activeColumn, setActiveColumn] = useState(0); // Tracks the active column (field)
  // const inputRefs = useRef([]);
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
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
  
        const particles = await listAllScoresBy({
          classRoom,
          term,
          session,
          subject,
        });
  console.log("particles", particles)
        if (particles?.length) {
          const transformedScores = particles.flatMap((result) => {
            return result.scores.map((score) => ({
              studentId: score.studentId,
              firstTest: score.firstTest,
              secondTest: score.secondTest,
              bnb: score.bnb,
              project: score.project,
              assignment: score.assignment,
              exam: score.exam,
              total: score.total,
              grade: score.grade,
            }));
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
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-start bg-gray-50 dark:bg-neutral-900 p-8">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-200 transition duration-200">
        Upload Results
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
                Scored?
              </th>
            </tr>
          </thead>
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
            {studentScore ? studentScore.firstTest : "-"}
          </td>
          <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
            {studentScore ? studentScore.secondTest : "-"}
          </td>
          <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
            {studentScore ? studentScore.assignment : "-"}
          </td>
          <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
            {studentScore ? studentScore.project : "-"}
          </td>
          <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
            {studentScore ? studentScore.bnb : "-"}
          </td>
          <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
            {studentScore ? studentScore.exam : "-"}
          </td>
          <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
            {studentScore ? studentScore.total : "-"}
          </td>
          <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200">
            {studentScore ? studentScore.grade : "-"}
          </td>
          <td className="px-6 py-3 text-sm text-gray-800 dark:text-gray-200"></td>
        </tr>
      );
    })}
</tbody>

        </table>
        
        )}
      </div>

    </div>
  );
};

export default CompiledResults;
