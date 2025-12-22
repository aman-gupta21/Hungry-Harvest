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

// ✅ Render / Production compatible port
const port = process.env.PORT || 4000;

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
app.use(express.json());

app.use(
  cors({
    origin: "*", // 🔒 replace with frontend URL in production if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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

/*
---------------------------------------------------
 Server Start
---------------------------------------------------
*/
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
