import React, { useState } from 'react';

const RequestFood = () => {
  const [selectedFood, setSelectedFood] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [pickupTime, setPickupTime] = useState('');
  const [delivery, setDelivery] = useState(false);
  
  const handleSelectFood = (food) => {
    setSelectedFood([...selectedFood, food]);
  };

  const handleSubmit = () => {
    // Handle form submission logic
    alert('Request Submitted Successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Request Food</h2>
      
      {/* Step 1: Search & Filter Donations */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Step 1: Browse Available Food</h3>
        <input type="text" placeholder="Search by category, location..." className="w-full p-2 border rounded mt-2" />
      </div>
      
      {/* Step 2: Fill Request Form */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Step 2: Fill Request Form</h3>
        <select onChange={(e) => handleSelectFood(e.target.value)} className="w-full p-2 border rounded mt-2">
          <option value="">Select Food</option>
          <option value="Rice">Rice</option>
          <option value="Bread">Bread</option>
          <option value="Vegetables">Vegetables</option>
        </select>
        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full p-2 border rounded mt-2" placeholder="Quantity Needed" />
        <input type="datetime-local" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full p-2 border rounded mt-2" />
        <label className="flex items-center mt-2">
          <input type="checkbox" checked={delivery} onChange={() => setDelivery(!delivery)} className="mr-2" /> Request Delivery (If Available)
        </label>
      </div>
      
      {/* Step 3: Confirmation & Tracking */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Step 3: Confirmation & Tracking</h3>
        <p>Assigned Donor: John Doe</p>
        <p>Pickup Location: 123 Food Street</p>
        <button className="bg-blue-500 text-white p-2 rounded mt-4" onClick={handleSubmit}>Submit Request</button>
      </div>
    </div>
  );
};

export default RequestFood;
