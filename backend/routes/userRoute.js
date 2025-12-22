import express from "express"
import { loginUser, registerUser } from "../controllers/userController.js" // important: include .js
import authMiddleware from "../middleware/auth.js"
import userModel from "../models/userModel.js"
const router = express.Router()

router.post("/login", loginUser)
router.post("/register", registerUser)

// Protected test endpoint to verify token is accepted and decoded
router.get('/test', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId
    const user = await userModel.findById(userId).select('-password')
    return res.json({ success: true, userId, user })
  } catch (err) {
    console.error('Auth test error', err)
    return res.status(500).json({ success: false, message: 'Error' })
  }
})

router.post('/promote', authMiddleware, async (req, res) => {
  // delegate to controller to keep logic in one place
  try {
    // require ./userController.js promoteToAdmin
    const { promoteToAdmin } = await import('../controllers/userController.js')
    return promoteToAdmin(req, res)
  } catch (err) {
    console.error('promote route error', err)
    return res.status(500).json({ success: false, message: 'Error' })
  }
})

export default router