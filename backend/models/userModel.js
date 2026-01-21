import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { minimize: false, timestamps: true })

const userModel = mongoose.models.User || mongoose.model("User", userSchema)

export default userModel;