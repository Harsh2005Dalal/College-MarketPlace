import bcrypt from "bcryptjs";
import crypto from "crypto";
import express from "express";
import jwt from "jsonwebtoken";
import { authRequired } from "../middleware/auth.js";
import PasswordReset from "../models/PasswordReset.js";
import User from "../models/User.js";
import sendMail from "../utils/mail.js";

const router = express.Router();
const collegeDomain = "@iitrpr.ac.in";

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });


router.post("/signup", async (req, res) => {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    const { fullName, phone, password } = req.body;

    if (!email.endsWith(collegeDomain)) {
      return res.status(400).json({ message: "Only @iitrpr.ac.in email addresses are allowed" });
    }
    if (!password || String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Account already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      fullName,
      phone,
      password: hashedPassword,
    });

    const token = signToken(user._id.toString());

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    const { password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    const valid = await bcrypt.compare(String(password || ""), user.password);
    if (!valid) return res.status(400).json({ message: "Invalid email or password" });

    const token = signToken(user._id.toString());
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Login failed" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "If your email exists, reset link has been sent" });

    const token = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 20 * 60 * 1000);
    await PasswordReset.findOneAndUpdate({ email }, { token, expiresAt }, { upsert: true });

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`;
    await sendMail({
      to: email,
      subject: "Reset your marketplace password",
      text: `Reset your password using this link: ${resetUrl}`,
    });

    res.json({ message: "If your email exists, reset link has been sent" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to process request" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password || String(password).length < 6) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const resetDoc = await PasswordReset.findOne({ token });
    if (!resetDoc || resetDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const user = await User.findOne({ email: resetDoc.email });
    if (!user) return res.status(400).json({ message: "User not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    await PasswordReset.deleteOne({ token });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to reset password" });
  }
});

router.get("/me", authRequired, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      fullName: req.user.fullName,
      phone: req.user.phone,
      isAdmin: req.user.isAdmin,
    },
  });
});

export default router;
