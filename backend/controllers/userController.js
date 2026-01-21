import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" })
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" })
    }

    const token = createToken(user._id)
    return res.json({ 
      success: true, 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role 
      } 
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ success: false, message: "Server error during login" })
  }
}

const registerUser = async (req, res) => {
  const { name, email, password } = req.body
  
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" })
    }

    const userExists = await userModel.findOne({ email })
    if (userExists) {
      return res.status(409).json({ success: false, message: "User already exists with this email" })
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" })
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    })

    const user = await newUser.save()
    const token = createToken(user._id)

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error("Registration error:", error)
    return res.status(500).json({ success: false, message: "Server error during registration" })
  }
}

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" })
    }

    const user = await userModel.findById(userId).select('-password')
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    return res.json({ success: true, user })
  } catch (error) {
    console.error("Get profile error:", error)
    return res.status(500).json({ success: false, message: "Server error fetching profile" })
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" })
    }

    const { name, email } = req.body
    const updateData = {}

    if (name) updateData.name = name
    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" })
      }
      
      const emailExists = await userModel.findOne({ email, _id: { $ne: userId } })
      if (emailExists) {
        return res.status(409).json({ success: false, message: "Email already in use" })
      }
      updateData.email = email
    }

    const user = await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password')

    return res.json({ success: true, user })
  } catch (error) {
    console.error("Update profile error:", error)
    return res.status(500).json({ success: false, message: "Server error updating profile" })
  }
}

const changePassword = async (req, res) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" })
    }

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new password required" })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters" })
    }

    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    
    user.password = hashedPassword
    await user.save()

    return res.json({ success: true, message: "Password changed successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    return res.status(500).json({ success: false, message: "Server error changing password" })
  }
}

const promoteToAdmin = async (req, res) => {
  try {
    if (!process.env.ADMIN_PROMOTE_SECRET) {
      return res.status(500).json({ success: false, message: 'ADMIN_PROMOTE_SECRET is not configured on the server. Set it in .env and restart backend.' })
    }

    const { secret } = req.body
    if (!secret || secret !== process.env.ADMIN_PROMOTE_SECRET) {
      return res.status(403).json({ success: false, message: 'Invalid or missing admin secret' })
    }

    const userId = req.userId
    if (!userId) return res.status(401).json({ success: false, message: 'Not Authorized' })

    const user = await userModel.findById(userId)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    user.role = 'admin'
    await user.save()

    const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role }
    return res.json({ success: true, message: 'User promoted to admin', user: safeUser })
  } catch (error) {
    console.error('promoteToAdmin error', error)
    return res.status(500).json({ success: false, message: 'Error promoting user' })
  }
}

export { loginUser, registerUser, getUserProfile, updateUserProfile, changePassword, promoteToAdmin }