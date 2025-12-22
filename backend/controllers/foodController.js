// ...existing code...
import { Food } from "../models/foodModel.js"
import fs from "fs";


const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body

    if (!name || !description || !price || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" })
    }

    const imageFilename = req.file ? req.file.filename : null

    const food = new Food({
      name,
      description,           
      price: Number(price),  
      category,
      image: imageFilename
    })

    await food.save()
    return res.status(201).json({ success: true, message: "Food Added", food })
  } catch (error) {
    console.error(error)
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message
        return acc
      }, {})
      return res.status(422).json({ success: false, message: "Validation failed", errors })
    }
    return res.status(500).json({ success: false, message: "Error", error: error.message })
  }
}

const listFood = async (req,res) => {
  try {
    const foods = await Food.find({});
    res.json({success:true,data:foods})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"});
  }
}

const removeFood = async (req,res) =>{
  try {
    const food = await Food.findById(req.body.id);
    if (food && food.image) {
      fs.unlink(`uploads/${food.image}`, (err) => {
        if (err) console.warn('Failed to delete image file:', err.message)
      })
    }

    await Food.findByIdAndDelete(req.body.id);
    res.json({success:true,message:"food remove"})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:"Error"})

  }
}

export { addFood, listFood,removeFood }
