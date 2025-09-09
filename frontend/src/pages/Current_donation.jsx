import React, { useEffect, useState } from "react";
import axios from "axios";

const CurrentDonations = () => {
  const [donations, setDonations] = useState([]);
  const [confirmedReceivers, setConfirmedReceivers] = useState([]);
  const [pendingReceivers, setPendingReceivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const API_URL =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

      try {
        const [donationsRes, confirmedRes, pendingRes] = await Promise.all([
          axios.get(`${API_URL}/api/donation/donations?status=Active`),
          axios.get(`${API_URL}/api/receivers`),
          axios.get(`${API_URL}/api/pending-receivers`),
        ]);

        setDonations(Array.isArray(donationsRes.data) ? donationsRes.data : []);
        setConfirmedReceivers(
          Array.isArray(confirmedRes.data) ? confirmedRes.data : []
        );
        setPendingReceivers(
          Array.isArray(pendingRes.data) ? pendingRes.data : []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">
        Active Donations
      </h2>

      {loading ? (
        <p className="text-center text-purple-500">Loading data...</p>
      ) : (
        <>
          {/* Donations Table */}
          {donations.length > 0 ? (
            <div className="overflow-x-auto mb-10">
              <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-purple-700 text-white">
                  <tr>
                    <th className="py-3 px-6 text-left">Donor</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Category</th>
                    <th className="py-3 px-6 text-left">Description</th>
                    <th className="py-3 px-6 text-left">Address</th>
                    <th className="py-3 px-6 text-left">People Served</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr
                      key={donation.donation_id}
                      className="border-b hover:bg-purple-100 transition"
                    >
                      <td className="py-3 px-6">{donation.donor_name}</td>
                      <td className="py-3 px-6 text-purple-700">
                        {donation.donor_email}
                      </td>
                      <td className="py-3 px-6">{donation.food_category}</td>
                      <td className="py-3 px-6 text-sm">
                        {donation.food_description}
                      </td>
                      <td className="py-3 px-6">{donation.address}</td>
                      <td className="py-3 px-6">{donation.people_served}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-purple-500">
              No active donations available.
            </p>
          )}

          {/* Receivers Table */}
          <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">
            Receiver Status
          </h2>

          {[...confirmedReceivers, ...pendingReceivers].length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    <th className="py-3 px-6 text-left">Receiver Name</th>
                    <th className="py-3 px-6 text-left">Phone</th>
                    <th className="py-3 px-6 text-left">Count</th>
                    <th className="py-3 px-6 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Confirmed */}
                  {confirmedReceivers.map((receiver) => (
                    <tr
                      key={receiver.receiver_id}
                      className="border-b bg-green-100 hover:bg-green-200 transition"
                    >
                      <td className="py-3 px-6">{receiver.name}</td>
                      <td className="py-3 px-6">{receiver.phone}</td>
                      <td className="py-3 px-6">{receiver.count}</td>
                      <td className="py-3 px-6 text-green-700 font-semibold">
                        ✅ Confirmed
                        <br />
                        <span className="text-sm text-green-600">
                          {new Date(receiver.confirmed_at).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {/* Pending */}
                  {pendingReceivers.map((receiver) => (
                    <tr
                      key={receiver.receiver_id}
                      className="border-b bg-red-100 hover:bg-red-200 transition"
                    >
                      <td className="py-3 px-6">{receiver.name}</td>
                      <td className="py-3 px-6">{receiver.phone}</td>
                      <td className="py-3 px-6">{receiver.pincode}</td>
                      <td className="py-3 px-6 text-red-700 font-semibold">
                        ⏳ Pending
                      </td>
                    </tr>
                  ))}

                  {/* Remaining Capacity row */}
                  {confirmedReceivers.length > 0 && (
                    <tr className="bg-yellow-100 font-semibold">
                      <td className="py-3 px-6" colSpan={2}></td>
                      <td className="py-3 px-6 text-purple-800">
                        Remaining: {confirmedReceivers[0].rem}
                      </td>
                      <td className="py-3 px-6"></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No receivers yet.</p>
          )}
        </>
      )}
    </div>
  );
};

export default CurrentDonations;
