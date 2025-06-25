"use client";
import { Input } from "@/components/ui/input";
import Select from "@/components/utilities/CustomSelect";
import { useUserContext } from "@/context/AuthContext";
import { getS } from "@/lib/actions/studentsData.actions";
import { Models } from "appwrite";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ScratchCardOTP from "./GetCard";
import { classOrder, formatSubject, getYearRanges, termOptions } from "@/lib/utils";
import { FaSearch } from "react-icons/fa";
import PostDetails from "@/app/(portal)/result-details/page";
import { fetchCummulation, myArray } from "@/lib/actions/results.actions";
import RankedStudentResults from "./Master";
import { PrinterIcon } from "lucide-react";
import { fetchComments } from "@/lib/actions/comment.actions";

const AllResults = () => {
  const { user } = useUserContext();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [classRoom, setClassRoom] = useState<string>("");
  const [term, setTerm] = useState<string>("");
  const [session, setSession] = useState<string>(""); // State for Term
  const [isProcessing, setIsProcessing] = useState(false);
  const [averages, setAverages] = useState<StudentAverages[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [xed, setXed] = useState(false);
  const [view, setView] = useState<{
    studentName: string;
    Namer: string;
    term: string;
    classRoom: string;
    studentId: string;
  } | null>(null);
  const [isFish, setIsFish] = useState<{
    studentName: string;
    Namer: string;
    term: string;
    classRoom: string;
    studentId: string;
  } | null>(null);

  const fetchStudents = async () => {
    try {
      setIsFailure(false);
      setXed(false);
      setIsLoading(true);
      setIsSuccess(false);
      setAverages([]);

      const xed: Models.Document[] = await getS({
        classRoom,

        session: session,
      });

      if (xed) {
        const transformedStudents = xed.map((student) => ({
          $id: student.$id,
          name: student.name,
          dateOfBirth: student.dateOfBirth,
          studentId: student.studentId,
          image: student.image,

          createdAt: student.$createdAt,
        }));
        setStudents(transformedStudents);
  
        if (transformedStudents.length === 0) {
          setIsFailure(true);
        }
      }
    } catch (error) {
      setIsFailure(true);
      console.error("Error fetching students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //   const fetchStudentsScore = async () => {
  //     try {
  //       setIsLoading(true);
  //       setScores([]);

  //       const particles = await fetchComments({
  //         classRoom,
  //         term,
  //         session,

  //       });
  //       console.log("particles", particles);
  //       if (particles?.length) {
  //         const transformedScores = particles.flatMap((result) => {
  //           return result.scores.map((scoreString: string) => {
  //             const score = JSON.parse(scoreString); // Parse the JSON string into an object
  //             return {
  //               studentId: score.studentId,
  //               studentName: score.studentName,
  //               firstTest: score.firstTest,
  //               secondTest: score.secondTest,
  //               bnb: score.bnb,
  //               project: score.project,
  //               assignment: score.assignment,
  //               exam: score.exam,
  //               total: score.total,
  //               grade: score.grade,
  //             };
  //           });
  //         });

  //         setScores(transformedScores);
  //         console.log("Transformed Scores:", transformedScores);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching student scores:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (classRoom && subject && session && term) {
  //     fetchStudentsScore();
  //   }
  // }, [classRoom,  session, term]);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsFailure(false);
        setXed(false);
        setIsLoading(true);
        setIsSuccess(false);
        setAverages([]);

        const xed: Models.Document[] = await getS({
          classRoom,

          session: session,
        });

        if (xed) {
          const transformedStudents = xed.map((student) => ({
            $id: student.$id,
            name: student.name,
            dateOfBirth: student.dateOfBirth,
            studentId: student.studentId,
            image: student.image,

            createdAt: student.$createdAt,
          }));
          setStudents(transformedStudents);
       
          if (transformedStudents.length === 0) {
            setIsFailure(true);
          }
        }
      } catch (error) {
        setIsFailure(true);
        console.log("Error fetching Student:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (term && session && classRoom) {
      fetchStudents();
    }
  }, [term, session, classRoom]);
  // Checking the admin rights from localStorage based on the student's name
  const loadAverage = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    setAverages([]);

    try {
      const cummulativeResult = await fetchCummulation({
        classRoom: classRoom,
        session: session,
        term: term,
      });
      if (cummulativeResult) {
        setAverages(cummulativeResult);
        setIsSuccess(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (searchQuery.trim() === "" || searchQuery !== user.adminId) {
      setIsSuccess(false);
      setAverages([]); // Clear the loaded data if search query is empty
      return;
    }

    if (
      searchQuery === user.adminId &&
      user.role === "admin" &&
      session &&
      term &&
      classRoom
    ) {
      setIsSuccess(false);
      setAverages([]); // Reset before fetching new data
      loadAverage();
    }
  }, [searchQuery, user.adminId, user.role, session, term, classRoom]);

  // Handle the "Check Result" button click
  const handleCheckResult = (
    studentName: string,
    Namer: string,
    term: string,
    studentId: string
  ) => {
    const uniqueKey = studentName;
    setXed(true);
    // Retrieve admin rights from localStorage
    const storedAdminRights = localStorage.getItem(uniqueKey);

    if (storedAdminRights || user.role === "admin") {
      console.log("Admin rights retrieved");
      const fishData = {
        studentName,
        Namer,
        term,
        classRoom: classRoom,
        studentId,
      };
      setView(fishData);
    } else if (user.role !== "admin" && !storedAdminRights && term) {
      console.log("Not an admin or has no admin rights assigned");
      const fishData = {
        studentName,
        Namer,
        term,
        classRoom: classRoom,
        studentId,
      };
      setIsFish(fishData);
      setXed(false);
    }
  };
  const [scores, setScores] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
  const [studentId, setStudentId] = useState("")
  const [comments, setComments] = useState<Comment | null>(null);
  const [selectedStudent, setSelectedStudent] = useState(false);
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
  const dost = () => {
  
  }
  if (isFish) {
    return (
      <div>
        <div className="bg-white border border-gray-200 dark:border-neutral-700 shadow-lg rounded-2xl font-nunito dark:bg-neutral-800 p-6 flex flex-col items-center">
          <ScratchCardOTP
            name={isFish.Namer}
            classRoom={isFish.classRoom}
            term={isFish.term}
            studentId={isFish.studentId}
            session={` ${session}`}
          />
        </div>
      </div>
    );
  }
  if (view) {
    return (
      <div>
        <div className="bg-white border border-gray-200 dark:border-neutral-700 shadow-lg rounded-2xl font-nunito dark:bg-neutral-800 p-6 flex flex-col items-center">
          <PostDetails
            classRoom={classRoom}
            term={term}
            studentId={view.studentId}
            session={` ${session}`}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-start bg-gray-50 dark:bg-neutral-900 p-8 rounded-[25px] border border-neutral-200 dark:border-neutral-800">
      <h1 className="text-18 font-nunito font-semibold">Check Results</h1>

      <div className="flex flex-wrap justify-between items-center gap-5 w-full mb-8">
        <div className="mb-5 w-full sm:w-1/3">
          <label
            htmlFor="term"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
          >
            Select Term
          </label>
          <Select
            options={termOptions}
            value={term}
            onChange={(value) => setTerm(value)}
            placeholder="Choose a Term"
            className="w-full border-2 border-gray-300 dark:border-neutral-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="mb-5 w-full sm:w-1/3">
          <label
            htmlFor="session"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
          >
            Select Session
          </label>
          <Select
            options={[
              ...getYearRanges(2024).map((range) => ({
                value: `${range}`,
                label: `${range}`,
              })),
            ]}
            value={session}
            onChange={(value) => setSession(value)}
            placeholder="Choose a Session"
            className="w-full border-2 border-gray-300 dark:border-neutral-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
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
        <div className="mb-5 w-full sm:w-1/3 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            type={`${searchQuery !== user.adminId ? "text" : "password"}`}
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 dark:bg-neutral-700 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-center">
          {!term && session
            ? "Please select a term 👆"
            : !session && term
            ? "Please select a session 👆"
            : !classRoom && term
            ? "Please select a class 👆"
            : !term && !session
            ? "Please Utilize the selections above."
            : "Loading..."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {students
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((student) =>
              student.name.toLowerCase().includes(searchQuery.toLowerCase())
            ) // Alphabetically sort by name
            .map((student) => (
              <div
                key={student.$id}
                className="relative bg-white border hover:scale-110 transition-all transform duration-800 hover:bg-neutral-300 hover:dark:bg-neutral-700 border-gray-200 dark:border-neutral-700 shadow-lg rounded-2xl font-nunito dark:bg-neutral-800 p-6 flex flex-col items-center"
              >
                {/* Print Icon */}
                {user.role === "admin" && (
                  <div
                    className="absolute top-4 right-4 cursor-pointer p-2 rounded-full bg-gray-100 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 transition"
                    onClick={() =>  setStudentId(student.studentId)}
                  >
                    <PrinterIcon
                      onClick={()=>printPage()}
                      className="w-5 h-5 text-gray-600 dark:text-gray-300"
                    />
                  </div>
                )}

                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 shadow-md">
                  <Image
                    src={student.image || "/images/th.jpg"}
                    alt={student.name}
                    className="object-cover"
                    width={112}
                    height={112}
                  />
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-5">
                  {student.name}
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 mt-2">
                  {classRoom}
                  <span className="mx-2 text-gray-500 dark:text-gray-600">
                    &#8226;
                  </span>
                  {student.studentId}
                </p>

                <Button
                  className={`px-8 ${
                    xed && "bg-gray-300 animate-bounce"
                  } py-8 mt-4 text-purple-800 dark:text-white border border-neutral-300 dark:border-purple-800 rounded-full bg-neutral-200 dark:bg-neutral-800 focus:outline-none`}
                  disabled={isProcessing || xed}
                  onClick={() =>
                    handleCheckResult(
                      `Particles granted you permission to: ${student.name}'s result for ${term}_${classRoom}`,
                      student.name,
                      term,
                      student.studentId
                    )
                  }
                >
                  {xed
                    ? "Analyzing"
                    : `Check ${
                        student.name === user.name
                          ? "Your"
                          : student.name + "'s"
                      } Result`}
                </Button>
              </div>
            ))}
        </div>
      )}
      {isFailure && (
        <div
          className="
          flex flex-col items-center gap-2 text-neutral-500 dark:text-red-200"
        >
          No student found, Please check your internet connection or provided
          credentials.{" "}
          <button
            className="px-6 py-2 bg-purple-500 text-white rounded-full "
            onClick={() => fetchStudents()}
          >
            Retry
          </button>
        </div>
      )}
      {isSuccess && (
        <div>
          <RankedStudentResults students={averages} />
        </div>
      )}
    </div>
  );
};

export default AllResults;
