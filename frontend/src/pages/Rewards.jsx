import React from "react";

const Rewards = () => {
  const dummyLeaderboard = [
    { name: "John Doe", points: 120 },
    { name: "Jane Smith", points: 100 },
    { name: "Alex Johnson", points: 90 },
    { name: "Emily Davis", points: 80 },
    { name: "Michael Brown", points: 70 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Rewards System</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center border border-gray-200">
        <p className="text-xl font-semibold text-indigo-700">1 Donation = X Points</p>
      </div>
      
      <h3 className="text-2xl font-semibold mt-8 text-gray-800 text-center">Leaderboard</h3>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-4 border border-gray-200">
        <ul className="text-gray-700">
          {dummyLeaderboard.map((user, index) => (
            <li
              key={index}
              className="py-3 border-b last:border-b-0 flex justify-between text-lg font-medium"
            >
              <span className="text-indigo-700">{user.name}</span>
              <span className="font-semibold text-indigo-600">{user.points} pts</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Rewards;