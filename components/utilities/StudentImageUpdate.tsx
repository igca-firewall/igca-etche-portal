"use client";
import { useState } from "react";
import { getStudentsByClass } from "@/lib/actions/studentsData.actions";
import {
  updateStudentsImages,
} from "@/lib/actions/updateStudents.actions";
import { Button } from "../ui/button";
import { classOrder, generateavatar } from "@/lib/utils";
import Select from "./CustomSelect";

const UpdateStudentsImages: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ updated: 0, total: 0 });
  const [status, setStatus] = useState<"idle" | "success" | "failure" | "fetching">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [classRoom, setClassRoom] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [term, setTerm] = useState<string>("");
  const [session, setSession] = useState<string>("");
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classRoom || isLoading) return;

    setIsLoading(true);
    setStatus("fetching");
    setErrorMessage(null);

    try {
      const students = await getStudentsByClass({ classRoom });
      setProgress({ updated: 0, total: students.length });

      if (students.length === 0) {
        throw new Error("No students found in the specified class.");
      }

      let updatedCount = 0;

      for (const student of students) {
        try {
            const students = await getStudentsByClass({ classRoom });
        
            if (students.length === 0) {
              throw new Error("No students found in the specified class.");
            }
        
            // Initialize the imageMap for all students
            const imageMap: { [id: string]: string } = {};
        
            // Generate a unique avatar for each student and populate the imageMap
            students.forEach((student) => {
              const avatarImageUrl = generateavatar(`${student.name[0]}${student.name[1]}`);
              imageMap[student.$id] = avatarImageUrl;
            });
        
            // Call the backend to update students' images with the imageMap
            const { updatedCount, failed } = await updateStudentsImages({
              classRoom,
              imageMap, // Pass the image map for each student
            });
        
            setProgress({ updated: updatedCount, total: students.length });
            setStatus(updatedCount > 0 ? "success" : "failure");
            if (failed.length > 0) {
              setErrorMessage(`Failed to update images for students: ${failed.join(", ")}`);
            }
        
          } catch (error) {
          console.error(`Failed to update student with ID: ${student.$id}`, error);
        }
      }

      if (updatedCount > 0) {
        setStatus("success");
        console.log(`Successfully updated ${updatedCount} student images.`);
      } else {
        setStatus("failure");
        setErrorMessage("No student images were updated.");
      }
    } catch (error) {
      console.error("Error during the image update process:", error);
      setStatus("failure");
      setErrorMessage("There was an error updating the student images.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full h-full flex flex-col items-center justify-start bg-gray-50 dark:bg-neutral-900 p-8 rounded-[25px] border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-gray-200 transition duration-200">
          Update Class
        </h2>
        <div className="flex flex-wrap justify-between gap-5 w-full mb-8">
          <div className="mb-5 w-full sm:w-1/3">
            <label htmlFor="classRoom" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
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
        </div>

        {status === "fetching" && <p className="text-center text-purple-600">Fetching class... Please wait.</p>}
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
            <p className="text-center">{progress.updated} / {progress.total} updated</p>
          </div>
        )}

        {status === "success" && (
          <p className="text-green-500 text-center">
            Update completed successfully! {progress.updated} class updated.
          </p>
        )}
        {status === "failure" && <p className="text-red-500 text-center">{errorMessage}</p>}

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

export default UpdateStudentsImages;
