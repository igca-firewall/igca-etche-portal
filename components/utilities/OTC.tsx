"use client"
import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { Input } from "../ui/input";
import { addresults } from "@/lib/actions/results.actions";
import Select from "./CustomSelect";
const ImageToScoreProcessor: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isFailure, setIsFailure] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>("");
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setImageUrl(URL.createObjectURL(file));
      setResults([]);
      setError(null);
    }
  };

  const parseTextToScores = (text: string): any[] => {
    const rows = text.split("\n").filter((line) => line.trim() !== "");
    return rows.map((row) => {
      const [studentId, studentName, ...grades] = row.split(/\s+/);
      return {
        studentId: studentId || "Unknown",
        studentName: studentName || "Unknown",
        grades: grades.map((grade) => parseInt(grade) || 0),
      };
    });
  };

  const calculateGrade = (sum: number): string => {
    if (sum >= 80) return "A1";
    if (sum >= 75) return "B2";
    if (sum >= 70) return "B3";
    if (sum >= 65) return "C4";
    if (sum >= 60) return "C5";
    if (sum >= 50) return "C6";
    if (sum >= 45) return "D7";
    if (sum >= 40) return "E8";
    return "F9";
  };

  const handleExtractAndProcess = async () => {
    if (!imageUrl) {
      setError("Please upload an image first!");
      return;
    }

    setIsProcessing(true);
    setIsSuccess(false);
    setIsFailure(false);
    setError(null);

    try {
      console.log("Starting OCR process...");
      const result = await Tesseract.recognize(imageUrl, "eng");
      const rawText = result.data.text.trim();
      console.log("Raw OCR result:", rawText);

      const parsedResults = parseTextToScores(rawText);
      console.log("Parsed results:", parsedResults);

      const processedScores = parsedResults.map((result) => {
        const [firstTest, secondTest, project, bnb, assignment, exam] =
          result.grades;

        const grades = [
          firstTest || 0,
          secondTest || 0,
          project || 0,
          bnb || 0,
          assignment || 0,
          exam || 0,
        ];

        const totalScore = grades.reduce((sum, grade) => sum + grade, 0);
        const grade = calculateGrade(totalScore);

        return {
          studentId: result.studentId,
          studentName: result.studentName,
        
          firstTest: grades[0],
          secondTest: grades[1],
          project: grades[2],
          bnb: grades[3],
          assignment: grades[4],
          exam: grades[5],
          total: totalScore,
          grade,
        };
      });

      const uploadData = {
        classRoom: "",
        session: " 2024/2025",
        term: "1st Term",
        subject,
        scores: processedScores, // Transformed scores array
      };
      console.log(uploadData, "UploadedData")
      const uploadResponse = await addresults(uploadData);

      if (uploadResponse) {
        setIsSuccess(true);
        console.log("All results uploaded successfully.");
      }
    } catch (err) {
      console.error("Error during OCR or processing:", err);
      setError("Failed to process the image. Please try again.");
      setIsFailure(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">Image to Score Processor</h1>

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
      {/* Image Upload */}
      <div>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full p-2 border rounded"
        />
      </div>

      {/* Uploaded Image Preview */}
      {imageUrl && (
        <div className="border p-2">
          <p className="text-gray-700">Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded preview" className="w-full" />
        </div>
      )}

      {/* Extract and Process Button */}
      <button
        className={`px-4 py-2 rounded ${
          isProcessing ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
        onClick={handleExtractAndProcess}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Extract & Process Scores"}
      </button>

      {/* Processed Results */}
      {isSuccess && results.length > 0 && (
        <div className="border p-4 bg-gray-100">
          <p className="text-gray-700 font-bold">Processed Scores:</p>
          <table className="w-full table-auto border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border px-2 py-1">Student ID</th>
                <th className="border px-2 py-1">Student Name</th>
                <th className="border px-2 py-1">First Test</th>
                <th className="border px-2 py-1">Second Test</th>
                <th className="border px-2 py-1">Project</th>
                <th className="border px-2 py-1">BNB</th>
                <th className="border px-2 py-1">Assignment</th>
                <th className="border px-2 py-1">Exam</th>
                <th className="border px-2 py-1">Total</th>
                <th className="border px-2 py-1">Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{result.studentId}</td>
                  <td className="border px-2 py-1">{result.studentName}</td>
                  <td className="border px-2 py-1">{result.firstTest}</td>
                  <td className="border px-2 py-1">{result.secondTest}</td>
                  <td className="border px-2 py-1">{result.project}</td>
                  <td className="border px-2 py-1">{result.bnb}</td>
                  <td className="border px-2 py-1">{result.assignment}</td>
                  <td className="border px-2 py-1">{result.exam}</td>
                  <td className="border px-2 py-1">{result.total}</td>
                  <td className="border px-2 py-1">{result.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Error Message */}
      {isFailure && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default ImageToScoreProcessor;
