import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

/*
  Multer configuration:
  - No destination folder
  - File stays in memory temporarily
  - Uploaded directly to Cloudinary in controller
*/
const storage = multer.diskStorage({});

const upload = multer({ storage });

/*
  Routes
*/
foodRouter.post("/add", upload.single("image"), addFood);

foodRouter.get("/list", listFood);

foodRouter.post("/remove", removeFood);

export default foodRouter;
