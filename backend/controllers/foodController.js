import { Food } from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category || !req.file) {
      return res.status(400).json({
        success: false,
        message: "All fields including image are required",
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "food-app",
    });

    // Remove local file
    fs.unlinkSync(req.file.path);

    const food = new Food({
      name,
      description,
      price: Number(price),
      category,
      image: result.secure_url, // 🔥 cloud URL
    });

    await food.save();

    res.status(201).json({
      success: true,
      message: "Food Added Successfully",
      food,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const listFood = async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    res.json({ success: false, message: "Error fetching food list" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await Food.findById(req.body.id);

    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    // Remove from Cloudinary
    const publicId = food.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`food-app/${publicId}`);

    await Food.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    res.json({ success: false, message: "Error deleting food" });
  }
};

export { addFood, listFood, removeFood };
