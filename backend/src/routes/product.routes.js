import express from "express";
import { authRequired } from "../middleware/auth.js";
import Donation from "../models/Donation.js";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search = "", category = "All", condition = "All", sortBy = "newest" } = req.query;
    const filter = { isActive: true, status: "available" };
    if (category !== "All") filter.category = category;
    if (condition !== "All") filter.condition = condition;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy === "price-low") sort = { price: 1 };
    if (sortBy === "price-high") sort = { price: -1 };

    const products = await Product.find(filter)
      .populate("seller", "fullName email phone")
      .sort(sort);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch products" });
  }
});

router.post("/", authRequired, async (req, res) => {
  try {
    const product = await Product.create({
      seller: req.user._id,
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      condition: req.body.condition,
      category: req.body.category,
      imageUrl: req.body.imageUrl || "",
      status: "available",
      isActive: true,
    });

    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create product" });
  }
});

router.get("/me", authRequired, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .populate("seller", "fullName email phone")
      .sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch your products" });
  }
});

router.patch("/:id/status", authRequired, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!req.user.isAdmin && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    product.status = req.body.status;
    await product.save();
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update product" });
  }
});

router.delete("/:id", authRequired, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!req.user.isAdmin && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete product" });
  }
});

router.post("/:id/donate", authRequired, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only seller can donate this product" });
    }

    await Donation.create({
      product: product._id,
      donor: req.user._id,
      donorName: req.user.fullName,
      donorEmail: req.user.email,
      notes: req.body.notes || "",
    });

    product.status = "donated";
    await product.save();
    res.json({ message: "Product donated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to donate product" });
  }
});

export default router;
