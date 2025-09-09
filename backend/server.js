import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import donerRoutes from "./routes/donerRoutes.js";
import receiverRoutes from "./routes/receiverRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"; // Ensure this file exists
import mongoose from "mongoose";
import donationRoutes from "./routes/donationRoutes.js";
import "./services/cronJobs.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
//import sender from "./twilio/sender.js"

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mealconnect-frontend-njel.vercel.app/",
    ],
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "MealConnect", // Ensure this is the correct database name
  })
  .then(async () => {
    console.log("MongoDB Connected");

    // Add a test query to check if the database is accessible
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Available Collections:",
      collections.map((c) => c.name)
    );

    console.log("Database is connected, proceeding with status update...");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });
// Separate authentication routes for donors and users
app.use("/api/donors", donerRoutes);
app.use("/api/receivers", receiverRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/analytics", analyticsRoutes);
//app.use("/api/user", uAuthRoutes);
app.use("/api", chatRoutes); // Ensure this is defined
//app.use("/api/sms",sender)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
