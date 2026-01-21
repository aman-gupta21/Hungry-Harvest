import express from "express"
import { loginUser, registerUser, getUserProfile, updateUserProfile, changePassword, promoteToAdmin } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"
import userModel from "../models/userModel.js"

const router = express.Router()

router.post("/login", loginUser)
router.post("/register", registerUser)

router.get('/profile', authMiddleware, getUserProfile)
router.put('/profile', authMiddleware, updateUserProfile)
router.post('/change-password', authMiddleware, changePassword)
router.post('/promote-admin', authMiddleware, promoteToAdmin)

router.get('/test', authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select('_id name email role')
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.json({ 
      success: true, 
      message: "Token is valid",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error("Test endpoint error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

export default router