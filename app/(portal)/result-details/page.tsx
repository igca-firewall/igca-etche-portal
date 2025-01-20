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
    const printContents =
      document?.getElementById("results-section")?.innerHTML; // Replace 'results-section' with your specific div's ID
    const printWindow = window.open("", "", "width=800,height=600");

    if (printWindow) {
      printWindow.document.write(`
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Results Section</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
    }

    #results-section {
      padding: 12px;
      background-color: #f3f4f6;
      color: #000;
      border-radius: 25px;
      border: 1px solid #e5e7eb;
      max-width: 900px;
      margin: 20px auto;
    }

    #results-section.dark {
      background-color: #121212;
      border-color: #374151;
      color: #fff;
    }

    .center {
      text-align: center;
    }

    .logo {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .heading {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 16px 0;
    }

    .sub-heading {
      font-size: 14px;
      margin: 4px 0;
    }

    .table-container {
      overflow-x: auto;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-top: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead th {
      background-color: #6b7280;
      color: #fff;
      padding: 8px;
      font-size: 14px;
      font-weight: 600;
    }

    tbody tr:nth-child(even) {
      background-color: #f9fafb;
    }

    tbody tr:nth-child(odd) {
      background-color: #fff;
    }

    td {
      padding: 8px;
      border: 1px solid #e5e7eb;
    }

    .actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
      justify-content: center;
    }

    .button {
      padding: 10px 16px;
      border-radius: 50px;
      border: 1px solid #e5e7eb;
      background-color: #e5e7eb;
      color: #6b7280;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .button img {
      width: 20px;
      height: 20px;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
    }

    .loading-box {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .loading-box span {
      display: block;
      font-size: 24px;
      margin-bottom: 8px;
    }

    .loading-box p {
      font-size: 16px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div id="results-section">
    <div class="center">
      <img src="/images/logo.jpg" alt="Logo" class="logo">
      <h1 class="heading">INTELLECTUAL GIANTS CHRISTIAN ACADEMY</h1>
    </div>

    <div>
      <p class="sub-heading"><strong>Name:</strong> John Doe</p>
      <p class="sub-heading"><strong>Class:</strong> 6B</p>
      <p class="sub-heading"><strong>Term:</strong> First</p>
      <p class="sub-heading"><strong>Session:</strong> 2023/2024</p>
      <p class="sub-heading"><strong>Student ID:</strong> 123456789</p>
    </div>

    <div class="table-container">
     ${printContents}
    </div>

  

   
  </div>
</body>
</html>

      `);
      printWindow.document.close(); // Close the document
      printWindow.focus(); // Focus on the new window
      printWindow.print(); // Trigger the print dialog
      printWindow.close(); // Close the print window after printing
    }
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
      doc.text(
        `Book and Beyond: ${result.score.assignment}`,
        20,
        yOffset + 50
      );
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
                  {comments?.comment}
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
