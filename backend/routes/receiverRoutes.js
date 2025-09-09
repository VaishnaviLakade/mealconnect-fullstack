import express from "express";
import Receiver from "../models/receiverModel.js";
import Donor from "../models/donerModel.js"; // Import Donor model
import donorAuthMiddleware from "../middleware/donorAuthMiddleware.js";

const router = express.Router();

// Donor adds a receiver and links it to their profile
router.post("/add", donorAuthMiddleware, async (req, res) => {
  try {
    const { donorId, name, phone, pincode } = req.body; // Get donor ID from request
    if (!donorId || !name || !phone || !pincode) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find the existing donor
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }

    // Create a new receiver
    const newReceiver = new Receiver({ name, phone, pincode });
    await newReceiver.save();

    // Add the receiver ID to the donor's receivers array
    donor.receivers.push(newReceiver.id);
    await donor.save();

    res.status(201).json({
      message: "Receiver added successfully and linked to donor.",
      receiverId: newReceiver.id,
    });
  } catch (error) {
    console.error("Error in /add route:", error.message);
    res.status(500).json({ error: "Failed to add receiver." });
  }
});

export default router;
