"use client";
import { useState } from "react";
import { getStudentsByClass } from "@/lib/actions/studentsData.actions";
import {
  listAllScores,
  prepareAndAddResults,
  updateScoresWithClassRoom,
} from "@/lib/actions/updateStudents.actions";
import { Button } from "../ui/button";
import { classOrder } from "@/lib/utils";
import Select from "./CustomSelect";

const UpdateScoresComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ updated: 0, total: 0 });
  const [status, setStatus] = useState<
    "idle" | "success" | "failure" | "fetching"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [classRoom, setClassRoom] = useState<string>("");
  const [updatedStudents, setUpdatedStudents] = useState<Set<string>>(
    new Set()
  );
  const [subject, setSubject] = useState<string>("");

  const [term, setTerm] = useState<string>("");
  const [session, setSession] = useState<string>(""); // State for Term
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1; // Tracks the active column (field)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classRoom || isLoading) return;

    setIsLoading(true);
    setStatus("fetching");
    setErrorMessage(null);

    try {
     
      // const updates = fetchedScores.map(async (score) => {
        // if (!updatedStudents.has(score.id)) {
          const result = await prepareAndAddResults({
            classRoom,
            subject,
            session,
            term,
          });
          if (result) {
            setProgress((prev) => ({
              ...prev,
              updated: prev.updated + 1,
            }));
            // setUpdatedStudents((prev) => new Set(prev).add(score.id));
          } else {
            throw new Error("Update failed for a score.");
          }
        // }
    

 
      setStatus("success");
    } catch (error) {
      console.error("Error updating scores:", error);
      setErrorMessage("An error occurred while updating scores.");
      setStatus("failure");
    } finally {
      setIsLoading(false);
      setClassRoom("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full h-full flex flex-col items-center justify-start bg-gray-50 dark:bg-neutral-900 p-8">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-200 transition duration-200">
          Update Class
        </h2>
        <div className="flex flex-wrap justify-between gap-5 w-full mb-8">
          <div className="mb-5 w-full sm:w-1/3">
            {" "}
            <div className="mb-5 w-full">
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
                  {
                    value: "AgriculturalScience",
                    label: "Agricultural Science",
                  },
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
                  {
                    value: "LiteratureInEnglish",
                    label: "Literature-in-English",
                  },
                  { value: "Mathematics", label: "Mathematics" },
                  { value: "MoralInstruction", label: "Moral Instruction" },
                  { value: "MorningDrill", label: "Morning Drill" },
                  {
                    value: "NationalValueEducation",
                    label: "National Value Education",
                  },
                  { value: "Physics", label: "Physics" },
                  {
                    value: "PrevocationalStudies",
                    label: "Prevocational Studies",
                  },
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
        </div>
        {status === "fetching" && (
          <p className="text-center text-purple-600">
            Fetching class... Please wait.
          </p>
        )}
        {status === "idle" && isLoading && (
          <div>
            <p className="text-center mb-2">Updating class... Please wait.</p>
            <div className="w-full h-2 mb-4 bg-gray-200 rounded-full">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{
                  width: `${(progress.updated / progress.total) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-center">
              {progress.updated} / {progress.total} updated
            </p>
          </div>
        )}

        {status === "success" && (
          <p className="text-green-500 text-center">
            Update completed successfully! {progress.updated} class updated.
          </p>
        )}
        {status === "failure" && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}

        <Button
          type="submit"
          className="px-12 py-8 rounded-full bg-purple-500 text-white"
          disabled={!classRoom || isLoading}
        >
          {isLoading ? "Updating..." : "Update Class"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateScoresComponent;
