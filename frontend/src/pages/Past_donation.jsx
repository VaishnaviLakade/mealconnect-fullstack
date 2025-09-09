import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const PastDonations = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const API_URL =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

    const fetchCompletedDonations = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/donation/donations?status=Completed`
        );

        if (!response.ok)
          throw new Error("Failed to fetch completed donations");

        const data = await response.json();
        console.log(data.donor_id);

        const donorId = localStorage.getItem("donorId");
        const filteredDonations = data.filter(
          (donation) => donation.donor_id === donorId
        );

        setDonations(filteredDonations);
      } catch (error) {
        console.error("Error fetching completed donations:", error);
      }
    };

    fetchCompletedDonations();
  }, []);

  const pieData = {
    labels: ["Successful", "Failed"],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ["#4CAF50", "#FF5252"],
      },
    ],
  };

  const barData = {
    labels: ["Vegetables", "Fruits", "Grains", "Dairy", "Others"],
    datasets: [
      {
        label: "Top Donated Categories",
        data: [50, 40, 35, 30, 20],
        backgroundColor: "#7E57C2",
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Donations",
        data: [10, 20, 30, 50, 70, 90],
        borderColor: "#FFA000",
        fill: false,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans">
      <h1 className="text-4xl font-extrabold text-purple-700 text-center mb-8">
        Past Donations Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Success Rate
          </h2>
          <Pie data={pieData} />
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Top Donated Categories
          </h2>
          <Bar data={barData} />
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Total Donations Over Time
          </h2>
          <Line data={lineData} />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Completed Donations
      </h2>
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-6">
        <table className="min-w-full text-gray-800">
          <thead>
            <tr className="bg-purple-100">
              <th className="py-3 px-6 text-left">Donor</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Person Collected</th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.length > 0 ? (
              donations.map((donation) => (
                <tr
                  key={donation._id}
                  className="border-b hover:bg-purple-50 transition duration-200"
                >
                  <td className="py-3 px-6">{donation.donor_name}</td>
                  <td className="py-3 px-6">{donation.food_category}</td>
                  <td className="py-3 px-6">{donation.people_served}</td>
                  <td className="py-3 px-6 text-green-600 font-medium">
                    {donation.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-3 px-6 text-center text-gray-500">
                  No completed donations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PastDonations;
