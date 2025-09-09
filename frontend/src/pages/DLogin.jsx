import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storeToken, storeDonorId, storeEmail } from "../utils/auth";

export default function DLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    const API_URL = process.env.VITE_BACKEND_URL || "http://localhost:3000";

    try {
      console.log("Backend URL:", process.env.VITE_BACKEND_URL);

      const response = await fetch(`${API_URL}/api/donors/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        storeToken(data.token);
        storeDonorId(data.donorId);
        storeEmail(email); // store email in localStorage
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#F4E6FF] to-[#A18CE7] px-4">
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-[#93c5fd] w-full max-w-md transition-all duration-300">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#4f46e5] to-[#9333ea] text-transparent bg-clip-text mb-6">
          Donor Login
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[93%] mt-2 px-4 py-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5] transition-all"
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[93%] mt-2 px-4 py-3 border border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5] transition-all"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-[#4f46e5] to-[#9333ea] text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-600 mt-5">
          Don't have an account?{" "}
          <a
            href="/donor-signup"
            className="text-[#4f46e5] font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
