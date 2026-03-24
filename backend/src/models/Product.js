import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    condition: {
      type: String,
      enum: ["new", "like-new", "good", "fair", "poor"],
      default: "good",
    },
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    status: { type: String, enum: ["available", "sold", "donated"], default: "available" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
