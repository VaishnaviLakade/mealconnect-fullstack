import cron from "node-cron";
import mongoose from "mongoose";
import Donation from "../models/donationsModel.js";
import Donor from "../models/donerModel.js";
import Receiver from "../models/receiverModel.js";
//import { processReceivers } from "../utils/receiverProcessor.js"; // Import function to handle receivers
import axios from "axios";

// Function to check and update status, then send notifications
const updateDonationStatus = async () => {
    if (mongoose.connection.readyState !== 1) {
        console.log("Database not connected. Skipping status update.");
        return;
    }

    const currentTime = new Date();

    try {
        // Activate donations where collection_start has passed
        const activatedDonations = await Donation.find({
            status: "Pending",
            collection_start: { $lte: currentTime },
        });

        for (const donation of activatedDonations) {
            await Donation.findByIdAndUpdate(donation._id, { status: "Active" });

            // Notify receivers only if not already notified
            await notifyReceivers(donation);
        }

        if (activatedDonations.length > 0) {
            console.log(`Updated ${activatedDonations.length} donations to Active.`);
        }

        // Complete donations where collection_end has passed
        const completedDonations = await Donation.updateMany(
            { status: "Active", collection_end: { $lte: currentTime } },
            { $set: { status: "Completed" } }
        );

        if (completedDonations.modifiedCount > 0) {
            console.log(`Updated ${completedDonations.modifiedCount} donations to Completed.`);
        }
    } catch (error) {
        console.error("Error updating donation statuses:", error);
    }
};

// Function to process and send donation_id along with receivers
const notifyReceivers = async (donation) => {
    try {
        const donor = await Donor.findById(donation.donor_id);

        if (!donor || !donor.receivers || donor.receivers.length === 0) {
            console.log(`No receivers found for donor ID: ${donation.donor_id}`);
            return;
        }

        // Fetch receiver details from their IDs
        const receivers = await Receiver.find({ id: { $in: donor.receivers } });

        if (receivers.length === 0) {
            console.log(`No valid receivers for donation ID: ${donation._id}`);
            return;
        }

        for (const receiver of receivers) {
            if (receiver.phone) {
                // 🔹 Send request to Twilio server webhook
                await axios.post("http://localhost:3005/send-message", {
                    phone: receiver.phone,
                    address: donation.address,
                    people_served: donation.people_served,
                    collectionStart: donation.collection_start,
                    collectionEnd:donation.collection_end
                });

                console.log(`📩 Request sent for receiver ${receiver.phone}`);
            }
        }


        // Send donation_id and receivers to another file for processing
      //  await processReceivers(donation._id, receivers);

        console.log(`Processed receivers for donation ID: ${donation._id}`);
        console.log(receivers)
    } catch (error) {
        console.error("Error processing receivers:", error);
    }
};

// Run every minute to update statuses and send notifications
cron.schedule("* * * * *", updateDonationStatus);

console.log("Cron job started: Checking donations and processing receivers.");
