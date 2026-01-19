import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

export const connectDB = async() => {
  try {
    const mongoUri = process.env.MongoUri;
    if (!mongoUri) {
      throw new Error('MongoUri environment variable is not set');
    }
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};