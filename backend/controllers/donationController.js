import Donation from "../models/donationsModel.js";
import Donor from "../models/donerModel.js";
import { authmd } from "../middleware/authmd.js";
// @desc    Create a new donation
// @route   POST /api/donations
// @access  Public
export const createDonation = async (req, res) => {
  try {
    const {
      donor_name,
      donor_id,
      donor_email,
      food_category,
      food_description,
      address,
      people_served,
      collection_start,
      collection_end,
      pickupOption,
    } = req.body;

    const newDonation = new Donation({
      donor_name,
      donor_id,
      donor_email,
      food_category,
      food_description,
      address,
      people_served,
      collection_start,
      collection_end,
      pickupOption,
      status: "Pending", // Default status
    });

    await newDonation.save();
    const donorExists = await Donor.findOne({ email: donor_email });

    if (donorExists) {
      await Donor.findOneAndUpdate(
        { email: donor_email },
        { $push: { donation_history: newDonation._id } },
        { new: true }
      );
    }
    res.status(201).json({ message: "Donation successfully created", donation: newDonation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all donations
// @route   GET /api/donations
// @access  Public
export const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update donation status
// @route   PUT /api/donations/:id
// @access  Admin or Authorized Personnel
export const updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    donation.status = status;
    await donation.save();
    res.status(200).json({ message: "Donation status updated", donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a donation
// @route   DELETE /api/donations/:id
// @access  Admin
export const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByIdAndDelete(id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
