import express from "express";
import { adminRequired, authRequired } from "../middleware/auth.js";
import Donation from "../models/Donation.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const router = express.Router();

router.use(authRequired, adminRequired);

router.get("/users", async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select("-password");
  res.json({
    users: users.map((u) => ({
      id: u._id,
      email: u.email,
      fullName: u.fullName,
      phone: u.phone,
      isAdmin: u.isAdmin,
    })),
  });
});

router.patch("/users/:id/toggle-admin", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isAdmin = !user.isAdmin;
  await user.save();
  res.json({ user });
});

router.get("/products", async (_req, res) => {
  const products = await Product.find().populate("seller", "fullName email").sort({ createdAt: -1 });
  res.json({ products });
});

router.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

router.get("/donations", async (_req, res) => {
  const donations = await Donation.find()
    .populate("product", "title category price")
    .sort({ createdAt: -1 });
  res.json({ donations });
});

export default router;
