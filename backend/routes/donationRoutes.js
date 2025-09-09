import express from "express";
import { createDonation,getDonations,updateDonationStatus,deleteDonation } from "../controllers/donationController.js";
import Donations from "../models/donationsModel.js";
import donorAuthMiddleware from "../middleware/donorAuthMiddleware.js";

const router = express.Router()

router.post("/create",donorAuthMiddleware, createDonation);
router.post("/get", getDonations);
router.post("/update",updateDonationStatus)
router.post("/delete",deleteDonation)
router.get("/donations", async (req, res) => {
    try {
      const { status } = req.query;
      const query = status ? { status } : {};
      console.log("Executing query:", query);
  
      const donations = await Donations.find(query);
      console.log("Donations Found:", donations);
      
      res.json(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
export default router;
