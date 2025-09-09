import { useEffect, useState } from "react";

export default function AddReceiver() {
  const [receiverData, setReceiverData] = useState({
    name: "",
    phone: "",
    pincode: "",
  });

  const [token, setToken] = useState("");
  const [donorId, setDonorId] = useState(""); // Store donorId

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    console.log("Token Retrieved in useEffect:", storedToken); // Debugging

    if (storedToken) {
      setToken(storedToken);

      // Decode donorId if it's stored in localStorage
      const storedDonorId = localStorage.getItem("donorId");
      if (storedDonorId) {
        setDonorId(storedDonorId);
      } else {
        // Optionally decode from JWT if donorId is in the token
        try {
          const payload = JSON.parse(atob(storedToken.split(".")[1])); // Decode JWT payload
          setDonorId(payload.donorId);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  }, []);

  const handleChange = (e) => {
    setReceiverData({ ...receiverData, [e.target.name]: e.target.value });
  };

  const handleAddReceiver = async () => {
    console.log("Sending Token:", token); // Debugging
    console.log("Sending Donor ID:", donorId); // Debugging
    const API_URL =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

    try {
      const response = await fetch(`${API_URL}/api/receivers/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token
        },
        body: JSON.stringify({ ...receiverData, donorId }), // Include donorId
      });

      if (response.ok) {
        alert("Receiver added successfully!");
        setReceiverData({ name: "", phone: "", pincode: "" });
      } else {
        alert("Failed to add receiver.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-8 font-sans">
      <div className="md:col-span-2 bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-4xl font-extrabold text-purple-700 text-center mb-8">
          Add Receiver
        </h2>

        <label className="block text-lg font-medium text-gray-700 mb-1">
          Receiver Name:
        </label>
        <input
          type="text"
          name="name"
          placeholder="Receiver Name"
          value={receiverData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <label className="block text-lg font-medium text-gray-700 mb-1">
          Phone Number:
        </label>
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={receiverData.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <label className="block text-lg font-medium text-gray-700 mb-1">
          Pincode:
        </label>
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={receiverData.pincode}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button
          onClick={handleAddReceiver}
          className="w-full bg-purple-700 text-white px-4 py-3 rounded-lg text-lg font-semibold hover:bg-purple-800 transition duration-300"
        >
          Add Receiver
        </button>
      </div>
    </div>
  );
}
