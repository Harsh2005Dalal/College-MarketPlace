import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";


const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean) : []),
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/meta/ngo", (_req, res) => {
  res.json({
    ngo: {
      name: process.env.NGO_NAME || "Campus Partner NGO",
      email: process.env.NGO_EMAIL || "",
      phone: process.env.NGO_PHONE || "",
      upi: process.env.NGO_UPI || "",
      note: process.env.NGO_NOTE || "Products marked donated are handed over by marketplace admin.",
    },
  });
});



app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
