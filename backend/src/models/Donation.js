import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
