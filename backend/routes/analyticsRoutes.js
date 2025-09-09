import express from "express";
import Donations from "../models/donationsModel.js"; // Assuming you have your Donation model exported like this
import mongoose from "mongoose";
import { startOfMonth, endOfMonth, format } from "date-fns"; // date-fns for handling dates

const router = express.Router();

// Route to fetch donation analytics
router.get("/donations", async (req, res) => {
  try {
    const donorId = req.query.donorId;

    // Calculate Successful and Failed donations
    const completedDonations = await Donations.aggregate([
      {
        $match: {
          status: "Complete",
          donor_id: mongoose.Types.ObjectId(donorId),
        },
      },
      {
        $group: {
          _id: null,
          successful: {
            $sum: { $cond: [{ $eq: ["$status", "Complete"] }, 1, 0] },
          },
          failed: {
            $sum: { $cond: [{ $ne: ["$status", "Complete"] }, 1, 0] },
          },
        },
      },
    ]);

    // Calculate Top Donated Categories
    const categoryData = await Donations.aggregate([
      {
        $match: {
          status: "Complete",
          donor_id: mongoose.Types.ObjectId(donorId),
        },
      },
      {
        $group: {
          _id: "$food_category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Total Donations Over Time (Month-wise)
    const monthData = await Donations.aggregate([
      {
        $match: {
          status: "Complete",
          donor_id: mongoose.Types.ObjectId(donorId),
        },
      },
      {
        $group: {
          _id: { $month: "$collection_start" },
          totalDonations: { $sum: "$people_served" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Prepare monthly labels for the Line chart
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const donationsPerMonth = new Array(12).fill(0);
    monthData.forEach((month) => {
      donationsPerMonth[month._id - 1] = month.totalDonations;
    });

    // Prepare the response data for charts
    res.json({
      pieData: {
        labels: ["Successful", "Failed"],
        datasets: [
          {
            data: [
              completedDonations[0]?.successful || 0,
              completedDonations[0]?.failed || 0,
            ],
            backgroundColor: ["#4CAF50", "#FF5252"],
          },
        ],
      },
      barData: {
        labels: categoryData.map((item) => item._id),
        datasets: [
          {
            label: "Top Donated Categories",
            data: categoryData.map((item) => item.count),
            backgroundColor: "#7E57C2",
          },
        ],
      },
      lineData: {
        labels: months,
        datasets: [
          {
            label: "Total Donations Over Time",
            data: donationsPerMonth,
            borderColor: "#FFA000",
            fill: false,
          },
        ],
      },
    });
  } catch (error) {
    console.error("Error fetching donation analytics:", error);
    res.status(500).send("Error fetching donation analytics");
  }
});

export default router;
