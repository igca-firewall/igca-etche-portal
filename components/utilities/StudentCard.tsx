import React from "react";

interface ResultCardProps {
  studentName: string;
  studentId: string;
  
  grades: { 
    term: string;
    subjects: { [subject: string]: number };
    grade: string;
    sum: number;
  }[];
  classRoom: string;
  additionalInfo: {
    age?: number;
    parentContact?: string;
    address?: string;
  };
}

const ResultCard: React.FC<ResultCardProps> = ({
  studentName,
  studentId,
  grades,
  classRoom,
  additionalInfo,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{studentName}</h2>
        <p className="text-sm text-gray-600">ID: {studentId}</p>
        <p className="text-sm text-gray-600">Class: {classRoom}</p>
      </div>

      {additionalInfo && (
        <div className="mb-4">
          {additionalInfo.age && (
            <p className="text-sm text-gray-600">Age: {additionalInfo.age}</p>
          )}
          {additionalInfo.parentContact && (
            <p className="text-sm text-gray-600">
              Parent Contact: {additionalInfo.parentContact}
            </p>
          )}
          {additionalInfo.address && (
            <p className="text-sm text-gray-600">Address: {additionalInfo.address}</p>
          )}
        </div>
      )}

      <div className="mb-6">
        {grades.map((gradeDocument, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              Term: {gradeDocument.term} | Grade: {gradeDocument.grade}
            </h3>

            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Subject</th>
                  {Object.keys(gradeDocument.subjects).map((subject) => (
                    <th key={subject} className="border border-gray-300 p-2 text-center">
                      {subject}
                    </th>
                  ))}
                  <th className="border border-gray-300 p-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">Scores</td>
                  {Object.values(gradeDocument.subjects).map((score, index) => (
                    <td key={index} className="border border-gray-300 p-2 text-center">
                      {score}
                    </td>
                  ))}
                  <td className="border border-gray-300 p-2 text-center">{gradeDocument.sum}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultCard;
