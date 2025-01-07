"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import Image from "next/image";

import { decrypt, decryptKey, multiFormatDateString } from "@/lib/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getStudentResults, myArray } from "@/lib/actions/results.actions";

const PostDetails = (term: string, classRoom: string) => {
  const { user } = useUserContext();
  const [localUserData, setLocalUserData] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(false)
  const [fullUrl, setFullUrl] = useState<string | null>(null);

  const [extractedPart, setExtractedPart] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fullUrl = window.location.href;

      // Check if the URL contains 'localhost'
      if (fullUrl.includes("localhost")) {
        // Extract part after 'result-details/'
        const result = fullUrl.split("result-details/")[1];
        setExtractedPart(result || null);
      }
      // Check if the URL contains 'igca-etche-portal.vercel.app'
      else if (fullUrl.includes("https://igca-etche-portal.vercel.app")) {
        // Extract part after 'result-details/'
        const result = fullUrl.split("result-details/")[1];
        setExtractedPart(result || null);
      } else {
        // Default case if neither condition matches
        setExtractedPart(null);
      }
    }
  }, []);

  const { id } = useParams(); // ID of the post being viewed
  const singleId = Array.isArray(id) ? id[0] : id;
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await myArray({
          studentId: extractedPart!,
          session: " 2024/2025",
          term: "1st Term",
          classRoom: "SS3A",
        });
        console.log(response, singleId, extractedPart);
        setScores(response || []);
      } catch (error) {
        console.error(error);
      }
    };
    if (extractedPart) {
      fetch();
    }
  }, [extractedPart]);

  const totalScore = scores.reduce((sum, score) => sum + score.score.total, 0);
  const averageScore = (totalScore / scores.length).toFixed(2);

  // Function to determine the principal's comment
  const getPrincipalsComment = (average) => {
    if (average >= 80) return "Excellent result, keep it up.";
    if (average >= 65) return "A very good result, keep it up.";
    if (average >= 60) return "Good result, you can do better.";
    if (average >= 55)
      return "Fairly good result, work harder for a better performance.";
    if (average >= 50)
      return "Fair result, put in more effort for a good performance.";
    if (average >= 40)
      return "Fairly poor result, work harder for an improved performance.";
    return "Poor result, sit up to perform well in your result.";
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900">
      {isLoading ? (
        // Skeleton loader while loading
        <div className="space-y-4">
          <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-6 w-1/4 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-4 w-1/5 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      ) : (
        <>
          {/* Student Information */}
          <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-purple-500 dark:text-purple-400">
              {scores && scores[0].score?.studentName}
            </h1>
            {/* <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Class:</span> {className}
            </p> */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Student ID:</span> { scores && scores[0].score?.studentId}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              <span className="font-semibold">Total Score:</span> {totalScore}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Average Score:</span>{" "}
              {averageScore}
            </p>
            <p className="mt-4 text-md font-medium text-purple-600 dark:text-purple-400">
              Principal's Comment:{" "}
              <span className="italic">
                {getPrincipalsComment(averageScore)}
              </span>
            </p>
          </div>

          {/* Scores Table */}
          <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <table className="min-w-full border-collapse table-auto">
              <thead className="bg-purple-500 dark:bg-purple-600 text-white">
                <tr>
                  {[
                    "Subject",
                    "First Test",
                    "Second Test",
                    "Project",
                    "BNB",
                    "Assignment",
                    "Exam",
                    "Total",
                    "Grade",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {scores.map((score, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-purple-100 dark:hover:bg-purple-700 transition duration-300 ${
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-700"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200 border-gray-200">
                      {score.subject}
                    </td>
                    {[
                      score.score.firstTest,
                      score.score.secondTest,
                      score.score.project,
                      score.score.bnb,
                      score.score.assignment,
                      score.score.exam,
                      score.score.total,
                      score.score.grade,
                    ].map((value, i) => (
                      <td
                        key={i}
                        className={`px-6 py-4 text-sm ${
                          i === 7
                            ? "font-semibold"
                            : "text-gray-600 dark:text-gray-300"
                        } border-gray-200`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetails;
