import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import crypto from "crypto";

import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";


const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const DEBUG_LOGS = String(process.env.DEBUG_LOGS || "true") === "true";
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

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"] || crypto.randomUUID();
  req.requestId = String(requestId);
  res.setHeader("X-Request-Id", req.requestId);

  const start = Date.now();
  if (DEBUG_LOGS) {
    console.log(
      JSON.stringify({
        type: "REQUEST_START",
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        origin: req.headers.origin || null,
        ip: req.ip,
      })
    );
  }

  res.on("finish", () => {
    if (!DEBUG_LOGS) return;
    console.log(
      JSON.stringify({
        type: "REQUEST_END",
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Date.now() - start,
      })
    );
  });

  next();
});

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
  console.error(
    JSON.stringify({
      type: "REQUEST_ERROR",
      requestId: req.requestId || null,
      method: req.method,
      path: req.originalUrl,
      message: err.message || "Internal Server Error",
      stack: err.stack || null,
    })
  );
  res.status(500).json({
    message: err.message || "Internal Server Error",
    requestId: req.requestId || null,
  });
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    if (DEBUG_LOGS) {
      console.log(JSON.stringify({ type: "DB_CONNECTED", host: mongoose.connection.host, name: mongoose.connection.name }));
    }
    app.listen(PORT, HOST, () => {
      console.log(
        JSON.stringify({
          type: "SERVER_STARTED",
          port: PORT,
          host: HOST,
          env: process.env.NODE_ENV || "development",
          platformPort: process.env.PORT || null,
        })
      );
    });
  } catch (error) {
    console.error(JSON.stringify({ type: "SERVER_START_FAILED", message: error.message, stack: error.stack || null }));
    process.exit(1);
  }
};

start();
