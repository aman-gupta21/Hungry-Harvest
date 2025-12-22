import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

// create JWT
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const token = createToken(user._id)
    return res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: "Error" })
  }
}

// register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password required" })
    }

    const exists = await userModel.findOne({ email })
    if (exists) {
      return res.status(409).json({ success: false, message: "User already exists" })
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" })
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Please enter a strong password (min 8 chars)" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    })

    const user = await newUser.save()

    // const createToken = (id) => {
    //   return jwt.sign({id},process.env.JWT_SECRET)
    // }
    const token = createToken(user._id)
    res.json({success:true,token});






    // return res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (error) {
    console.error(error)
    res.json({success:false,message:"Error"})
    // return res.status(500).json({ success: false, message: "Error" })
  }
}


// promote currently authenticated user to admin using a secret
const promoteToAdmin = async (req, res) => {
  try {
    // ensure secret is configured
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

export { loginUser, registerUser, promoteToAdmin }