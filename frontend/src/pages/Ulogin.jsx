import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storeToken } from "../utils/auth";

export default function ULogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    const API_URL =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

    try {
      const response = await fetch(`${API_URL}/api/receivers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        storeToken(data.token);
        navigate("/user-request"); // Redirect to user dashboard
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          User Login
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a
            href="/user-signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
