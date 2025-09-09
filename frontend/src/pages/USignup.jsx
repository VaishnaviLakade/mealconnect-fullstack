import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReceiverSignup() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    phone: "",
    location: "",
    urgency: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", formData); // Debugging line
    const API_URL =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

    try {
      const response = await fetch(`${API_URL}/api/receivers/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("Response Status:", response.status); // Debugging line
      const data = await response.json();
      console.log("Response Data:", data); // Debugging line

      if (response.ok) {
        alert("Signup successful!");
        navigate("/receiver-dashboard");
      } else {
        alert(data.message || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center text-blue-600">
        Receiver Signup
      </h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
          required
        />
        <select
          name="urgency"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
          required
        >
          <option value="">Select Urgency</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
