import { Food } from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const isAdminUser = async (userId) => {
  if (!userId) return false;
  return true; 
};

const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, description, price, and category are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number",
      });
    }
    let result;
    try {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "food-delivery-app",
      });
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      // Clean up local file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to cloud storage",
      });
    }

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const food = new Food({
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      category: category.trim(),
      image: result.secure_url,
    });

    await food.save();

    res.status(201).json({
      success: true,
      message: "Food item added successfully",
      food,
    });
  } catch (error) {
    console.error("Add food error:", error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Error adding food item",
      error: error.message,
    });
  }
};

const listFood = async (req, res) => {
  try {
    const foods = await Food.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("List food error:", error);
    res.status(500).json({ success: false, message: "Error fetching food list" });
  }
};
const removeFood = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required",
      });
    }

    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    try {
      if (food.image) {
        const publicId = food.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`food-delivery-app/${publicId}`);
      }
    } catch (deleteError) {
      console.warn("Warning: Failed to delete image from Cloudinary:", deleteError);
    
    }

    await Food.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Food item removed successfully",
    });
  } catch (error) {
    console.error("Remove food error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting food item",
      error: error.message,
    });
  }
};

export { addFood, listFood, removeFood };
