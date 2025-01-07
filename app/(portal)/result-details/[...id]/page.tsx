"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import Image from "next/image";

import { decrypt, decryptKey, multiFormatDateString } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getStudentResults, myArray } from "@/lib/actions/results.actions";

const PostDetails = (term: string, classRoom: string) => {
  const { user } = useUserContext();
  const [localUserData, setLocalUserData] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  useEffect(() => {
    const storedData = localStorage.getItem("Trash");
    if (storedData) {
      const decryptedData = decryptKey(storedData);
      const parsedData = JSON.parse(decryptedData);
      setLocalUserData(parsedData);
    }
  }, []);

  const { id } = useParams(); // ID of the post being viewed
  const singleId = Array.isArray(id) ? id[0] : id;
  const decryptedString = decrypt(singleId!);
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await myArray({
          studentId: decryptedString,
          session: " 2024/2025",
          term: "1st Term",
          classRoom: "SS3A",
        });
        console.log(response, decryptedString);
        setScores(response || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  });
  return (
    <div className="overflow-x-auto">
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Subject</th>
          <th className="px-4 py-2 border">First Test</th>
          <th className="px-4 py-2 border">Second Test</th>
          <th className="px-4 py-2 border">Project</th>
          <th className="px-4 py-2 border">BNB</th>
          <th className="px-4 py-2 border">Assignment</th>
          <th className="px-4 py-2 border">Exam</th>
          <th className="px-4 py-2 border">Total</th>
          <th className="px-4 py-2 border">Grade</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((score, index) => (
          <tr key={index}>
            <td className="px-4 py-2 border">{score.subject}</td>
            <td className="px-4 py-2 border">{score.score.firstTest}</td>
            <td className="px-4 py-2 border">{score.score.secondTest}</td>
            <td className="px-4 py-2 border">{score.score.project}</td>
            <td className="px-4 py-2 border">{score.score.bnb}</td>
            <td className="px-4 py-2 border">{score.score.assignment}</td>
            <td className="px-4 py-2 border">{score.score.exam}</td>
            <td className="px-4 py-2 border">{score.score.total}</td>
            <td className="px-4 py-2 border">{score.score.grade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default PostDetails;
