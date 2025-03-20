import React, { useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
interface StudentAverages {
  studentName: string;
  averageScore: number;
}

const RankedStudentResults: React.FC<{ students: StudentAverages[] }> = ({
  students,
}) => {
  const [totalCount, setTotalCount] = useState<number | "all">(3);
  const downloadAsImage = async () => {
    try {
      const element = document.getElementById("MasterSheet");
      if (!element) {
        console.error("Element with id 'MasterSheet' not found.");
        return;
      }

      // Capture the element as a PNG
      const image = await toPng(element, {
        cacheBust: true, // Prevent caching issues
        // backgroundColor: "white", // Add a background color if needed
      });

      // Use FileSaver to save the image
      saveAs(image, `MasterSheet`);
    } catch (error) {
      console.error("Failed to download as image:", error);
    }
  };
  // Load saved count from localStorage on mount
  useEffect(() => {
    const savedCount = localStorage.getItem("totalStudentCount");
    if (savedCount) {
      setTotalCount(savedCount === "all" ? "all" : Number(savedCount));
    }
  }, []);

  // Save selection to localStorage
  const handleTotalCountChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newCount =
      event.target.value === "all" ? "all" : Number(event.target.value);
    setTotalCount(newCount);
    localStorage.setItem("totalStudentCount", newCount.toString());
  };

  // Sort students by highest average score
  const sortedStudents = [...students].sort(
    (a, b) => b.averageScore - a.averageScore
  );

  // Determine how many students to display
  const displayedStudents =
    totalCount === "all" ? sortedStudents : sortedStudents.slice(0, totalCount);

  // Function to format ranking numbers with suffixes
  const getRankSuffix = (rank: number) => {
    if (rank === 1) return "🥇 1st";
    if (rank === 2) return "🥈 2nd";
    if (rank === 3) return "🥉 3rd";
    if (rank % 10 === 1 && rank !== 11) return `${rank}st`;
    if (rank % 10 === 2 && rank !== 12) return `${rank}nd`;
    if (rank % 10 === 3 && rank !== 13) return `${rank}rd`;
    return `${rank}th`;
  };

  return (
      <div
    id="MasterSheet"
          className="max-w-4xl mx-auto mt-6 p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
        🏆 Student Rankings 🏆
      </h2>
      <FiDownload onClick={() => downloadAsImage()} className="cursor-pointer h-10 w-10"/>

      <div className="mb-4 text-center">
        <label className="mr-2 text-gray-900 dark:text-white">Show Top:</label>
        <select
          value={totalCount}
          onChange={handleTotalCountChange}
          className="p-2 border rounded bg-gray-200 dark:bg-neutral-700 dark:text-white"
        >
          {["all", 1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num === "all" ? "All" : num}
            </option>
          ))}
        </select>
      </div>

      {/* Display students */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayedStudents.map((student, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-gray-100 dark:bg-neutral-700 shadow-md border-gray-200 dark:border-neutral-600"
          >
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {getRankSuffix(index + 1)} - {student.studentName}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Average Score:{" "}
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {student.averageScore.toFixed(2)}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankedStudentResults;
