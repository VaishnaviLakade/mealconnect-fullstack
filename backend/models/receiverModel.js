import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence"; // Auto-increment plugin

const AutoIncrement = mongooseSequence(mongoose);
const receiverSchema = new mongoose.Schema({
    id:{type:Number,unique:true},
    name: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
  
});
receiverSchema.plugin(AutoIncrement, { inc_field: "id" });

const Receiver = mongoose.model("Receiver", receiverSchema);
export default Receiver;
