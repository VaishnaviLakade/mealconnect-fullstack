import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence"; // Import mongoose-sequence for auto-increment

const AutoIncrement = mongooseSequence(mongoose);

const donorSchema = new mongoose.Schema({
  donor_id: { type: Number, unique: true }, // Auto-incremented ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  password: { type: String, required: true },
  donation_history:{type: [mongoose.Schema.Types.ObjectId], ref: "Donation", default: []},
  score:{type:Number},
  receivers: [{ type: Number, ref: "Receiver" }], // Storing Receiver IDs  },


});

// Apply auto-increment plugin to donor_id
donorSchema.plugin(AutoIncrement, { inc_field: "donor_id" });

const Donor = mongoose.model("Donor", donorSchema);
export default Donor;
