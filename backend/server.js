import 'dotenv/config';
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebhook } from "./controllers/webhookController.js";

const app = express();

// ✅ Production-ready port
const port = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/*
---------------------------------------------------
 Stripe Webhook (MUST be before express.json)
---------------------------------------------------
*/
app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

/*
---------------------------------------------------
 Middleware
---------------------------------------------------
*/
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/*
---------------------------------------------------
 Database Connection
---------------------------------------------------
*/
connectDB();

/*
---------------------------------------------------
 API Routes
---------------------------------------------------
*/
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

/*
---------------------------------------------------
 Health Check
---------------------------------------------------
*/
app.get("/", (req, res) => {
  res.send("API working");
});

/*
---------------------------------------------------
 Global Error Handler
---------------------------------------------------
*/
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err?.stack || err);
  if (res.headersSent) return next(err);

  res.status(err?.status || 500).json({
    success: false,
    message: err?.message || "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

/*
---------------------------------------------------
 Server Start
---------------------------------------------------
*/
const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Closing server gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

