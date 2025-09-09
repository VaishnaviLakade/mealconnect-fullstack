import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Donor from "../models/donerModel.js";
import { authmd } from "../middleware/authmd.js";
const router = express.Router();

// Donor Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, location, password } = req.body;

    // Check if donor exists
    const existingDonor = await Donor.findOne({ email });
    if (existingDonor)
      return res.status(400).json({ message: "Email already in use" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new donor
    const newDonor = new Donor({
      name,
      email,
      phone,
      location,
      password: hashedPassword,
    });
    await newDonor.save();

    res.status(201).json({ message: "Donor registered successfully!" });
  } catch (error) {
    console.error("Donor Signup Error:", error); // Logs full error in console
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Donor Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if donor exists
    const donor = await Donor.findOne({ email });
    if (!donor)
      return res.status(400).json({ message: "Invalid email or password" });

    // Validate password
    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT Token
    const token = jwt.sign({ donor_id: donor._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send both token and donor ID
    res.status(200).json({
      message: "Login successful!",
      token,
      donorId: donor._id, // Ensure donor ID is included
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get Donor Profile (Protected)
router.get("/profile/:donorId", async (req, res) => {
  const donorId = req.params.donorId; // Fetch the donorId from the URL params
  console.log(donorId);
  if (!donorId) {
    return res
      .status(400)
      .json({ message: "Bad Request: donorId is required" });
  }

  try {
    // Fetch donor from database using the donorId
    const donor = await Donor.findById(donorId).select("-password");

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.status(200).json(donor); // Send the donor details as the response
  } catch (error) {
    console.error("Error during donor lookup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get Donor Profile (Protected)

export default router;
