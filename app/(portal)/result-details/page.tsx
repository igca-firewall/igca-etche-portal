"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { useParams } from "next/navigation";
import { myArray } from "@/lib/actions/results.actions";
import Image from "next/image";
import { decryptKey, formatSubject, generateUniqueId } from "@/lib/utils";
import { fetchComments } from "@/lib/actions/comment.actions";
import jsPDF from "jspdf";
import AllResults from "@/components/utilities/AllResults";

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

  const [scores, setScores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [comments, setComments] = useState<Comment | null>(null);
  const [selectedStudent, setSelectedStudent] = useState(false);
  const [deselect, setDeselected] = useState(false);
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
        setSelectedStudent(true);
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
  const formattedComments = comments?.comment
    ? comments.comment.charAt(0).toUpperCase() +
      comments.comment.slice(1).toLowerCase()
    : "";

  const printPage = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");

    const content = document?.getElementById("results-section")?.innerHTML;

    if (!content) {
      console.error("Content not found");
      return;
    }

    printWindow?.document.write(`
     <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Report</title>
  <style>
    /* Global Styles */
    body {
      font-family: 'Roboto', sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
      color: #2c3e50;
      line-height: 1.6;
    }

    /* Main Container */
    .container {
      width: 100%;
      max-width: 900px;
      margin: 30px auto;
      padding: 30px;
      background-color: #ffffff;
      border-radius: 10px;
     
    }

    /* Header Section */
    .header {
      text-align: center;
      margin-bottom: 40px;
    }

    .header img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-bottom: 20px;
    }

    .header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #2980b9;
      margin-bottom: 5px;
    }

    .header p {
      font-size: 15px;
      color: #7f8c8d;
    }

    /* Student Information Section */
    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    .info-section div {
      font-size: 14px;
    }

    .info-section strong {
      color: #34495e;
      font-weight: 600;
    }

    .info-section p {
      margin: 4px 0;
      color: #555;
    }

    /* Table Styling */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
      border-radius: 20px;
      font-size: 5px;
    }

    table th, table td {
      padding: 8px 10px;
      text-align: left;
      border: 1px solid #e0e0e0;
    }

    table th {
      background-color: #2980b9;
      color: white;
      font-weight: bold;
      text-transform: uppercase;
    }

    table tr:nth-child(even) {
      background-color: #f4f6f7;
    }

    table td {
      color: #333;
    }

    table td strong {
      color: #2c3e50;
    }

    /* Footer Section */
    .footer {
      margin-top: 20px;
      font-size: 16px;
      line-height: 1.6;
      color: #7f8c8d;
    }

    .footer p {
      margin: 6px 0;
    }

    .footer strong {
      color: #34495e;
    }

    /* Print Media Styles */
    @media print {
      body {
      font-family: 'Roboto', sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
      color: #2c3e50;
      line-height: 1.6;
      
    }

    /* Main Container */
    .container {
      width: 100%;
      max-width: 900px;
      margin: 20px auto;
      padding: 30px;
      background-color: #ffffff;
      border-radius: 10px;
    }

    /* Header Section */
    .header {
      text-align: center;
      margin-bottom: 32px;
    }

    .header img {
      width: 95px;
      height: 95px;
      border-radius: 20%;
      margin-bottom: 0px;
      
    }

    .header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #2980b9;
      margin-bottom: 5px;
    }

    .header p {
      font-size: 15px;
      color: #7f8c8d;
       margin-left: 25px;
    }

    /* Student Information Section */
    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 10px;
    }
 .logo_report {
      display: flex;
      justify-content: flex-end;
      gap: 20px;
      margin-bottom: 10px;
       margin-left: 40px;
    }
    .info-section div {
      font-size: 14px;
    }

    .info-section strong {
      color: #34495e;
      font-weight: 600;
    }

    .info-section p {
      margin: 4px 0;
      color: #555;
    }

    /* Table Styling */
    table {
      width: 90%;
    max-width: 800px
      margin-bottom: 30px;
      font-size: 10px;
      padding: 0px
border-radius: 12px
    }

    table th, table td {
      padding: 2px 4px;
      text-align: left;
     
    }

table thead th,table thead tr {
  background-color: #4a5568; /* Dark background for contrast */
  color: white; /* White text for readability */
  font-weight: bold;
  text-transform: uppercase; /* Make headers stand out */
}

 /* Table Styling */
    table {
      width: 90%;
    max-width: 800px
      margin-bottom: 30px;
      font-size: 10px;
      padding: 0px
 border-radius: 50%;
    }

    table th, table td {
      padding: 2px 4px;
      text-align: left;
     
    }

 thead {
  background-color: #333; /* Blue background */
  color: white; /* White text */
  font-weight: bold; /* Bold text */
  text-transform: uppercase; /* Uppercase text */
  font-size: 14px; /* Slightly larger text for clarity */
}

/* Table Header Cells */
table th {
  padding: 10px 12px; /* Add padding for space inside the cells */
  text-align: center; /* Center-align the text */
  border-bottom: 2px solid #ddd; /* Add a subtle border at the bottom */
  font-size: 14px; /* Ensures header text size is consistent */
  font-weight: bold; /* Make text bold */
}

/* Optional: Rounded top corners */
table th:first-child {
  border-top-left-radius: 8px;
}

table th:last-child {
  border-top-right-radius: 8px;
}
table th {
  background-color:#4a5568
  color: white;
  font-weight: bold;
  font-size: 8px;
  text-transform: uppercase;
}
    table tr:nth-child(even) {
      background-color: #f4f6f7;
    }

    table td {
      color: #333;
    }

    table td strong {
      color: #2c3e50;
    }

    table td strong {
      color: #2c3e50;
    }

    /* Footer Section */
    .footer {
      margin-top: 40px;
      font-size: 16px;
      line-height: 1.6;
      color: #7f8c8d;
    }

    .footer p {
      margin: 6px 0;
    }

    .footer strong {
      color: #34495e;
    }

    }

  </style>
</head>
<body>
  <div class="container">
    <!-- Header Section -->
    <div class="header">
     
      <h1>INTELLECTUAL GIANTS CHRISTIAN ACADEMY</h1><div class="logo_report">
             <img src="/images/logo.jpg" alt="Academy Logo">
      <p>Student Performance Report - Academic Year: 2024/2025</p>
      </div>

    </div>

    <!-- Student Information Section -->
    <div class="info-section">
      <div>
        <p><strong>Name: </strong>${scores[0]?.studentName}</p>
        <p><strong>Class: </strong>${scores[0]?.classRoom}</p>
         <p><strong>Term: </strong>${scores[0]?.term}</p>
        <p><strong>Session: </strong>${scores[0]?.session}</p>
       
       
      </div>
      <div> <p><strong>Student ID: </strong>${studentId}</p>
         <p><strong>Website: </strong>https://igca-etche-portal.vercel.app </p>
         <p><strong>Email: </strong>intellectualgiants105@gmail.com</p></div>
    
    </div>

    <!-- Score Table -->
    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th>1st Summative Test</th>
          <th>2nd Summative Test</th>
          <th>Assignment</th>  
          <th>MidTerm Project</th>
          <th>Book/Beyond</th>
          <th>Exam</th>
          <th>Highest</th>
          <th>Total</th>
          <th>Lowest</th>
          <th>Grade</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        ${scores
          .map(
            (score, index) => `
          <tr>
            <td>${formatSubject(score.subject)}</td>
            <td>${score.score.firstTest}</td>
            <td>${score.score.secondTest}</td> 
            <td>${score.score.bnb}</td>
            <td>${score.score.project}</td>
            <td>${score.score.assignment}</td>
            <td>${score.score.exam}</td>
            <td>${score.highestTotalScore}</td>
            <td>${score.score.total}</td>
            <td>${score.lowestTotalScore}</td>
            <td><strong>${score.score.grade}</strong></td>
            <td>${getRemarks(score.score.total)}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
  

    <!-- Summary Section -->
    <div class="footer">
      <p><strong>Average Score:</strong> ${averageScore}</p>
      <p><strong>Total Score:</strong> ${totalScore}</p>
      <p><strong>Principal's Comment:</strong> <em>${getPrincipalsComment(
        averageScore
      )}</em></p>
      <p><strong>Teacher's Comment:</strong> <em>${formattedComments}</em></p>
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
          "Highest",
          "Total",
          "Lowest",
          "Grade",
          "Remarks",
        ],
        ...scores.map((score) => [
          score.subject,
          score.score.firstTest,
          score.score.secondTest,
          score.score.project,
          score.score.bnb,
          score.score.assignment,
          score.score.exam,
          score.highestTotalScore,
          score.score.total,
          score.lowestTotalScore,
          score.score.grade,
          getRemarks(score.score.total),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `IGCA_Result checked by ${user.name} ${generateUniqueId()}.csv`
    );
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
        // backgroundColor: "white", // Add a background color if needed
      });

      // Use FileSaver to save the image
      saveAs(
        image,
        `IGCA_Result_checked_by_${user.name}_${generateUniqueId()}.png`
      );
    } catch (error) {
      console.error("Failed to download as image:", error);
    }
  };

  const handleSelectionToggle = () => {
    setSelectedStudent(false);
     setDeselected(false);
    setDeselected(true);
  };
  if (deselect) {
    return <AllResults />;
  } else {
    return (
      <div
        id="results-section"
        className="p-12 bg-gray-100 dark:bg-neutral-900 rounded-[25px] border-neutral-200 dark:border-neutral-700 "
      >
        <div>
          <div>
            <button
              onClick={handleSelectionToggle}
              className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
            >
              Clear Selection
            </button>
          </div>
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
          <div className="flex flex-col space-y-4 text-start">
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
              <table className="min-w-full px-8 py-3 border-collapse table-auto">
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
                      "Highest",
                      "Total",
                      "Lowest",
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
                        score.highestTotalScore,
                        score.score.total,
                        score.lowestTotalScore,
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
                <div className="text-base text-neutral-800 dark:text-neutral-200 flex flex-col  justify-between items-center gap-2 sm:gap-4">
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
                    <span className="italic">{formattedComments}</span>
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
                  Print copy
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
                  Export to CSV
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
  }
};

export default PostDetails;
