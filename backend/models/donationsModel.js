import mongoose, { Schema } from "mongoose";
import mongooseSequence from "mongoose-sequence"; // Auto-increment plugin


const AutoIncrement = mongooseSequence(mongoose);

const donationSchema = new Schema(
  {
    donation_id: { type: Number, unique: true },
    donor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true }, 
    donor_name: { type: String, required: true }, // Donor's name
    donor_email: { type: String, required: true }, // Donor's email
    food_category: { type: String, enum: ["Grains", "Vegetables", "Dairy","Cooked Meals","Beverages","Snacks"], required: true }, // Type of donation
    food_description:{type:String,required:true},
    address:{type:String,required:true},
    people_served: { type: Number, required: true }, // Amount of donation
    status: { type: String, enum: ["Pending", "Active", "Revoked","Complete"], default: "Pending" }, // Status of donation
    expiry_date: { type: Date, default: Date.now }, // Timestamp of donation
    collection_start:{  type: Date, default: Date.now },
    collection_end: { type: Date, default: Date.now },
    receivers: [{ type: Number, ref: "Receiver" }], // Storing Receiver IDs  },
  
});

// Apply auto-increment to `donation_id`
donationSchema.plugin(AutoIncrement, { inc_field: "donation_id" });

const Donations = mongoose.model("Donations", donationSchema);
export default Donations;
