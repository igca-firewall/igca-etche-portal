import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { useUserContext } from "@/context/AuthContext";
import { listAllStudents } from "@/lib/actions/studentsData.actions";
import { ChartData } from 'chart.js'; // Import ChartData type
import { Button } from "./ui/button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface Student {
  id: string;
  name: string;
  dateOfBirth: string;
  classRoom: string;
  status: "created" | "notCreated";
}

interface ClassData {
  [classRoom: string]: number;
}

const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classData, setClassData] = useState<ClassData>({});
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const allStudents = await listAllStudents();
     
        setStudents(allStudents);

        const classCount: ClassData = allStudents.reduce((acc, student) => {
          acc[student.classRoom] = (acc[student.classRoom] || 0) + 1;
          return acc;
        }, {} as ClassData);

        setClassData(classCount);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  if (loading)
    return (
      <div className="text-center text-purple-700 font-bold">Loading...</div>
    );

  const barData = {
    labels: Object.keys(classData),
    datasets: [
      {
        label: "Students per Class",
        data: Object.values(classData),
        backgroundColor: "rgba(138, 43, 226, 0.2)",
        borderColor: "rgba(138, 43, 226, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["Created", "Not Created"],
    datasets: [
      {
        data: [
          students.filter((s) => s.status === "created").length,
          students.filter((s) => s.status !== "created").length,
        ],
        backgroundColor: ["#8a2be2", "#d8bfd8"],
      },
    ],
  };

  const lineData: ChartData<"line", number[], string> = {
    labels: students.map((s) => s.name),
    datasets: [
      {
        label: "Age Representation",
        data: students.map(
          (s) => new Date().getFullYear() - new Date(s.dateOfBirth).getFullYear()
        ),
        backgroundColor: "rgba(138, 43, 226, 0.2)", 
        borderColor: "#8a2be2", 
        borderWidth: 2, 
        tension: 0.4, 
        pointBackgroundColor: "#8a2be2", 
        pointBorderColor: "#fff", 
        pointBorderWidth: 2, 
        pointRadius: 5, 
        borderCapStyle: "round", 
        borderJoinStyle: "round", 
      },
    ],
  };

  return (
    <div className="p-6 space-y-8  min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className=" p-4 rounded-lg shadow-lg border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold text-purple-700">
            Total Students
          </h2>
          <p className="text-3xl font-bold text-purple-900">{students.length}</p>
        </div>
        <div className=" p-4 rounded-lg shadow-lg border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold text-purple-700">Classes</h2>
          <p className="text-3xl font-bold text-purple-900">
            {Object.keys(classData).length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Students Per Class
          </h2>
          <Bar data={barData} />
        </div>
        <div className=" p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Created Accounts
          </h2>
          <Pie data={pieData} />
        </div>
      </div>

      <div className=" p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">
          Age Distribution
        </h2>
        <Line data={lineData} />
      </div>
 
    </div>
  );
};

export default Dashboard;
