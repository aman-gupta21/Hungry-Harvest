import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/auth.js";

const foodRouter = express.Router();

// Public routes
foodRouter.get("/list", listFood);

// Admin routes (protected)
foodRouter.post("/add", authMiddleware, uploadMiddleware.single("image"), addFood);
foodRouter.post("/remove", authMiddleware, removeFood);

export default foodRouter;
