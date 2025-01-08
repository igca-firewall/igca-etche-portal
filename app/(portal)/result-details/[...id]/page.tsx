"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { useParams } from "next/navigation";
import { myArray } from "@/lib/actions/results.actions";
import Image from "next/image";
import { decryptKey, formatSubject } from "@/lib/utils";
import { number } from "zod";

const PostDetails = (term: string, classRoom: string) => {
  const { user } = useUserContext();
  const [localUserData, setLocalUserData] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [extractedPart, setExtractedPart] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fullUrl = window.location.href;
      const keyword = "result-details/";
      const startIndex = fullUrl.indexOf(keyword);
      if (startIndex !== -1) {
        const result = fullUrl.substring(
          startIndex + keyword.length,
          startIndex + keyword.length + 18
        );
        setExtractedPart(result || null);
      } else {
        setExtractedPart(null);
      }
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("Particles_Class_Stuff_Just_Leave it...");
    if (storedData) {
      const decryptedData = decryptKey(storedData);
      const parsedData = JSON.parse(decryptedData);
      setLocalUserData(parsedData);
    }
  }, []);
  const messages = [
    "Hang tight! We're fetching the data... 🚀",
    "Just a moment... Great things are loading! 🔄",
    "Almost there... Magic is happening! ✨",
    "Thanks for waiting... We appreciate your patience! 🌟",
  ];

  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prevMessage) => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 3000); // Change the message every 3 seconds

    return () => clearInterval(interval);
  }, [messages]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const response = await myArray({
          studentId: extractedPart!,
          session: ` ${localUserData.session}`,
          term: `${localUserData.term}`,
          classRoom: `${localUserData.classRoom}`,
        });
        setScores(response || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (extractedPart) {
      fetch();
    }
  }, [extractedPart]);

  const totalScore = scores.reduce((sum, score) => {
    const scoreTotal = Number(score.score.total) || 0;
    return sum + scoreTotal;
  }, 0);

  const averageScore = (totalScore / scores.length).toFixed(2);

  const getPrincipalsComment = (average: number) => {
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
  const getRemarks = (total: number): string => {
    if (total >= 80) return "Distinction";
    if (total >= 70) return "Very Good";
    if (total >= 60) return "Good";
    if (total >= 50) return "Credit";
    if (total >= 40) return "Poor";
    return "Fail";
  };
  const printPage = () => {
    window.print();
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "Subject",
          "First Test",
          "Second Test",
          "Project",
          "BNB",
          "Assignment",
          "Exam",
          "Total",
          "Grade",
        ],
        ...scores.map((score) => [
          score.subject,
          score.score.firstTest,
          score.score.secondTest,
          score.score.project,
          score.score.bnb,
          score.score.assignment,
          score.score.exam,
          score.score.total,
          score.score.grade,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAsImage = async () => {
    const element = document.getElementById("results-section");
    if (element) {
      const image = await toPng(element);
      saveAs(image, "results.png");
    }
  };
  if (isLoading) {
    return (
      <div className="p-56 rounded-[25px] z-50 dark:border-neutral-200 border-neutral-800 backdrop-blur-md items-center justify-self-center dark:bg-neutral-100 bg-neutral-700 "></div>
    );
  }
  return (
    <div className="p-12 bg-gray-100 dark:bg-neutral-900 rounded-[25px] border-neutral-200 dark:border-neutral-700 ">
      <div id="results-section">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Logo Section */}
          <div className="w-[100px] h-[100px] ">
            <Image
              src="/images/logo.jpg"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full shadow-md"
              layout="intrinsic"
              quality={90}
            />
          </div>

          {/* Academy Name */}
          <h1 className="text-center text-black font-semibold font-nunito text-2xl sm:text-3xl">
            INTELLECTUAL GIANTS CHRISTIAN ACADEMY
          </h1>

          {/* Information Section */}
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="font-nunito font-semibold text-[14px] text-neutral-900 dark:text-neutral-100">
              Name: {scores[0]?.studentName}
            </h1>
            <h2 className="font-nunito font-semibold text-[14px] text-neutral-800 dark:text-neutral-200">
              Class: {scores[0]?.classRoom}
            </h2>
          </div>
          <div className="flex justify-between items-start">
            <h2 className="font-nunito font-semibold text-[14px] text-neutral-800 dark:text-neutral-200">
              Term: {scores[0]?.term}
            </h2>
            <h2 className="font-nunito font-semibold text-[14px] text-neutral-800 dark:text-neutral-200">
              Academic Session: {scores[0]?.session}
            </h2>
          </div>
          <div className="flex justify-end items-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold">Student ID:</span> {extractedPart}
            </p>
          </div>
        </div>
        {/* Scores Table */}
        <div className="overflow-x-auto bg-white dark:bg-neutral-800 shadow-md rounded-lg mt-2">
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-neutral-400 rounded-full dark:bg-neutral-800 text-white">
              <tr>
                {[
                  "Subject",
                  "1st Summarize Test",
                  "2nd Summarize Test",
                  "MidTerm Project",
                  "Assignment",
                  "Book/Beyond",
                  "Exam",
                  "Total",
                  "Grade",
                  "Remarks",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 border-b-2 border-neutral-200 text-left text-sm font-semibold uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {scores.map((score, index) => (
                <tr
                  key={index}
                  className={`hover:bg-purple-100 dark:hover:bg-neutral-700 transition duration-300 ${
                    index % 2 === 0
                      ? "bg-neutral-50 dark:bg-neutral-700"
                      : "bg-white dark:bg-neutral-800"
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-neutral-800 dark:text-neutral-200 border-neutral-200">
                    {formatSubject(score.subject)}
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
                          : "text-neutral-600 dark:text-neutral-300"
                      } border-neutral-200`}
                    >
                      {value}
                    </td>
                  ))}
                  <td>{getRemarks(score.score.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {}
        </div>{" "}
        <div className="flex flex-col items-end justify-end">
          {/* Particles Image Above Text */}

          {/* Information Text */}
          <i className="text-center text-gray-700 font-normal font-nunito">
            For more information visit:
            <span className="text-blue-600">
              {" "}
              ...https://igca-etche-portal.vercel.app/docs
            </span>
          </i>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-[180px] h-full">
            <Image
              src="/images/particlesm.png"
              alt="Particles"
              width={100}
              height={70}
              className="dark:invert-white w-full h-auto"
              layout="intrinsic"
              quality={100}
            />
          </div>
        </div>
      </div>
      <div className="flex space-x-4 mb-4 items-center justify-center">
        <button
          disabled={
            user.role === undefined ||
            scores.length < 0 ||
            extractedPart === null ||
            extractedPart === undefined ||
            isLoading
          }
          onClick={printPage}
          className={`bg-gray-300 dark:bg-neutral-700 border-gray-400 dark:border-gray-900 text-neutral-500 dark:text-purple-50 rounded-full px-6 py-4 mt-10 mb-10 items-center text-center flex gap-2 justify-items-center ${
            !user ||
            !scores ||
            !extractedPart ||
            (isLoading && "bg-gray-200 text-neutral-400")
          }`}
        >
          <Image src="/images/printtf.png" alt="Print" width={25} height={25} />{" "}
          Print
        </button>
        <button
          disabled={!user || !scores || !extractedPart || isLoading}
          onClick={exportToCSV}
          className={`bg-gray-300 dark:bg-neutral-700 border-gray-400 dark:border-gray-900 text-neutral-500 dark:text-purple-50 rounded-full px-6 py-4 mt-10 mb-10 items-center text-center flex gap-2 justify-items-center ${
            !user ||
            !scores ||
            !extractedPart ||
            (isLoading && "bg-gray-200 text-neutral-400")
          }`}
        >
          <Image src="/images/csv.png" alt="Print" width={25} height={25} />
          Export to CSV
        </button>
        <button
          disabled={!user || !scores || !extractedPart || isLoading}
          onClick={downloadAsImage}
          className={`bg-gray-300 dark:bg-neutral-700 border-gray-400 dark:border-gray-900 text-neutral-500 dark:text-purple-50 rounded-full px-6 py-4 mt-10 mb-10 items-center text-center flex gap-2 justify-items-center ${
            !user ||
            !scores ||
            !extractedPart ||
            (isLoading && "bg-gray-200 text-neutral-400")
          }`}
        >
          <Image src="/images/asimage.png" alt="Print" width={25} height={25} />
          Download as Image
        </button>
        <button
          disabled={!user || !scores || !extractedPart || isLoading}
          // onClick={downloadAsImage}
          className={`bg-gray-300 dark:bg-neutral-700 border-gray-400 dark:border-gray-900 text-neutral-500 dark:text-purple-50 rounded-full px-6 py-4 mt-10 mb-10 items-center text-center flex gap-2 justify-items-center ${
            !user ||
            !scores ||
            !extractedPart ||
            (isLoading && "bg-gray-200 text-neutral-400")
          }`}
        >
          <Image
            src="/images/shareresult.png"
            alt="Print"
            width={25}
            height={25}
          />
          Share
        </button>
        <>
      {isLoading && (
        <div className="p-10 rounded-[25px] z-50 flex flex-col items-center justify-center border-neutral-200 dark:border-neutral-800 backdrop-blur-md bg-neutral-100 dark:bg-neutral-700">
          <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
            <span className="text-4xl">⏳</span>
            <p className="text-center text-lg text-gray-800 dark:text-gray-200 font-semibold">
              {currentMessage}
            </p>
          </div>
          <div className="mt-8 flex space-x-2">
            <span className="animate-bounce text-3xl">🔄</span>
            <span className="animate-bounce text-3xl delay-150">✨</span>
            <span className="animate-bounce text-3xl delay-300">🌟</span>
          </div>
        </div>
      )}
    </>
      </div>
    </div>
  );
};

export default PostDetails;
