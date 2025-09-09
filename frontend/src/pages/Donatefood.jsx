import React, { useState, useEffect } from "react";
import { getToken } from "../utils/auth";

const DonateFood = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    donor_id: "",
    donor_name: "",
    donor_email: "",
    food_category: "",
    food_description: "",
    address: "",
    people_served: "",
    collection_start: "",
    collection_end: "",
    pickupOption: "pickup",
  });

  useEffect(() => {
    const fetchDonorDetails = async () => {
      const donorId = localStorage.getItem("donorId");
      if (!donorId) return;
      console.log(donorId);
      const API_URL =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/api/donors/profile/${donorId}`
        );

        if (!response.ok) throw new Error("Failed to fetch donor details");

        // continue with your response handling...

        const donor = await response.json();
        setFormData((prev) => ({
          ...prev,
          donor_id: donorId,
          donor_name: donor.name,
          donor_email: donor.email,
        }));
      } catch (error) {
        console.error("Error fetching donor details:", error);
        alert("Failed to load donor details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonorDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const updatedValue =
      type === "datetime-local" ? new Date(value).toISOString() : value;
    setFormData({ ...formData, [name]: updatedValue });
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const API_URL =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/donation/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Donation Submitted! Thank you for your generosity.");
      } else {
        alert("Error submitting donation. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-purple-700">
        Loading donor details...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-8 font-sans">
      <div className="md:col-span-2 bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-4xl font-extrabold text-purple-700 text-center mb-8">
          Donate Food
        </h2>

        {step === 1 && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Step 1: Food Details
            </h3>
            <p className="mb-4 text-lg">
              <strong>Your Name:</strong> {formData.donor_name}
              <br />
              <strong>Your Email:</strong> {formData.donor_email}
            </p>

            <label className="block text-lg font-medium text-gray-700 mb-1">
              Food Category:
            </label>
            <select
              name="food_category"
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              value={formData.food_category}
              required
            >
              <option value="">Select Category</option>
              <option value="Grains">Grains</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Dairy">Dairy</option>
              <option value="Cooked Meals">Cooked Meals</option>
              <option value="Beverages">Beverages</option>
              <option value="Snacks">Snacks</option>
            </select>

            <label className="block text-lg font-medium text-gray-700 mb-1">
              People Served:
            </label>
            <input
              type="number"
              name="people_served"
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              value={formData.people_served}
              required
            />

            <label className="block text-lg font-medium text-gray-700 mb-1">
              Food Description:
            </label>
            <textarea
              name="food_description"
              className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              value={formData.food_description}
              required
            />

            <button
              className="w-full bg-purple-700 text-white text-lg font-semibold py-3 rounded-lg hover:bg-purple-800 transition duration-300"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Step 2: Pickup Details
            </h3>

            <label className="block text-lg font-medium text-gray-700 mb-1">
              Enter Address:
            </label>
            <input
              type="text"
              name="address"
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              value={formData.address}
              required
            />

            <label className="block text-lg font-medium text-gray-700 mb-1">
              Collection Start Date:
            </label>
            <input
              type="datetime-local"
              name="collection_start"
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              required
            />

            <label className="block text-lg font-medium text-gray-700 mb-1">
              Collection End Date:
            </label>
            <input
              type="datetime-local"
              name="collection_end"
              className="w-full p-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              required
            />

            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="bg-purple-700 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-purple-800 transition duration-300"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Step 3: Confirm Your Details
            </h3>

            <div className="bg-gray-100 p-4 rounded-lg">
              <p>
                <strong>Your Name:</strong> {formData.donor_name}
              </p>
              <p>
                <strong>Your Email:</strong> {formData.donor_email}
              </p>
              <p>
                <strong>Food Category:</strong> {formData.food_category}
              </p>
              <p>
                <strong>Food Description:</strong> {formData.food_description}
              </p>
              <p>
                <strong>People Served:</strong> {formData.people_served}
              </p>
              <p>
                <strong>Pickup Address:</strong> {formData.address}
              </p>
              <p>
                <strong>Collection Start:</strong>{" "}
                {new Date(formData.collection_start).toLocaleString()}
              </p>
              <p>
                <strong>Collection End:</strong>{" "}
                {new Date(formData.collection_end).toLocaleString()}
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-500 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="bg-green-600 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300"
                onClick={handleSubmit}
              >
                Submit Donation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonateFood;
