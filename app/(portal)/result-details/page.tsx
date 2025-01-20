"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { useParams } from "next/navigation";
import { myArray } from "@/lib/actions/results.actions";
import Image from "next/image";
import { decryptKey, formatSubject } from "@/lib/utils";
import { fetchComments } from "@/lib/actions/comment.actions";
import jsPDF from "jspdf";
interface Comment {
  studentName: string;
  studentId: string;
  comment: string;
}
const PostDetails = ({
  session,
  term,
  classRoom,
  studentId,
}: {
  session: string;
  term: string;
  classRoom: string;
  studentId: string;
}) => {
  const { user } = useUserContext();
  const [localUserData, setLocalUserData] = useState<any>(null);
  const [localUser, setLocalUser] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [extractedPart, setExtractedPart] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment | null>(null);
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
          studentId: studentId,
          session: session,
          term: term,
          classRoom: classRoom,
        });
        setScores(response || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (studentId && term && session && classRoom) {
      fetch();
    }
  }, [studentId, term, session, classRoom]);
  useEffect(() => {
    const fetchCommentsData = async () => {
      try {
        const fetchedComments = await fetchComments({
          term,
          session: session!.replace(/\s+/g, ""),
          classRoom,
          studentId,
        });
        setComments(fetchedComments);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCommentsData();
  }, [term, session, classRoom, studentId]);

  const totalScore = scores.reduce((sum, score) => {
    const scoreTotal = Number(score.score.total) || 0;
    return sum + scoreTotal;
  }, 0);

  const averageScore = (totalScore / scores.length).toFixed(2);

  const getPrincipalsComment = (average: any) => {
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
    const printWindow = window.open("", "_blank", "width=800,height=600");

    const content = document?.getElementById("results-section")?.innerHTML;

    printWindow?.document.write(`
     <html>
  <head>
    <style>
      /* Global Styles */
      body {
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        color: #333;
      }

      #print-content {
        padding: 0rem;
        background-color: #ffffff;
       width: 100%;
        max-width: 9600px;
        margin: 20px auto;
        line-height: 1.7;
      }

      h1 {
        font-size: 32px;
        font-weight: 600;
        text-align: center;
        color: #2b2b2b;
        margin-bottom: 1rem;
      }

      h2 {
        font-size: 18px;
        font-weight: 500;
        color: #4a4a4a;
        margin-bottom: 1rem;
      }

      .text-sm {
        font-size: 14px;
      }

      .font-medium {
        font-weight: 500;
      }

      .text-gray-700 {
        color: #4a5568;
      }

      .rounded-lg {
        border-radius: 8px;
      }

      /* Table Styles */
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 2rem;
        border: 1px solid #ddd;
        border-radius: 20px;
        
        overflow: hidden;
      }

      th, td {
        padding: 1rem;
        text-align: left;
        font-size: 16px;
      }

      th {
        background-color: #f4f4f4;
        color: #333;
        font-weight: 500;
      }

      tr:nth-child(even) {
        background-color: #fafafa;
      }

      tr:nth-child(odd) {
        background-color: #ffffff;
      }

      .text-bold {
        font-weight: bold;
      }

      .bg-blue-500 {
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .bg-blue-500:hover {
        background-color: #0056b3;
      }

      /* Print Media Styles */
      @media print {
        body {
          background-color: #fff;
          margin: 0;
        }

        #print-content {
          box-shadow: none;
          padding: 0rem;
          width: 100%;
          max-width: unset;
          margin: 0;
        }

        h1 {
          font-size: 32px;
          text-align: center;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        th, td {
          padding: 0.75rem;
          border: 1px solid #ddd;
        }

        th {
          font-size: 16px;
          background-color: #f4f4f4;
        }

        td {
          font-size: 14px;
        }

        .no-print {
          display: none;
        }
      }
    </style>
  </head>
  <body>
    <div id="print-content">
      <div
        id="results-section"
        class="p-2 bg-gray-100 rounded-lg "
      >
        <div class="flex flex-col items-center justify-center">
          <div class="flex flex-col items-center space-y-4">
            <div class="w-6 h-6 ">
              <img
                src="/images/logo.jpg"
                alt="Logo"
                width="40"
                height="40"
                class="rounded-full shadow-lg items-center justify-center"
              />
            </div>
            <h1 class="text-center text-black font-semibold text-2xl sm:text-3xl">
              INTELLECTUAL GIANTS CHRISTIAN ACADEMY
            </h1>
          </div>

          <div class="flex  space-y-4 ">
            <div class="flex flex-col justify-between items-start">
              <h2 class="font-semibold text-[14px] text-gray-900">
                Name: ${scores[0]?.studentName}
              </h2>
              <h2 class="font-semibold text-[14px] text-gray-800">
                Class: ${scores[0]?.classRoom}
              </h2>
            </div>
            <div class="flex flex-col justify-between items-end">
              <h2 class="font-semibold text-[14px] text-gray-800">
                Term: ${scores[0]?.term}
              </h2>
              <h2 class="font-semibold text-[14px] text-gray-800">
                Academic Session: ${scores[0]?.session}
              </h2>
            </div>

            <div class="flex justify-end items-center">
              <p class="text-sm text-gray-600">
                <span class="font-semibold">Student ID:</span> ${studentId}
              </p>
            </div>
 <div class="overflow-x-auto bg-white shadow-md rounded-lg mt-2 mb-10">
              ${
                scores.length > 0
                  ? `
              <table class="min-w-full table-auto">
                <thead class="bg-gray-200 text-gray-900">
                  <tr>
                    ${[
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
                    ]
                      .map(
                        (header) => `
                      <th class="px-4 py-2 text-sm font-semibold">${header}</th>`
                      )
                      .join("")}
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-300">
                  ${scores
                    .map(
                      (score, index) => `
                      <tr class="${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }">
                        <td class="px-6 py-4 text-sm font-medium text-gray-800">
                          ${score.subject}
                        </td>
                        ${[
                          score.score.firstTest,
                          score.score.secondTest,
                          score.score.project,
                          score.score.bnb,
                          score.score.assignment,
                          score.score.exam,
                          score.score.total,
                          score.score.grade,
                        ]
                          .map(
                            (value) => `
                            <td class="px-6 py-4 text-sm text-gray-600">${value}</td>`
                          )
                          .join("")}
                        <td>${getRemarks(score.score.total)}</td>
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>`
                  : ""
              }
            </div>
            
            ${
              scores.length > 0
                ? `
            <div class="p-6 mt-16 bg-white rounded-lg shadow-sm border border-gray-300 space-y-4">
              <div class="text-base text-gray-800 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
                <p class="text-lg font-medium text-center text-gray-900">
                  Average Score: <span class="font-bold">${averageScore}</span>
                </p>
                <p>
                  <span class="font-medium">Total Score:</span>
                  <span class="font-semibold">${totalScore}</span>
                </p>
                <p>
                  <span class="font-medium">Teacher's Comment:</span>
                  <span class="italic">${comments?.comment}</span>
                </p>
                <p>
                  <span class="font-medium">Principal's Comment:</span>
                  <span class="italic">${getPrincipalsComment(averageScore)}</span>
                </p>
              </div>
            </div>`
                : ""
            }
          </div>
        </div>
      </div>
    </div>
  </body>
</html>

    `);

    printWindow?.document.close();

    printWindow!.onload = () => {
      printWindow?.print();
      printWindow?.close();
    };
  };

  const saveAsPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Student Result Sheet", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${scores[0].studentName}`, 20, 30);

    doc.text(`Student ID: ${studentId}`, 20, 60);
    doc.text(`Classroom: ${scores[0].classRoom}`, 20, 70);
    doc.text(`Term: ${scores[0].term}`, 20, 80);
    doc.text(`Session: ${scores[0]?.session}`, 20, 80);

    doc.text("Results", 20, 90);
    let yOffset = 100;

    scores.forEach((result) => {
      doc.text(`Subject: ${result.subject}`, 20, yOffset);
      doc.text(`1st Test: ${result.score.firstTest}`, 20, yOffset + 10);
      doc.text(`2nd Test: ${result.score.secondTest}`, 20, yOffset + 20);
      doc.text(`Midterm Project: ${result.score.project}`, 20, yOffset + 30);
      doc.text(`Assignment: ${result.score.bnb}`, 20, yOffset + 40);
      doc.text(`Book and Beyond: ${result.score.assignment}`, 20, yOffset + 50);
      doc.text(`Exam: ${result.score.exam}`, 20, yOffset + 60);
      doc.text(`Total: ${result.score.total || "N/A"}`, 20, yOffset + 70);
      doc.text(`Grade: ${result.score.grade}`, 20, yOffset + 80);
      yOffset += 90;
    });

    // Adding Teacher and Principal Comments
    doc.text("Teacher's Comment:", 20, yOffset);
    doc.text(comments?.comment || "No comment provided.", 20, yOffset + 10);
    yOffset += 30;

    doc.text("Principal's Comment:", 20, yOffset);
    doc.text(
      getPrincipalsComment(averageScore) || "No comment provided.",
      20,
      yOffset + 10
    );

    doc.save(`IGCA_Result_${new Date().getDate}.png`);
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
    try {
      const element = document.getElementById("results-section");
      if (!element) {
        console.error("Element with id 'results-section' not found.");
        return;
      }

      // Capture the element as a PNG
      const image = await toPng(element, {
        cacheBust: true, // Prevent caching issues
        backgroundColor: "white", // Add a background color if needed
      });

      // Use FileSaver to save the image
      saveAs(image, `IGCA_Result_${new Date().getDate}.png`);
    } catch (error) {
      console.error("Failed to download as image:", error);
    }
  };
  return (
    <div
      id="results-section"
      className="p-12 bg-gray-100 dark:bg-neutral-900 rounded-[25px] border-neutral-200 dark:border-neutral-700 "
    >
      <div>
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24">
              <Image
                src="/images/logo.jpg"
                alt="Logo"
                width={100}
                height={100}
                className="rounded-full shadow-lg"
                layout="intrinsic"
                quality={90}
              />
            </div>
            <h1 className="text-center text-black dark:text-white font-semibold font-ibm-plex-serif text-2xl sm:text-3xl">
              INTELLECTUAL GIANTS CHRISTIAN ACADEMY
            </h1>
          </div>
          {/* Information Section */}
        </div>
        <div className="flex flex-col space-y-4">
          {scores.length > 0 && (
            <>
              {" "}
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
            </>
          )}

          <div className="flex justify-end items-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold">Student ID:</span> {studentId}
            </p>
          </div>
        </div>
        {/* Scores Table */}
        <div className="overflow-x-auto bg-white dark:bg-neutral-800 shadow-md rounded-lg mt-2">
          {" "}
          {scores.length > 0 && (
            <table className="min-w-full px-6 py-3 border-collapse table-auto">
              <thead className="bg-neutral-400  rounded-full dark:bg-neutral-800 text-white">
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
                      className="px-3 py-2 border-b-2 border-neutral-200 text-left text-sm font-semibold"
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
                    className={`hover:bg-purple-100 dark:hover:bg-neutral-900 transition duration-300 ${
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
          )}
          {}
        </div>{" "}
        {scores.length > 0 && (
          <>
            {" "}
            <div className="p-6 mt-6 dark:bg-neutral-800 bg-white dark:bg-black rounded-lg shadow-sm border border-neutral-300 dark:border-neutral-700 space-y-4">
              <div className="text-base text-neutral-800 dark:text-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
                <p className="text-lg font-medium text-center text-neutral-900 dark:text-neutral-100">
                  Average Score:{" "}
                  <span className="font-bold">{averageScore}</span>
                </p>{" "}
                <p>
                  <span className="font-medium">Total Score:</span>{" "}
                  <span className="font-semibold">{totalScore}</span>
                </p>
                <p>
                  <span className="font-medium">Principal's Comment:</span>{" "}
                  <span className="italic">
                    {getPrincipalsComment(averageScore)}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Teacher's Comment:</span>{" "}
                  <span className="italic">{comments?.comment}</span>
                </p>
              </div>
            </div>
            <div className="flex space-x-4 mb-4 items-center justify-center">
              <button
                disabled={!user || scores.length < 1 || isLoading}
                onClick={printPage}
                className="bg-gray-300 dark:bg-neutral-700 border-gray-400 dark:border-gray-900 text-neutral-500 dark:text-purple-50 rounded-full px-6 py-4 mt-10 mb-10 flex gap-2 items-center justify-center"
              >
                <Image
                  src="/images/printtf.png"
                  alt="Print"
                  width={25}
                  height={25}
                />{" "}
                Print
              </button>
              <button
                disabled={!user || !scores || isLoading}
                onClick={exportToCSV}
                className="bg-gray-300 dark:bg-neutral-700 border-gray-400 dark:border-gray-900 text-neutral-500 dark:text-purple-50 rounded-full px-6 py-4 mt-10 mb-10 flex gap-2 items-center justify-center"
              >
                <Image
                  src="/images/csv.png"
                  alt="Export"
                  width={25}
                  height={25}
                />{" "}
                Export
              </button>
              <button
                disabled={!user || !scores || isLoading}
                onClick={downloadAsImage}
                className="bg-gray-300 dark:bg-neutral-700 border-gray-400 dark:border-gray-900 text-neutral-500 dark:text-purple-50 rounded-full px-6 py-4 mt-10 mb-10 flex gap-2 items-center justify-center"
              >
                <Image
                  src="/images/asimage.png"
                  alt="Download"
                  width={25}
                  height={25}
                />{" "}
                Download as Image
              </button>
            </div>
          </>
        )}
      </div>{" "}
      {isLoading && (
        <div className="fixed inset-0 z-50  flex items-center justify-center backdrop-blur-sm">
          <div className="p-8 rounded-2xl bg-white shadow-xl dark:bg-neutral-900 flex flex-col items-center justify-center space-y-6">
            <div className="flex flex-col items-center bg-white dark:bg-neutral-900 space-y-4 animate-pulse">
              <span className="text-5xl">⏳</span>
              <p className="text-center text-lg text-gray-800 dark:text-gray-200 font-medium">
                {currentMessage}
              </p>
            </div>
            <div className="mt-4 flex space-x-2">
              <span className="animate-bounce text-3xl">🔄</span>
              <span className="animate-bounce text-3xl delay-150">✨</span>
              <span className="animate-bounce text-3xl delay-300">🌟</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
