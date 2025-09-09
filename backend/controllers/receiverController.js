import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Receiver from "../models/receiverModel.js";

const SECRET_KEY = process.env.JWT_SECRET;

// Receiver Signup
export const receiverSignup = async (req, res) => {
    try {
        console.log("Receiver Signup Request Received");

        const { username, name, phone, location, urgency, password } = req.body;

        // Check if receiver already exists
        let existingReceiver = await Receiver.findOne({ phone });
        if (existingReceiver) return res.status(400).json({ message: "Phone number already in use" });

        let existingUsername = await Receiver.findOne({ username });
        if (existingUsername) return res.status(400).json({ message: "Username already taken" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new receiver
        const newReceiver = new Receiver({ username, name, phone, location, urgency, password: hashedPassword });
        await newReceiver.save();

        res.status(201).json({ message: "Receiver registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error });
    }
};

// Receiver Login
export const receiverLogin = async (req, res) => {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    try {
        const { username, password } = req.body;
        console.log("Login attempt for:", username, password); // Debugging line

        // Find receiver by username
        const receiver = await Receiver.findOne({ username });
        if (!receiver) {
            console.log("Receiver not found");
            return res.status(400).json({ message: "Receiver not found" });
        }

        console.log("Found receiver:", receiver); // Debugging line

        // Compare password
        const isMatch = await bcrypt.compare(password, receiver.password);
        console.log("Password match result:", isMatch); // Debugging line

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ receiverId: receiver._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            message: "Login successful!",
            token,
            receiver: {
                id: receiver._id,
                username: receiver.username,
                location: receiver.location,
                urgency: receiver.urgency
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed", error });
    }
};
